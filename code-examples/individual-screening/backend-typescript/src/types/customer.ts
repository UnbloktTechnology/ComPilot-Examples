export interface CustomerPersonalInformation {
    age: number;
    nationality: string;
    residence: string;
}

export interface CustomerWallet {
    wallet: string;
    blockchainNamespace: string;
    verified: boolean;
    externalId?: string;
}

export interface ContactInformation {
    email: string;
    phone: string;
}

export interface Credential {
    id: string;
    "@context": string[];
    type: string[];
    expirationDate: string;
    issuanceDate: string;
    credentialSubject: {
        id: string;
        journeyId: string;
        reviewAnswer: string;
        reviewRejectType: string;
        reviewRejectLabels: string[];
        documentType: string;
        entryDate: number;
        entryTime: string;
        personalData: {
            firstName: string;
            lastName: string;
            middleName?: string;
            gender?: string;
            age: number;
            citizenship: string;
            country: string;
            fullName: string;
            birthDate: number;
            countryOfBirth: string;
            stateOfBirth?: string;
        };
        isSandbox: boolean;
    };
    credentialStatus: {
        id: string;
        type: string;
        revocationNonce: number;
    };
    issuer: string;
    credentialSchema: {
        id: string;
        type: string;
    };
}

export interface CustomerPersonalData {
    credentials: Credential[];
    requestIp: string;
    address: string;
    cmsProjectId: string;
}

export interface Customer {
    workspaceId: string;
    organizationId: string;
    workflowId: string;
    externalId: string;
    status: 'Active' | 'Inactive' | 'Failed' | 'Rejected' | 'Pending';
    onboardingLevel: 'Onboarded' | 'KYC';
    customerPersonalInformation: CustomerPersonalInformation;
    customerData: Array<{
        customerWallet: CustomerWallet;
    }>;
    contactInformation: ContactInformation;
    customerPersonalData: CustomerPersonalData;
}

export interface CustomerResponse {
    id: string;
    status: 'active' | 'failed' | 'rejected' | 'under_review';
    message?: string;
} 