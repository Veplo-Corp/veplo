import { gql } from '@apollo/client';

const CRATE_CHECKOUT_URL = gql`
    mutation checkout(
        $cartId: ID!
    ) {
        checkout(
            cartId: $cartId
        )
    }
`


export default CRATE_CHECKOUT_URL;