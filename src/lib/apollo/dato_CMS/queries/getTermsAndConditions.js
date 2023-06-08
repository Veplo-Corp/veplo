import { gql } from '@apollo/client'

const GET_TERMS_AND_CONDITIONS = gql`
query MyQuery {
    terminiECondizioni {
      title
      introduction
      paragraphs {
        id
        text(markdown: true)
        title
      }
      id
    }
  }
`

export default GET_TERMS_AND_CONDITIONS;


