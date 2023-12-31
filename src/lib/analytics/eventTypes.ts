export enum GTMEventType {
    empty = '',
    signUp = 'sign_up',
    login = 'login',
    discount_button_or_toggle = 'discount_button_or_toggle',
    sustainable_button_or_toggle = 'sustainable_button_or_toggle',
    purchase = 'purchase',
    begin_checkout = 'begin_checkout',
    add_to_cart = 'add_to_cart',
    remove_from_cart = 'remove_from_cart',
    exception = 'exception',
    // selectItem = 'select_item',
    // addShippingInfo = 'add_shipping_info',
    // beginCheckout = 'begin_checkout',  
}

export enum PixelEventType {
    purchase = 'Purchase',
    addToCart = 'AddToCart',
    initiateCheckout = 'InitiateCheckout'
}

export type VeploPixelEvent = {
    command: PixelEventType,
    args?: {
        value?: number,
        currency?: 'EUR'
    },
    eventID?: {
        eventID?: string
    }
}

export type VeploGTMEvent = {
    command: GTMEventType,
    args: {
        method?: 'Google' | 'Email',
        email?: string | undefined | null,
        device?: 'Web' | 'Mobile',
        event_category?: string,
        label?: string,
        userType?: 'Business' | 'Customer',
        firebaseId?: string,
        mongoId?: string,
        firstName?: string,
        lastName?: string,
        gender?: 'male' | 'female' | 'not_speficied',
        ecommerce?: any,
        page_section?: string,
        description?: string
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