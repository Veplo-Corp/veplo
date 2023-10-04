import { graphql } from '../generated/gql'

const CLICK_PRODUCT = graphql(`
mutation click(
    $productId:ID!
){
    click(
        productId:$productId
    ) 
  }
`)


export default CLICK_PRODUCT