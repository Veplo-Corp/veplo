import { gql } from '@apollo/client';

const EDIT_CART = gql`
    mutation editCart(
        $productVariationId: ID!
        $size: String!
        $quantity: Int!
    ) {
        editCart(
            productVariationId: $productVariationId
            size: $size
            quantity: $quantity
        )
    }
`

export default EDIT_CART;