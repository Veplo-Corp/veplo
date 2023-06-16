import React, { FC } from 'react'

import { GetStaticProps } from 'next';
import { initApollo } from '../../../lib/apollo';
import GET_POLICY from '../../../lib/apollo/dato_CMS/queries/getPolicy';
import Policy, { Policies } from '../../../../components/organisms/Policy';
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout';



export const getStaticProps: GetStaticProps<{}> = async () => {

    const apolloClient = initApollo()


    const { data } = await apolloClient.query({
        query: GET_POLICY,
        context: {
            clientName: 'DATO_CMS_LINK',

        },
        variables: {
            title: "Termini e Condizioni di Vendita"
        },
    })

    if (data?.policy) {
        return {
            props: { data },
            revalidate: 60
        }
    }

    return {
        props: {},
        revalidate: 1
    }


}

const index: FC<{ data: Policies }> = ({ data }) => {

    console.log(data);

    return (
        <Desktop_Layout>
            {data?.policy ?
                (
                    <Policy data={data} />
                ) : (
                    <></>
                )
            }
        </Desktop_Layout>
    )


}

export default index