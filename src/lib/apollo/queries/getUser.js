import { gql } from '@apollo/client'
import { graphql } from '../generated/gql'


const GET_USER = graphql(`
    query user(
        $limit: Int!
        $offset: Int!
        $onlyIds: Boolean!
    ){
        user{
            id,
            name,
            surname,
            stripeId,
            firebaseId,
            email,
            phone,
            gender,
            following(
                limit: $limit
                offset: $offset
                onlyIds: $onlyIds
            ){
                shopId
            }
            createdAt,
            carts{
                carts
                {
                    id
                    userId
                    shopInfo {
                        id
                        name{
                            unique
                            visualized
                        }
                        profilePhoto
                    }
                    total
                    productVariations{
                        productId
                        id
                        quantity
                        color
                        size
                        price{
                            v1
                            v2
                            discountPercentage
                        }
                    }
                }
                warnings {
                    photo
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
        }
    }
`)

export default GET_USER;