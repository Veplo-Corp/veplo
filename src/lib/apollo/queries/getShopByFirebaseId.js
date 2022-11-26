import { gql } from '@apollo/client'

const GET_SHOP_BY_FIREBASE_ID = gql`
    query shopByFirebaseId($firebaseId: String!) {
        shopByFirebaseId(
            firebaseId: $firebaseId
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

export default GET_SHOP_BY_FIREBASE_ID;