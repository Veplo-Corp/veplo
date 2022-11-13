import { gql } from '@apollo/client'

const GET_PRODUCTS = gql`
    query GetSingleProduct(
        $name: String!
        $coordinates: [Float]!
        $range: Float!
        $filters: Filters
        ) {
        product(
            id: $id
            name: $name
            coordinates: $coordinates
            range: $range
            filters: $filter
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
            updatedAt
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
