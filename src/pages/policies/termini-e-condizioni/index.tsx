import React, { FC } from 'react'
import GET_TERMS_AND_CONDITIONS from '../../../lib/apollo/dato_CMS/queries/getTermsAndConditions';
import { useQuery } from '@apollo/client';
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout';
import { Text } from '@chakra-ui/react';
import { Box } from 'iconoir-react';
import { GetStaticProps } from 'next';
import { initApollo } from '../../../lib/apollo';

interface Paragraph {
    id: string,
    text: string,
    title: string
}

interface TerminiECondizioni {
    title: string,
    introduction: string,
    paragraphs: Paragraph[]
}

interface Data {
    terminiECondizioni: TerminiECondizioni
}

interface Standard_paragraph {
    data: Data
}

export const getStaticProps: GetStaticProps<{}> = async () => {

    const apolloClient = initApollo()


    const { data } = await apolloClient.query({
        query: GET_TERMS_AND_CONDITIONS,
        context: {
            clientName: 'DATO_CMS_LINK'
        }
    })

    return {
        props: { data },
        revalidate: 60
    }
}

const index: FC<{ data: Data }> = ({ data }) => {



    return (
        <div
            className='w-full px-4 lg:px-0 lg:w-10/12 m-auto'
        >
            <Text
                as={'h1'}
                fontSize={['3xl', '5xl']}
                fontWeight={'bold'}
                mb={[1, 0]}
            >
                {data?.terminiECondizioni.title}
            </Text>
            {data?.terminiECondizioni.introduction &&
                <Text
                    textAlign={'justify'}
                    as={'h1'}
                    fontSize={['sm', 'lg']}
                    fontWeight={'medium'}
                    mb={5}
                    dangerouslySetInnerHTML={{ __html: data?.terminiECondizioni.introduction }}
                ></Text>}
            {data?.terminiECondizioni.paragraphs.map((paragraph) => {
                return (
                    <div
                        key={paragraph.id}
                    >
                        <Text
                            mb={[1, 0]}
                            as={'h1'}
                            fontSize={['xl', '2xl']}
                            fontWeight={'bold'}
                        >
                            {paragraph.title}
                        </Text>
                        <Text
                            textAlign={'justify'}
                            as={'h1'}
                            fontSize={['sm', 'lg']}
                            fontWeight={'medium'}
                            mb={5}
                            dangerouslySetInnerHTML={{ __html: paragraph.text }}
                        ></Text>

                    </div>

                )
            })}
        </div>
    )
}

export default index