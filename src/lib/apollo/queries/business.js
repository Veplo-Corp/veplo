import { gql } from '@apollo/client'

const GET_BUSINESS = gql`
    query business($id: ID!) {
        business(
            id: $id
        ){
            firebaseId
            vatNumber
            email
            businessName
            phone
            status
            createdAt
            stripe {
                id
            }
            shops {
                id
                businessId
                name
                createdAt
                status
                profilePhoto
                profileCover
                isDigitalOnly
                info{
                    phone
                    description
                    opening {
                        days
                        hours
                    }
                
                }
                address {
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
    }
    
`

export default GET_BUSINESS;

/* 

*/