import { graphql } from '../generated/gql'

const EDIT_SIZE_GUIDE_TEMPLATE = graphql(`
mutation editSizeGuideTemplate(
    $shopId:ID!
    $title: String!
    $options: sizeGuideTemplateInput!
){
    editSizeGuideTemplate(
      shopId:$shopId
      title: $title
      options:$options
    ) 
  }
`)


export default EDIT_SIZE_GUIDE_TEMPLATE