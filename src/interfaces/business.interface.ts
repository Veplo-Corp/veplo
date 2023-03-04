export interface Business {

    firebaseId: string,
    vatNumber: string,
    email: string,
    businessName: string,
    phone: string,
    status: 'stripe_id_requested' | 'onboarding_KYC_requested' | 'not_active' | 'active',
    createdAt: string,
    stripe: {
        id: string
    }


}
