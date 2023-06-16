import { gql } from '@apollo/client'

const GET_POLICY = gql`
query allPolicies($title: String!) {
  policy(filter: {title: {eq: $title}}){
      title
      introduction
      paragraphs {
        id
        text(markdown: true)
        title
      }
      id
      startDate
  }
}
`



export default GET_POLICY;


