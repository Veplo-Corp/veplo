import { gql } from '@apollo/client';

const UPLOAD_PHOTO = gql`
    mutation uploadImages(
        $images: [Upload!]!
        $proportion: String!
    ) {
        uploadImages(
            images: $images
            proportion: $proportion
        )
    }
`

export default UPLOAD_PHOTO;