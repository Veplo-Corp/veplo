import { gql } from '@apollo/client'

const GET_ORDER = gql`
    query order(
        $id: ID!
        ) {
        order(
            id: $id
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
                name{
                    unique
                    visualized
                }
                photo
                businessName
                address{
                    postcode
                    city
                    street
                }
            }
            shipping{
                url
                courier
                code
            }
            productVariations{
                productId
                id
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
                firebaseId
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
            history {
                date
                status
              }
        }   
    }
`

export default GET_ORDER;


