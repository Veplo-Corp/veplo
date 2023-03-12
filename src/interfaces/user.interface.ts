export interface User {
    carts?: any[],
    createdAt?: string
    email: string
    firebaseId: string,
    gender: 'M' | 'F'
    id: string,
    location: string
    name: string
    phone?: any
    stripeId: string
    surname: string
}