import { graphql } from '../generated/gql'

const DELETE_SIZE_GUIDE_TEMPLATE = graphql(`
mutation removeSizeGuideTemplate(
    $shopId:ID!
    $title: String!
){
    removeSizeGuideTemplate(
      shopId:$shopId
      title:$title
    ) 
  }
`)


export default DELETE_SIZE_GUIDE_TEMPLATE