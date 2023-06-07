import React from 'react'
import GET_TERMS_AND_CONDITIONS from '../../../lib/apollo/dato_CMS/queries/getTermsAndConditions';
import { useQuery } from '@apollo/client';

const index = () => {

    const { loading, error, data, fetchMore } = useQuery(GET_TERMS_AND_CONDITIONS,
        {
            context: {
                clientName: 'DATO_CMS_LINK'
            }
        }
    );

    console.log(data);
    console.log(error);


    return (
        <div>index</div>
    )
}

export default index