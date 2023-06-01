import { gql } from '@apollo/client'

const GET_SHOP = gql`
    query shop(
        $id: ID!
        ) {
        shop(
            id: $id
        ){
            id
            businessId
            name
            categories
            createdAt
            status
            profilePhoto
            profileCover
            isDigitalOnly
            minimumAmountForFreeShipping
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

export default GET_SHOP;


