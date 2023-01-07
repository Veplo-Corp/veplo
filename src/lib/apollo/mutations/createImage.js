import { gql } from '@apollo/client';

const CREATE_IMAGE = gql`
    mutation createImage(
        $files: [Upload!]!
    ) {
        createImage(
            files: $files
        )
    }
`

export default CREATE_IMAGE;

