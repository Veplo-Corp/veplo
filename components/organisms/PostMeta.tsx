import Head from 'next/head'
import React, { FC } from 'react'

const PostMeta: FC<{ title: string, subtitle: string, image: string, description: string, url?:string }> = ({ title, subtitle, image, description, url }) => {
  return (
    <Head>
        <title>{title}</title>
        <meta name="description" content={subtitle} />

        {/* open-graph meta */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={subtitle} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={image} />

        {/* twitter card meta */}
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={image} />
        
    </Head>
    
  )
}

export default PostMeta