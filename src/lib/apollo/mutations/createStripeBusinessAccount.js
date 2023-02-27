
import { gql } from '@apollo/client';

const CREATE_STRIPE_BUSINESS_ACCOUNT = gql`
    mutation createStripeAccount(
        $businessName: String!
        $vatId: String!
        $phone: String!
    ) {
        createStripeAccount(
            businessName: $businessName
            vatId: $vatId
            phone: $phone
        )
    }
`


export default CREATE_STRIPE_BUSINESS_ACCOUNT;
