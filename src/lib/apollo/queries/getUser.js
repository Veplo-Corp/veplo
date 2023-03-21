import { gql } from '@apollo/client'

const GET_USER = gql`
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
                    }
                    total
                    productVariations{
                        productId
                        id
                        variationId
                        photo
                        name
                        quantity
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
            } 
            orders{
                id
                cartId
                uniqueId
                createdAt
                totalDetails{
                    amountDiscount
                    amountShipping
                    subTotal
                    total
                }
                shop{
                    id
                    name
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
                    quantity
                    color
                    size
                }
            }
        }
    }
`

export default GET_USER;