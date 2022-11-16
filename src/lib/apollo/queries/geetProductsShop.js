import { gql } from '@apollo/client'


//TODO!
const GET_PRODUCTS_FROM_SHOP = gql`
    query GetSingleShop($id: ID!) {
        shop(
            id: $id
        ){
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
                updatedAt
                location {
                    type
                    coordinates
                }
                shop {
                    city
                    name
                }
            }
        } 
    }
`

export default GET_PRODUCTS_FROM_SHOP;
