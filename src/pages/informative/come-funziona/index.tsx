import React, { FC } from 'react'
import HomePage, { ListComponents } from '../../../../components/organisms/HomePage'
import GET_COMPONENTS_HOME_LIST from '../../../lib/apollo/dato_CMS/queries/getComponentsHomeList'
import { GetStaticProps } from 'next'
import { initApollo } from '../../../lib/apollo'
import { LazyLoadImage } from 'react-lazy-load-image-component'


export const getStaticProps: GetStaticProps<{}> = async () => {

    const apolloClient = initApollo()

    try {
        const { data } = await apolloClient.query({
            query: GET_COMPONENTS_HOME_LIST,
            context: {
                clientName: 'DATO_CMS_LINK',
            }
        })

        if (data?.allListComponentWithImages) {
            return {
                props: { data },
                revalidate: 10000
            }
        }

        return {
            props: {},
            revalidate: 1
        }
    } catch (e) {

        return {
            props: {},
            revalidate: 1
        }
    }
}


const index: FC<{ data: ListComponents }> = ({ data }) => {
    return (
        <>

            <HomePage data={data} />

        </>
    )
}

export default index