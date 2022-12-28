import { gql } from '@apollo/client'


//TODO!
const GET_PRODUCTS_FROM_SHOP = gql`
    query GetSingleShop($id: ID!) {
        shop(
            id: $id
        ){
            id
            products {
                id
                name
                price
                colors
                sizes
                macroCategory
                microCategory
                gender
                brand
                shopId
                firebaseShopId
                photos
                
                location {
                    type
                    coordinates
                }
                shopOptions {
                    city
                    name
                }
                gender
            }
        } 
    }
`

export default GET_PRODUCTS_FROM_SHOP;
