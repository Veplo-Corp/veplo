import { gql } from '@apollo/client'

const GET_SHOPS_BY_LOCATION = gql`
    query shops(
        $limit: Int!
        $offset: Int!
        $filters: ShopFilters!
    ) {
        shops(
            limit: $limit
            offset: $offset
            filters: $filters
        ){
            id
            businessId
            name
            createdAt
            status
            photo
            isDigitalOnly
            info{
                phone
                description
                opening{
                    days
                    hours
                }
            }
            address{
                postcode
                city
                street
                location {
                    type
                    coordinates
                }
            }
        } 
    }
`

export default GET_SHOPS_BY_LOCATION;