import { gql } from '@apollo/client'
import { graphql } from '../generated/gql'


const GET_USER_ORDERS = graphql(`
    query userOrders{
        user{
            id,
            orders(
                limit:100,
                offset:0
            )
            {
                id
                code
                cartId
                createdAt
                totalDetails{
                    total
                }
                status
                shop{
                    name{
                        unique
                        visualized
                    }
                    photo
                }
                productVariations{
                    id
                    photo                    
                }
                history {
                    date
                    status
                  }
            }
        }
    }
`)

export default GET_USER_ORDERS;