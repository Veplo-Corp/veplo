export interface Firebase_User {
    email: string,
    uid: string,
    idToken: string,
    emailVerified?: boolean,
    isBusiness?: boolean,
    createdAt?: string,
    shopId?: string,
    Not_yet_Authenticated_Request?: boolean,
    accountId?: string,
    favouriteShop?: {
        name: string,
        id: string,
        street: string
    }
    userInfo?: {
        stripeId?: string,
        name?: string,
        surname?: string,
        location?: {
            type: string,
            coordinates: number[]
        }
        gender?: string
    }
}