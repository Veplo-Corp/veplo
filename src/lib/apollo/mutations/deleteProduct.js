import { gql } from '@apollo/client';

const DELETE_PRODUCT = gql`
  mutation deleteProduct(
    $id: ID!
  ){
    deleteProduct(id: $id) 
  }

`;

export default DELETE_PRODUCT;