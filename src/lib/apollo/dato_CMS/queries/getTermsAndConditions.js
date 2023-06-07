import { gql } from '@apollo/client'

const GET_TERMS_AND_CONDITIONS = gql`
    query getTermsAndConditions {
        terminiECondizioni {
        paragraphs {
            id
            text(markdown: true)
        }
        id
        }
    }
`

export default GET_TERMS_AND_CONDITIONS;


