import { gql } from '@apollo/client';

const SET_IS_SHOP = gql`
  mutation setIsShop(
    $isShop: Boolean!
  ){
    setIsShop(isShop: $isShop) 
  }

`;

export default SET_IS_SHOP;