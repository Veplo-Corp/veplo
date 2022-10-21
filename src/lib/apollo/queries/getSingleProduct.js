import { gql } from '@apollo/client'

const GET_SINGLE_PRODUCT = gql`
    query GetSingleProduct($id: ID!) {
        product(
            id: $id
        ){
            name
            colors
            macroCategory
            microCategory
            price
            sizes
            location {
            type
            coordinates
            }
            brand
            gender
        } 
    }
`

export default GET_SINGLE_PRODUCT;
