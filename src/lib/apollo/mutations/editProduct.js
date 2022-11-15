import { gql } from '@apollo/client';

const EDIT_PRODUCT = gql`
    mutation editProduct(
        $id: ID!
        $options: EditProductInput!
    ) {
        editProduct(
            id: $id
            options: $options
        )
    }
`

export default EDIT_PRODUCT;