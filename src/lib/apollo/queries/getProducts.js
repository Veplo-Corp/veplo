import { gql } from '@apollo/client'

const GET_PRODUCTS = gql`
    query products(
        $name: String
        $cap: String
        $range: Float!
        $gender: String
        $macroCategory: String
        ) {
        products(
            name: $name,
            cap: $cap,
            range: $range,
            gender: $gender,
            macroCategory: $macroCategory
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
