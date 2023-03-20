import { gql } from '@apollo/client';

const EDIT_USER_INFO = gql`
    mutation editUser(
        $options: EditUserInput!
    ) {
        editUser(
            options:$options
        )
    }
`

export default EDIT_USER_INFO;