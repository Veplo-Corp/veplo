import { gql } from '@apollo/client'

const GET_SHOP_ORDERS = gql`
    query shop(
        $id: ID!
        $statuses: [String!]
        ) {
        shop(
            id: $id
        ){
            id
            address{
                postcode
                city
                street
                location {
                    type
                    coordinates
                }
            }
            status
            name
            orders(
                statuses: $statuses
            ){
                id
                code
                cartId
                createdAt
                totalDetails{
                    amountDiscount
                    amountShipping
                    subTotal
                    total
                }
                status
                shop{
                    id
                    name
                }
                shipping{
                    url
                    courier
                    code
                }
                productVariations{
                    productId
                    variationId
                    photo
                    name
                    price{
                        v1
                        v2
                        discountPercentage
                    }
                    brand
                    quantity
                    color
                    size
                }
                recipient{
                    id
                    name
                    address{
                        city
                        country
                        line1
                        line2
                        postalCode
                        state
                    }
                }  
            }
        } 
    }
`

export default GET_SHOP_ORDERS;


