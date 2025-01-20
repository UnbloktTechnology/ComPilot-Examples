"""
ComPilot Customer Data Export Script

This script exports customer data from ComPilot's API to a CSV file, including:
- Basic customer information (name, nationality, etc.)
- KYC status and risk scores
- Associated wallet addresses
- IP address history
- Email information

Features:
- Rate limiting to respect API constraints (15 calls/sec, 300 calls/min)
- Pagination handling for large datasets
- Filters for onboarded customers only
- Detailed error handling and progress tracking
- IP address history tracking with timestamps

Output CSV Fields:
- customer_id: Unique identifier
- name, given_name, family_name: Customer names
- nationality, country_of_residence: Geographic info
- birthdate: Customer's date of birth
- wallets: Associated blockchain wallets
- risk_score: ComPilot risk assessment
- status: Current customer status
- onboarding_level: KYC completion status
- date_onboarded: Initial verification date
- email: Primary email address
- ip_addresses: All recorded IP addresses
- latest_ip: Most recent IP address
- latest_ip_date: Timestamp of last IP usage

Usage:
1. Set COMPILOT_API_KEY in .env file
2. Run script: python csvExport.py
3. CSV file will be generated with timestamp in filename

Requirements:
- Python 3.x
- requests library
- python-dotenv
"""

import requests
import csv
from datetime import datetime
import time
from collections import deque
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class RateLimiter:
    def __init__(self, calls_per_second=15, calls_per_minute=300):
        self.calls_per_second = calls_per_second
        self.calls_per_minute = calls_per_minute
        self.second_window = deque()
        self.minute_window = deque()

    def wait_if_needed(self):
        current_time = time.time()
        
        # Clean up old timestamps
        while self.second_window and self.second_window[0] <= current_time - 1:
            self.second_window.popleft()
        while self.minute_window and self.minute_window[0] <= current_time - 60:
            self.minute_window.popleft()
        
        # Check if we need to wait for rate limits
        while (len(self.second_window) >= self.calls_per_second or 
               len(self.minute_window) >= self.calls_per_minute):
            time.sleep(0.1)
            current_time = time.time()
            
            # Clean up old timestamps again
            while self.second_window and self.second_window[0] <= current_time - 1:
                self.second_window.popleft()
            while self.minute_window and self.minute_window[0] <= current_time - 60:
                self.minute_window.popleft()
        
        # Record this call
        self.second_window.append(current_time)
        self.minute_window.append(current_time)

class CompiLotExporter:
    def __init__(self, api_token=None):
        self.base_url = "https://api.compilot.ai"
        self.headers = {
            "Authorization": f"Bearer {api_token or os.getenv('COMPILOT_API_KEY')}"
        }
        if not api_token and not os.getenv('COMPILOT_API_KEY'):
            raise ValueError("API key must be provided either as parameter or in .env file")
        self.customers = []
        self.rate_limiter = RateLimiter()

    def make_api_call(self, method, url, **kwargs):
        """Make an API call with rate limiting"""
        self.rate_limiter.wait_if_needed()
        response = requests.request(method, url, **kwargs)
        return response

    def get_all_customers(self):
        """Fetch all customers using pagination"""
        current_page = 1
        limit = 100
        total_processed = 0
        
        while True:
            response = self.make_api_call(
                "GET",
                f"{self.base_url}/customers",
                params={"currentPage": current_page, "limit": limit},
                headers=self.headers
            )
            
            if response.status_code != 200:
                raise Exception(f"Failed to fetch customers: {response.status_code}")
            
            data = response.json()
            
            # Filter only Onboarded customers
            onboarded_customers = [
                customer for customer in data["data"] 
                if customer["onboarding_level"] == "Onboarded"
            ]
            self.customers.extend(onboarded_customers)
            
            total_processed += len(data["data"])
            print(f"Processed {total_processed} customers out of {data['totalCount']}")
            
            if total_processed >= data["totalCount"]:
                break
                
            current_page += 1

    def get_customer_details(self, customer_id):
        """Fetch detailed information for a specific customer"""
        response = self.make_api_call(
            "GET",
            f"{self.base_url}/customers/{customer_id}",
            headers=self.headers
        )
        
        if response.status_code != 200:
            print(f"Failed to fetch details for customer {customer_id}")
            return None
            
        return response.json()

    def get_customer_ips(self, customer_id):
        """Fetch IP information for a specific customer"""
        response = self.make_api_call(
            "GET",
            f"{self.base_url}/customers/{customer_id}/ips",
            headers=self.headers
        )
        
        if response.status_code != 200:
            print(f"Failed to fetch IP details for customer {customer_id}")
            return []
        
        return response.json()

    def export_to_csv(self, filename):
        """Export customer data to CSV file"""
        fieldnames = [
            'customer_id', 'name', 'given_name', 'family_name', 'nationality',
            'country_of_residence', 'birthdate', 'wallets', 'risk_score',
            'status', 'onboarding_level', 'date_onboarded', 'email',
            'ip_addresses', 'latest_ip', 'latest_ip_date'  # New fields
        ]

        with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            
            total_customers = len(self.customers)
            for index, customer in enumerate(self.customers, 1):
                details = self.get_customer_details(customer['id'])
                if not details:
                    continue

                # Extract customer claims
                claims = details.get('customerClaims', [])
                claim = claims[0] if claims else {}

                # Extract customer emails
                emails = details.get('customerEmails', [])
                email = emails[0].get('email') if emails else None

                # Extract wallets
                wallets = [w.get('wallet') for w in details.get('customerWallets', [])]

                # Get IP information
                ips = self.get_customer_ips(customer['id'])
                ip_addresses = [ip.get('ipAddress') for ip in ips]
                
                # Get the latest IP and its date
                latest_ip = None
                latest_ip_date = None
                if ips:
                    # Sort IPs by creation date in descending order
                    sorted_ips = sorted(ips, key=lambda x: x.get('createdAt', ''), reverse=True)
                    latest_ip = sorted_ips[0].get('ipAddress')
                    latest_ip_date = sorted_ips[0].get('createdAt')

                row = {
                    'customer_id': details.get('id'),
                    'name': claim.get('name'),
                    'given_name': claim.get('givenName'),
                    'family_name': claim.get('familyName'),
                    'nationality': claim.get('nationality'),
                    'country_of_residence': claim.get('countryOfResidence'),
                    'birthdate': claim.get('birthdate'),
                    'wallets': ', '.join(wallets) if wallets else '',
                    'risk_score': details.get('riskScore'),
                    'status': details.get('status'),  # This already includes Active/Rejected status
                    'onboarding_level': details.get('onboardingLevel'),
                    'date_onboarded': details.get('createdAt'),
                    'email': email,
                    'ip_addresses': ', '.join(ip_addresses) if ip_addresses else '',
                    'latest_ip': latest_ip,
                    'latest_ip_date': latest_ip_date
                }
                writer.writerow(row)
                
                if index % 10 == 0:
                    print(f"Processed {index}/{total_customers} customers")

def main():
    try:
        exporter = CompiLotExporter()
        
        print("Fetching customers...")
        exporter.get_all_customers()
        
        print(f"Found {len(exporter.customers)} onboarded customers")
        
        filename = f"compilot_customers_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        print(f"Exporting to {filename}...")
        
        exporter.export_to_csv(filename)
        print("Export completed!")
    except ValueError as e:
        print(f"Error: {e}")
        print("Please make sure COMPILOT_API_TOKEN is set in your .env file")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
