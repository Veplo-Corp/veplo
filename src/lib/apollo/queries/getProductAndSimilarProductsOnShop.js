import { graphql } from '../generated/gql'


//! INSERIRE BRAND
const GET_PRODUCT_AND_SIMILAR_PRODUCTS_ON_SHOP = graphql(`
query getProductAndSimilarProduct($id: ID!, $offset: Int!, $limit: Int!, $ofThisShop: Boolean!) {
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
            name{
                unique
                visualized
            } 
            city
            status
            minimumAmountForFreeShipping
            profilePhoto
        }
        productsLikeThis(offset: $offset, limit: $limit, ofThisShop: $ofThisShop) {
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
                name{
                    unique
                    visualized
                } 
                city
                status
            }
        }
    } 
}
  
`)


export default GET_PRODUCT_AND_SIMILAR_PRODUCTS_ON_SHOP;
