import { gql } from '@apollo/client';

const RETURN_ORDER = gql`
    mutation returnOrder($returnOrderId: ID!) {
    returnOrder(id: $returnOrderId)
  }

`;

export default RETURN_ORDER;