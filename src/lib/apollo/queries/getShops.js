import { gql } from '@apollo/client'

const GET_SHOPS_BY_LOCATION = gql`
    query shops(
        $range: Int!
        $limit: Int!
        $offset: Int!
        $filters: ShopFilters!
    ) {
        shops(
            range: $range
            limit: $limit
            offset: $offset
            filters: $filters
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

export default GET_SHOPS_BY_LOCATION;