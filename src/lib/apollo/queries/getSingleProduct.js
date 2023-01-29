import { gql } from '@apollo/client'

const GET_SINGLE_PRODUCT = gql`
    query GetSingleProduct($id: ID!) {
        product(
            id: $id
        ){
            id
            name
            price{
                v1
                v2
                discountPercentage
            }
            colors
            sizes
            macroCategory
            microCategory
            brand
            shopId
            firebaseShopId
            photos
            updatedAt
            location {
                type
                coordinates
            }
            shopOptions {
                city
                name
            }
            gender
        } 
    }
    
`

export default GET_SINGLE_PRODUCT;
