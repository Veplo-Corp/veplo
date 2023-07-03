import { gql } from '@apollo/client';

const CREATE_PRODUCT = gql`
    mutation createProduct(
        $shopId: ID!
        $options: ProductInput!
    ) {
        createProduct(
            shopId: $shopId
            options: $options
        )
    }
`

export default CREATE_PRODUCT;





