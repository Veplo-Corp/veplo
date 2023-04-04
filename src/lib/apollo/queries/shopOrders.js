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
                    businessId
                    stripeId
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
                user{
                    stripeId
                    id
                    email
                    name
                    surname
                }
                recipient{
                    name
                    phone
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


