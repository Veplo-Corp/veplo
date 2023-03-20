import { gql } from '@apollo/client';

const EDIT_VARIATIONS = gql`
    mutation editVariation(
        $id:ID!
        $options: EditVariationInput!
    ) {
        editVariation(
            id:$id
            options:$options
        )
    }
`

export default EDIT_VARIATIONS;