import { gql } from '@apollo/client'


//! INSERIRE BRAND
const GET_PRODUCTS_FROM_SHOP = gql`
    query GetSingleShop(
        $id: ID!
        $limit: Int!
        $offset: Int!
        ) {
        shop(
            id: $id
        )  {
                id
                products(
                    limit: $limit
                    offset: $offset
                ){
                    products{
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
            
            
            } 
        }
`


export default GET_PRODUCTS_FROM_SHOP;
