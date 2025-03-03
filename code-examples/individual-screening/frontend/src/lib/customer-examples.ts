import { generateRandomWallet, generateRandomEmail, generateRandomPhone, generateRandomName, generateRandomCountryCode, generateRandomAge } from './generators';

const baseCustomerData = (forceCountry?: 'EU' | 'US', isUnder18: boolean = false) => {
  const wallet = generateRandomWallet();
  const externalId = `cust_${Math.random().toString(36).substring(2, 15)}`;
  const { firstName, lastName } = generateRandomName();
  const countryCode = generateRandomCountryCode(forceCountry);
  const age = generateRandomAge(isUnder18);
  
  return {
    workspaceId: process.env.NEXT_PUBLIC_WORKSPACE_ID,
    organizationId: process.env.NEXT_PUBLIC_ORGANIZATION_ID,
    workflowId: process.env.NEXT_PUBLIC_WORKFLOW_ID,
    customerPersonalInformation: {
      age,
      nationality: countryCode,
      residence: countryCode
    },
    customerData: [{
      customerWallet: {
        wallet,
        blockchainNamespace: "eip155",
        verified: true
      },
      externalId,
      status: "Active",
      onboardingLevel: "Onboarded"
    }],
    contactInformation: {
      email: generateRandomEmail(),
      phone: generateRandomPhone()
    },
    customerPersonalData: {
      credentials: [{
        id: "adiuvo",
        "@context": ["advoco", "vulgo", "antea"],
        type: ["IDInformation"],
        expirationDate: "2025-12-31",
        issuanceDate: "2023-01-01",
        credentialSubject: {
          id: "https://example.com",
          journeyId: "8a53d8e1-a64b-4154-b177-057c9c563b9d",
          reviewAnswer: "GREEN",
          reviewRejectType: "RETRY",
          reviewRejectLabels: ["BLACK_AND_WHITE"],
          documentType: "RESIDENCE_PERMIT",
          entryDate: Date.now(),
          entryTime: new Date().toISOString(),
          personalData: {
            firstName,
            lastName,
            middleName: null,
            gender: "not_specified",
            age,
            citizenship: countryCode,
            country: countryCode,
            fullName: `${firstName} ${lastName}`,
            birthDate: 19930821,
            countryOfBirth: countryCode,
            stateOfBirth: null
          },
          isSandbox: true
        },
        credentialStatus: {
          id: "status-1",
          type: "Iden3OnchainSparseMerkleTreeProof2023",
          revocationNonce: 123456789
        },
        issuer: "compilot",
        credentialSchema: {
          id: "schema-1",
          type: "JsonSchemaValidator2018"
        }
      }],
      requestIp: "226.16.185.133",
      address: wallet,
      cmsProjectId: process.env.NEXT_PUBLIC_CMS_PROJECT_ID!
    }
  };
};

export const customerExamples = {
  nationality: {
    eu: {
      description: 'EU citizen',
      data: baseCustomerData('EU')
    },
    us: {
      description: 'US Citizen',
      data: baseCustomerData('US')
    }
  },
  age: {
    over18: {
      description: 'Older than 18',
      data: baseCustomerData(undefined, false)
    },
    under18: {
      description: 'Younger than 18',
      data: baseCustomerData(undefined, true)
    }
  },
  walletRisk: {
    low: {
      description: 'Low risk wallet',
      data: baseCustomerData()
    },
    high: {
      description: 'High risk wallet',
      data: baseCustomerData()
    }
  },
  amlHits: {
    has: {
      description: 'Has AML hits',
      data: baseCustomerData()
    },
    none: {
      description: 'No AML hits',
      data: baseCustomerData()
    }
  }
}; 