import { gql } from '@apollo/client';

const ADD_CODE_AND_COURIER_TO_ORDER = gql`
    mutation editOrder(
        $id: ID!
        $options: EditOrderInput!
    ) {
        editOrder(
            id: $id
            options: $options
        )
    }
`


export default ADD_CODE_AND_COURIER_TO_ORDER;