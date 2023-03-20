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
                status
                canBuy
                info {
                    gender
                    macroCategory
                    microCategory
                    brand
                    fit
                }
                variations{
                id
                color
                status
                photos
                lots {
                    size
                    quantity
                    }
                }
                price {
                    v1
                    discountPercentage
                    v2
                }
                shopInfo{
                    id
                    businessId
                    name 
                    city
                    status
                }
            }
            
        } 
    }
`

export default GET_SHOP_AND_PRODUCTS;


