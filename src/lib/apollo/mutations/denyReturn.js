


import { gql } from '@apollo/client';

const DENY_RETURN = gql`
    mutation Mutation($orderId: ID!) {
        denyReturn(orderId: $orderId)
    }
`;

export default DENY_RETURN;