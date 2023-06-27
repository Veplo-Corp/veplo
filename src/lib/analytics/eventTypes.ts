export enum GTMEventType {
    empty = '',
    signUp = 'sign_up',
    login = 'login',
    saleToggle = 'sale_toggle'
    // selectItem = 'select_item',
    // addShippingInfo = 'add_shipping_info',
    // beginCheckout = 'begin_checkout',
    // purchase = 'purchase',
    // ecStepCompanyData = 'ecStepCompanyData',
    // ecStepLinkBanks = 'ecStepLinkBanks',
    // ecStepTypLending = 'ecStepTyLending',
    // ecStepTypConto = 'ecStepTypConto',
    // legislationFacta = 'normativa_facta',
    // beRecognized = 'completa_profilo',
    // signContract = 'approva_proposta',
    // otp = 'otp_preapprovazione',
    // signOK = 'firma_ok',
    // signKO = 'firma_ko',
    // companyData = 'dati_azienda',
    // productChoice = 'scelta_finanziamento',
    // signLending = 'accedi_finanziamento',
    // otpProductChoice = 'otp_step_1',
    // chooseLegalRepresentative = 'parlaci_di_te',
    // legalRepresentative = 'legale_rappresentante',
    // beneficialOwners = 'titolari_effettivi',
    // evaluateProposal = 'proposta_visualizzata',
    // fillLegislation = 'antiriciclaggio'
}

export type VeploGTMEvent = {
    command: GTMEventType,
    args: {
        method?: 'Google' | 'Email',
        email?: string,
        device?: 'Web' | 'Mobile',
        event_category?: string,
        label?: string,
        user?: 'Business' | 'Customer',
        firebaseId?: string,
        mongoId?: string,
        firstName?: string,
        lastName?: string,
        gender?: 'male' | 'female' | 'not_speficied'
    }
}

export type AideXaGTMEvent = {
    //sono gli args
    ecommerce?: EcommerceType;
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    street?: string;
    city?: string;
    region?: string;
    country?: string;
    postalCode?: string;
    vatNumber?: string;
    onboardingProcessId?: string;
};
export type EcommerceType = {
    currency?: string;
    value?: number;
    items: ItemType[];
    transaction_id?: string;
};

export type ItemType = {
    item_id?: string;
    item_name?: string;
};