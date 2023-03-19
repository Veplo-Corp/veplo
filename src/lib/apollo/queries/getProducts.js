import { gql } from '@apollo/client'

const GET_PRODUCTS = gql`
    query products(
        $limit: Int!
        $offset: Int!
        $filters: ProductFilters!   
        ) {
        products(
            limit: $limit
            offset: $offset
            filters: $filters    
        ){
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
            }
        } 
    }
    
`

export default GET_PRODUCTS;
