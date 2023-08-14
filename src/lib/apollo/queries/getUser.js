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
                shop{
                    categories
                    id
                    name{
                        unique
                        visualized
                    }
                    status
                    stats{
                        followers
                        averagePrice
                        productsQuantity
                    }
                    profileCover
                    profilePhoto
                    stats{
                        followers
                        averagePrice
                        productsQuantity
                    }
                    minimumAmountForFreeShipping
                }
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
                        id
                        quantity
                        color
                        size
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