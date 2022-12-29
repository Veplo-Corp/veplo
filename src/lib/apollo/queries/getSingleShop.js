import { gql } from '@apollo/client'

const GET_SINGLE_SHOP = gql`
    query shop($id: ID!) {
        shop(
            id: $id
        ){
            id
            name
            status
            piva
            phone
            firebaseId
            address{
                postcode
                city
                street
                location{
                    type
                    coordinates
                }
            }
            createdAt
            photo
            opening{
                days
                hours
            }
        } 
    }
`

export default GET_SINGLE_SHOP;
