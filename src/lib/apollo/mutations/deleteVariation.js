import { gql } from '@apollo/client';

const DELETE_VARIATION = gql`
  mutation deleteVariation(
    $id: ID!
  ){
    deleteVariation(id: $id) 
  }

`;

export default DELETE_VARIATION;