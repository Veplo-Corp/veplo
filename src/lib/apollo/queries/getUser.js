import { gql } from '@apollo/client'
import { graphql } from '../generated/gql'


const GET_USER = graphql(`
    query user{
        user{
            id,
            name,
            surname,
            stripeId,
            firebaseId,
            email,
            phone,
            gender,
            createdAt,
            carts{
                carts
                {
                    id
                    userId
                    shopInfo {
                        id
                        name
                        city
                        status
                        minimumAmountForFreeShipping
                        profilePhoto
                    }
                    total
                    productVariations{
                        productId
                        id
                        photo
                        name
                        quantity
                        maxQuantity
                        color
                        size
                        brand
                        price{
                            v1
                            v2
                            discountPercentage
                        }
                    }
                }
                warnings {
                    variationId
                    color
                    size
                    isSizeNonExisting
                    isQuantityTooMuch
                    isProductNonExisting
                    isVariationNonExisting
                    name
                    quantity
                }
            } 
            orders(
                limit:100,
                offset:0
            )
            {
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
                    name
                    photo
                }
                productVariations{
                    productId
                    id
                    photo
                    name
                    
                }
                
               
                history {
                    date
                    status
                  }
            }
        }
    }
`)

export default GET_USER;