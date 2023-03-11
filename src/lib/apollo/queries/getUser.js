import { gql } from '@apollo/client'

const GET_USER = gql`
    query user($id: ID!) {
        user(
            id: $id
        ){
            id,
            name,
            surname,
            stripeId,
            firebaseId,
            email,
            phone,
            location{
                type
                coordinates
            },
            gender,
            
            createdAt,
            carts {
                id
                userId
                status
            }
        } 
    }
`

// age,
export default GET_USER;