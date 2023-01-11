import Head from 'next/head'
import React, { FC } from 'react'

const PostMeta: FC<{ title: string, subtitle: string, image: string, description: string, canonicalUrl: string, children?:any}> = ({ title, subtitle, image, description, canonicalUrl, children }) => {
  return (
    <Head>
        <title>{title}</title>
        <meta name="description" content={subtitle} />
        <link
          rel="canonical"
          href={canonicalUrl}  /* "https://example.com/blog/original-post" */
          key="canonical"
        />
        {/* open-graph meta */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={subtitle} />
        <meta property="og:url" content={canonicalUrl} />
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