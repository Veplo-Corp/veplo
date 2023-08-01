import { graphql } from '../generated/gql'

const GET_SHOP_AND_PRODUCTS = graphql(`
    query getShop(
        $id: ID!
        $limit: Int!
        $offset: Int!
        $filters: ProductFilters!
        ) {
        shop(
            id: $id
        ){
            id
            businessId
            name
            createdAt
            status
            profilePhoto
            profileCover
            categories
            isDigitalOnly
            minimumAmountForFreeShipping
            info{
                phone
                description
                opening{
                    days
                    hours
                }
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
                        name 
                        city
                        status
                        profilePhoto
                    }
                }
                
            }
            
        } 
    }
`)

export default GET_SHOP_AND_PRODUCTS;


