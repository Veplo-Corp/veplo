import { gql } from '@apollo/client'


//TODO!
const GET_SINGLE_SHOP = gql`
    query GetSingleShop($id: ID!) {
        shop(
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
            id
        } 
    }
`

export default GET_SINGLE_SHOP;
