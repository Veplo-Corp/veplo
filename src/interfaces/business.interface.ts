import { Shop } from './shop.interface';
// export interface Shop {
//     id: string
//     name: string,
//     createdAt: string,
//     status: string,
//     photo: string,
//     isDigitalOnly: boolean
//     info: {
//         phone: string,
//         description: string,
//         opening: {
//             days: number[]
//             hours: string[]
//         }
//     }
//     address: {
//         postcode: string,
//         city: string,
//         street: string,
//         location: {
//             type: string,
//             coordinates: number[]
//         }
//     }
// }

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
    shops?: Shop[];

}
