import { graphql } from '../generated/gql'


const GET_CART = graphql(`
    query cart(
        $id: ID!
    ){
        cart(
            id: $id
        ){
            carts{
                id
                userId
                shopInfo {
                    id
                    name{
                        unique
                        visualized
                    }
                    city
                    status
                    minimumAmountForFreeShipping
                    profilePhoto
                }
                total
                productVariations{
                    productId
                    id
                    photo
                    name
                    quantity
                    maxQuantity
                    color
                    size
                    brand
                    price{
                        v1
                        v2
                        discountPercentage
                    }
                }
            }
            
        }
    }
`)

export default GET_CART;