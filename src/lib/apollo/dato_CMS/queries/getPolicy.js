import { gql } from '@apollo/client'

const GET_POLICY = gql`
query allPolicies($title: String!) {
  allPolicies(filter: {title: {matches: {pattern: $title}}}) {
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


