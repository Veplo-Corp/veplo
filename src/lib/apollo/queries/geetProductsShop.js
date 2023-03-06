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


/* id
name
status
canBuy
createdAt
updatedAt
info
location
shopInfo
variations */


/* price{
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
                status */