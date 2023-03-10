import { gql } from '@apollo/client'


//! INSERIRE BRAND
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
                canBuy
                status
                
                info{
                    gender
                    macroCategory
                    microCategory
                    brand
                }
                location {
                    type
                    coordinates
                }
                shopInfo{
                    id
                    firebaseId
                    name
                    city
                    status
                }
                variations{
                    color
                    status
                    price {
                        v1
                        discountPercentage
                        v2
                    }
                    photos
                    lots{
                        size
                        quantity
                    }
                }
            }
        } 
    }
`


export default GET_PRODUCTS_FROM_SHOP;
