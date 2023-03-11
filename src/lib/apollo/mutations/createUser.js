
import { gql } from '@apollo/client';

const CREATE_USER = gql`
    mutation createUser(
        $options: UserInput!
    ) {
        createUser(
            options: $options
        )
    }
`


export default CREATE_USER;