import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="it">
      <Head>
        <link rel="icon" type="image/x-icon" href="/favicon-16x16.png" sizes="16x16" />
        <link rel="icon" type="image/x-icon" href="/favicon-32x32.png" sizes="32x32" />
        <link rel="icon" type="image/x-icon" href="/android-chrome-192x192.png" sizes="192x192" />
        <link rel="icon" type="image/x-icon" href="/android-chrome-512x512.png" sizes="512x512" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}