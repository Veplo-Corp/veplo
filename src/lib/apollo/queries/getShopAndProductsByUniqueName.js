import { graphql } from '../generated/gql'

const GET_SHOP_AND_PRODUCTS_BY_UNIQUE_NAME = graphql(`
    query shopByUniqueName(
        $name: String!
        $limit: Int!
        $offset: Int!
        $filters: ProductFilters!
        ) {
            shopByUniqueName(
            name: $name
        ){
            id
            businessId
            name{
                unique
                visualized
            }
            createdAt
            status
            links{
                instagram
                tiktok
            }
            stats{
                followers
                averagePrice
                productsQuantity
            }
            profilePhoto
            profileCover
            categories
            minimumAmountForFreeShipping
            info{
                phone
                description
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
                filters: $filters
            ) 
            {
                products{
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
                        name{
                            unique
                            visualized
                        } 
                        city
                        status
                        profilePhoto
                    }
                }
                
            }
            
        } 
    }
`)

export default GET_SHOP_AND_PRODUCTS_BY_UNIQUE_NAME;


