import { gql } from '@apollo/client'


//TODO!
const GET_PRODUCTS_FROM_SHOP = gql`
    query GetSingleShop(
        $id: ID!
        $limit: Int!
        $offset: Int!
        $see: String
        ) {
        shop(
            id: $id
            
        ){
            id
            products(
                limit: $limit
                offset: $offset
                see: $see
            ) {
                id
                name
                price{
                    v1
                    v2
                    discountPercentage
                }
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
                status
            }
        } 
    }
`

export default GET_PRODUCTS_FROM_SHOP;
