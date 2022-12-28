import { gql } from '@apollo/client'

const GET_SHOPS_BY_LOCATION = gql`
    query shops(
        $cap: String!
        $range: Int!
        $limit: Int!
        $offset: Int!
    ) {
        shops(
            cap: $cap
            range: $range
            limit: $limit
            offset: $offset
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
        } 
    }
`

export default GET_SHOPS_BY_LOCATION;