
import { gql } from '@apollo/client';

const CREATE_STRIPE_BUSINESS_ACCOUNT = gql`
    mutation createStripeAccount(
        $businessName: String!
        $vatNumber: String!
        $phone: String!
    ) {
        createStripeAccount(
            businessName: $businessName
            vatNumber: $vatNumber
            phone: $phone
        )
    }
`


export default CREATE_STRIPE_BUSINESS_ACCOUNT;
