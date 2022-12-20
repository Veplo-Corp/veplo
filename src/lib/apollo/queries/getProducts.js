import { gql } from '@apollo/client'

const GET_PRODUCTS = gql`
    query products(
        $range: Float!
        $limit: Int!
        $offset: Int!
        $filters: Filters    
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
            shop {
                city
                name
            }
        } 
    }
    
`

export default GET_PRODUCTS;
