import { gql } from '@apollo/client';

const RETURNED_ORDER_HAS_ARRIVED = gql`
    mutation returnedOrderHasArrived($id: ID!) {
        returnedOrderHasArrived(id: $id)
    }
`;

export default RETURNED_ORDER_HAS_ARRIVED;