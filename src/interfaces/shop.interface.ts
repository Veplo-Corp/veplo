export interface Shop {
    id: string,
    name:string,
    status:string,
    piva: string,
    phone:string,
    createdAt:string,
    firebaseId: string,
    photo:string,
    opening:{
        days: number[],
        hours: string[]
    }
    address: {
        postcode:string,
        city:string,
        street:string,
        location:{
            type:String
            coordinates:number[]
        }
        macroCategories?: string[],
        description?:string,
        gender?: string[],
    }
}
