import { graphql } from '../generated/gql'

const ADD_SIZE_GUIDE_TEMPLATE = graphql(`
mutation appendSizeGuideTemplate(
    $shopId:ID!
    $options: sizeGuideTemplateInput!
){
    appendSizeGuideTemplate(
      shopId:$shopId
      options:$options
    ) 
  }
`)


export default ADD_SIZE_GUIDE_TEMPLATE