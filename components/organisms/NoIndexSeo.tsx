import Head from 'next/head'
import React, { FC } from 'react'


const NoIndexSeo: FC<{ title?: string }> = ({ title }) => {
    return (
        <Head>
            <title>{title}</title>
            <meta name="robots" content="noindex,nofollow" />
            <meta name="googlebot" content="noindex,nofollow" />
        </Head>
    )
}

export default NoIndexSeo



