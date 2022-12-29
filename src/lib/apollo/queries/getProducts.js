import { gql } from '@apollo/client'

const GET_PRODUCTS = gql`
    query products(
        $range: Float!
        $limit: Int!
        $offset: Int!
        $filters: ProductFilters!   
        ) {
        products(
            range: $range,
            limit: $limit
            offset: $offset
            filters: $filters    
        ){
            id
            name
            price
            colors
            sizes
            macroCategory
            microCategory
            gender
            brand
            shopId
            firebaseShopId
            photos
            location {
                type
                coordinates
            }
            shopOptions {
                city
                name
            }
        } 
    }
    
`

export default GET_PRODUCTS;
