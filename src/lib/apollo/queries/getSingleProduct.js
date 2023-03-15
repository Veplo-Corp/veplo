import { gql } from '@apollo/client'

const GET_SINGLE_PRODUCT = gql`
    query product($id: ID!) {
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
            shopInfo{
                id
                firebaseId
                name 
                city
                status
            }
        } 
    }
    
`

export default GET_SINGLE_PRODUCT;
