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
            title: "Politica di Reso"
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
                canonicalUrl={'https://www.veplo.it/informative/reso-e-rimborsi'}
                title={'Politica Reso | Veplo'}
                subtitle={"Veplo è lo spazio dove trovare i migliori brand emergenti italiani di abbigliamento. Con Veplo sostieni la vera moda."}
                image={""}
                description={"Veplo è lo spazio dove trovare i migliori brand emergenti italiani di abbigliamento. Con Veplo sostieni la vera moda."}
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