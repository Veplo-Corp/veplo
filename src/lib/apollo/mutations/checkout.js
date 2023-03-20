import { gql } from '@apollo/client';

const CRATE_CHECKOUT_URL = gql`
    mutation checkout(
        $shopId: ID!
    ) {
        checkout(
            shopId: $shopId
        )
    }
`


export default CRATE_CHECKOUT_URL;