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
            sizeGuidePhoto
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
                name{
                    unique
                    visualized
                } 
                city
                status
                minimumAmountForFreeShipping
                profilePhoto
            }
            
        } 
    }
    
`
export default GET_SINGLE_PRODUCT;
