import { gql } from '@apollo/client'

const GET_SHOP_ORDERS = gql`
    query shop(
        $id: ID!
        $statuses: [String!]
        ) {
        shop(
            id: $id
        ){
            id
            address{
                postcode
                city
                street
                location {
                    type
                    coordinates
                }
            }
            status
            name
            orders(
                statuses: $statuses
            ){
              id  
            }
        } 
    }
`

export default GET_SHOP_ORDERS;


