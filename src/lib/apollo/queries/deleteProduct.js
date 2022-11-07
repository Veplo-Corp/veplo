import { gql, useMutation } from '@apollo/client';

const DELETE_PRODUCT = gql`
  mutation deleteProduct{
    deleteProduct(id: "63693552a3aab0f65e18b1c0") 
  }
`;

/* Bearer */
export default DELETE_PRODUCT;