import { graphql } from '../generated/gql'


const GET_USER_FOLLOWINGS = graphql(`
    query userFollowings(
        $limit: Int!
        $offset: Int!
        $onlyIds: Boolean!
    ){
        user{
            id
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
        }
    }
`)

export default GET_USER_FOLLOWINGS;