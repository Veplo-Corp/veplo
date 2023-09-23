import { graphql } from '../generated/gql'

const GET_SIZEGUIDE_TEMPLATES = graphql(`
query shopGuideTemplates(
    $id:ID!
){
    shop(id:$id) {
        id
      sizeGuideTemplates{
        title
        photo
      }
    }
  }
`)


export default GET_SIZEGUIDE_TEMPLATES