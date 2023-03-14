import { gql } from '@apollo/client'

const GET_USER = gql`
    query user{
        user{
            id,
            name,
            surname,
            stripeId,
            firebaseId,
            email,
            phone,
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

export default GET_USER;