import { gql } from '@apollo/client';

const ORDER_DELETED_BY_SHOP = gql`
    mutation cancelOrder(
        $orderId: ID!
    ) {
        cancelOrder(
            orderId: $orderId
        )
    }
`


export default ORDER_DELETED_BY_SHOP;