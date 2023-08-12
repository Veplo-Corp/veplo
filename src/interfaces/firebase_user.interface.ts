import { Univers } from './../../components/mook/categories';
export interface Firebase_User {
    email: string,
    uid: string,
    idToken: string,
    emailVerified?: boolean,
    isBusiness?: boolean,
    createdAt?: string,
    shopId?: string,
    statusAuthentication?: 'not_yet_authenticated' | 'logged_out' | 'logged_in',
    accountId?: string,
    favouriteShop?: {
        name: string,
        id: string,
        street: string
    }
    favouriteShops?: string[],
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
    genderSelected?: 'f' | 'm',
    expirationTime: string,
    gategoryTypeSelected: string
}