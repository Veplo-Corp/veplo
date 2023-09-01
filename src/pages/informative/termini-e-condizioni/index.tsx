import React, { FC } from 'react'

import { GetStaticProps } from 'next';
import { initApollo } from '../../../lib/apollo';
import GET_POLICY from '../../../lib/apollo/dato_CMS/queries/getPolicy';
import Policy, { Policies } from '../../../../components/organisms/Policy';
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout';
import PostMeta from '../../../../components/organisms/PostMeta';



export const getStaticProps: GetStaticProps<{}> = async () => {

    const apolloClient = initApollo()


    const { data } = await apolloClient.query({
        query: GET_POLICY,
        context: {
            clientName: 'DATO_CMS_LINK',

        },
        variables: {
            title: "Termini e Condizioni"
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


    return (
        <>
            <PostMeta
                canonicalUrl={'https://www.veplo.it/informative/termini-e-condizioni'}
                title={'Termini e Condizioni | Veplo'}
                subtitle={"Veplo è lo spazio dove trovare i migliori brand di abbigliamento e accessori made in Italy. Con Veplo sostieni la moda responsabile."}
                image={""}
                description={"Veplo è lo spazio dove trovare i migliori brand di abbigliamento e accessori made in Italy. Con Veplo sostieni la moda responsabile."}
            />
            <Desktop_Layout>
                {data?.policy ?
                    (
                        <Policy data={data} />
                    ) : (
                        <></>
                    )
                }
            </Desktop_Layout>
        </>

    )


}

export default index