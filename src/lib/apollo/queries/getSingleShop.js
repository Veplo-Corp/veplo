import { gql } from '@apollo/client'

const GET_SHOP_AND_PRODUCTS = gql`
    query shop(
        $id: ID!
        $limit: Int!
        $offset: Int!
        $see: String
        ) {
        shop(
            id: $id
        ){
            id
            businessId
            name
            createdAt
            status
            photo
            isDigitalOnly
            info{
                phone
                description
                opening{
                    days
                    hours
                }
            }
            address{
                postcode
                city
                street
                location {
                    type
                    coordinates
                }
            }
            products(
                limit: $limit
                offset: $offset
                see: $see
            ) {
                id
                name
                canBuy
                status
                price {
                    v1
                    discountPercentage
                    v2
                }
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
                    businessId
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

export default GET_SHOP_AND_PRODUCTS;


