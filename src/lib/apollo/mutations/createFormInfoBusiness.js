import { gql } from '@apollo/client';

const CREATE_FORM_INFO_BUSINESS = gql`
    mutation createInformation(
        $options: InformationInput!
    ) {
        createInformation(
            options: $options
        )
    }
`

export default CREATE_FORM_INFO_BUSINESS;