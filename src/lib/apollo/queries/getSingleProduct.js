import { gql } from '@apollo/client'

const GET_SINGLE_PRODUCT = gql`
    query GetSingleProduct($id: ID!) {
        product(
            id: $id
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
            gender
        } 
    }
    
`

export default GET_SINGLE_PRODUCT;
