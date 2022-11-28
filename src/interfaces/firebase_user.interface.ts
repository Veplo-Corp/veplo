export interface Firebase_User {
    email: string,
    uid: string,
    idToken: string,
    emailVerified?: string,
    isShop?: boolean,
    createdAt?: string,
    shopId?:string,
    Not_yet_Authenticated_Request?: boolean
}