export interface Mapbox_Result {
    placeType: string,
    location: {
        type: string,
        coordinates: number[]
    },
    postcode: string | undefined,
    city: string | undefined,
    address: string | undefined,
    streetNumber: string | undefined
}