import { gql } from '@apollo/client';

const FOLLOW = gql`
    mutation follow(
        $id: ID!
    ) {
        follow(
            id: $id
        )
    }
`

export default FOLLOW;