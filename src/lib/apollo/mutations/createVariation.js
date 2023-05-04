
import { gql } from '@apollo/client';

const CREATE_VARIATION = gql`
mutation createVariation(
        $productId: ID!, $options: ProductVariationInput!
    ) 
    {
        createVariation(productId: $productId, options: $options)
    }
`

export default CREATE_VARIATION