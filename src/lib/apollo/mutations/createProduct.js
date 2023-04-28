import { gql } from '@apollo/client';

const CREATE_PRODUCT = gql`
    mutation createProduct(
        $shopId: ID!
        $options: ProductInput!
    ) {
        createProduct(
            shopId: $shopId
            options: $options
        ){
            id,
            photos
          }
    }
`

export default CREATE_PRODUCT;





