import { gql } from '@apollo/client'


//! INSERIRE BRAND
const GET_SIMILAR_PRODUCT_ON_SHOP = gql`
query Product($productId: ID!, $offset: Int!, $limit: Int!, $shopId: ID) {
    product(id: $productId) {
        productsLikeThis(offset: $offset, limit: $limit, shopId: $shopId) {
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
        id
    }
  }
  
`


export default GET_SIMILAR_PRODUCT_ON_SHOP;
