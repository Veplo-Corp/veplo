import { gql } from '@apollo/client'


const GET_PRODUCTS_FROM_SHOP = gql`
    query GetProductsFromSingleShop(
        $id: ID!
        $limit: Int!
        $offset: Int!
        $filters: ProductFilters!
        ) {
        shop(
            id: $id
        )  {
                id
                
                products(
                    limit: $limit
                    offset: $offset
                    filters: $filters
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
                            name{
                                unique
                                visualized
                            } 
                            city
                            status
                            profilePhoto
                        }
                    }
                } 
            
            
            } 
        }
`


export default GET_PRODUCTS_FROM_SHOP;
