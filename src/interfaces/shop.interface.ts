export interface SHOP {
    id: string,
    name:string,
    photo:string,
    status:string,
    
    openingDays: number[],
    openingHours: number[],
    address: {
        postcode:string,
        city:string,
        address:string,
        location:{
            type:String
            coordinates:number[]
        }
        macroCategories: string[],
        description:string,
        creationTime: string,
        gender: string[],
        firebaseId: string
    }
}
