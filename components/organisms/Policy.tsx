import React, { FC } from 'react'
import { useQuery } from '@apollo/client';
import { Text } from '@chakra-ui/react';
import { Box } from 'iconoir-react';

export interface Paragraph {
    id: string,
    text: string,
    title: string
}

export interface Policy {
    title: string,
    introduction: string,
    startDate: string,
    paragraphs: Paragraph[]
}

export interface Policies {
    allPolicies: Policy[]
}

const Policy: FC<{ data: Policies }> = ({ data }) => {
    return (
        <div
            className='w-full px-4 lg:px-0 lg:w-10/12 m-auto'
        >
            <Text
                as={'h1'}
                fontSize={['3xl', '5xl']}
                fontWeight={'bold'}
                mb={[1, 2]}
            >
                {data?.allPolicies[0].title}
            </Text>
            {data?.allPolicies[0].startDate &&
                <Text
                    textAlign={'justify'}
                    as={'h1'}
                    fontSize={['sm', 'lg']}
                    fontWeight={'bold'}
                    mb={5}

                >
                    {data?.allPolicies[0].startDate}
                </Text>}
            {data?.allPolicies[0].introduction &&
                <Text
                    textAlign={'justify'}
                    as={'h1'}
                    fontSize={['sm', 'lg']}
                    fontWeight={'medium'}
                    mb={5}
                    dangerouslySetInnerHTML={{ __html: data?.allPolicies[0].introduction }}
                ></Text>}
            {data?.allPolicies[0].paragraphs.map((paragraph) => {
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

export default Policy