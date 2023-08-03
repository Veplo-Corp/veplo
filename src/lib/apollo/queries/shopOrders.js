import { gql } from '@apollo/client'

const GET_SHOP_ORDERS = gql`

    query shop(
        $id: ID!,
        $statuses: [String!],
        $limit: Int!,
        $offset: Int!
        ) {
        shop(
            id: $id
        ){
            id
            status
            name
            orders(
                statuses: $statuses
                limit: $limit
                offset: $offset
            ){
                id
                code
                cartId
                createdAt
                totalDetails{
                    amountDiscount
                    amountShipping
                    subTotal
                    total
                }
                status
                shop{
                    id
                }
                recipient{
                    name
                }  
            }
        } 
    }
`

export default GET_SHOP_ORDERS;


