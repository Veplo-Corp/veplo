import { gql } from '@apollo/client';

const UNFOLLOW = gql`
    mutation unfollow(
        $id: ID!
    ) {
        unfollow(
            id: $id
        )
    }
`

export default UNFOLLOW;