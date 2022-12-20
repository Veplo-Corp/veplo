import { gql } from '@apollo/client'

const GET_PRODUCTS = gql`
    query getProducts(
        $name: String
        $cap: String
        $range: Float!
        $gender: String
        $macroCategory: String
        ) {
        products(
            name: $name
            cap: $cap
            range: $range
            gender: $gender
            macroCategory: $macrocategory
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
