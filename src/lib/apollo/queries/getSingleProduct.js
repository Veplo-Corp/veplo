import { gql } from '@apollo/client'

const GET_SINGLE_PRODUCT = gql`
    query getProduct($id: ID!) {
        product(
            id: $id
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
                traits
                length
                materials
                description
                modelDescription
                univers
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
export default GET_SINGLE_PRODUCT;
