import { gql } from '@apollo/client'
import { graphql } from '../generated/gql'

const GET_PRODUCTS = graphql(`
    query products(
        $limit: Int!
        $offset: Int!
        $filters: ProductFilters!  
        $sort: ProductSort 
        ) {
        products(
            limit: $limit
            offset: $offset
            filters: $filters  
            sort:$sort  
        ){
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
                    traits
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
                    minimumAmountForFreeShipping
                }
            }
        } 
    }
    
`)

export default GET_PRODUCTS;
