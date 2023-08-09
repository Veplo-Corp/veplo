import { graphql } from '../generated/gql'

const GET_LAST_ORDER_USER_FROM_SHOP = graphql(`
    query lastOrderFromShopByUser(
        $userId: ID!
        $shopId: ID!
        ) {
            lastOrderFromShopByUser(
            userId: $userId
            shopId: $shopId
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
    
`)

export default GET_LAST_ORDER_USER_FROM_SHOP;
