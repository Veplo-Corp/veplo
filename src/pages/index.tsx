import React, { FC, useEffect, useState } from 'react'
import { GetStaticProps } from 'next'
import { initApollo } from '../lib/apollo'
import GET_COMPONENTS_HOME_LIST from '../lib/apollo/dato_CMS/queries/getComponentsHomeList'
import HomePage, { ListComponents } from '../../components/organisms/HomePage'
import { Box } from '@chakra-ui/react'
import { getGender } from '../../components/utils/getGender'
import { useRouter } from 'next/router'



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
  const router = useRouter()
  const [canView, setCanView] = useState(false)
  useEffect(() => {
    if (!router.isReady) return
    const gender = getGender()
    if (gender === 'donna') {
      router.push('/cerca/abbigliamento/donna-abbigliamento/tutto/rilevanza')
    }
    if (gender === 'uomo') {
      router.push('/cerca/abbigliamento/uomo-abbigliamento/tutto/rilevanza')
    }
    if (!gender) {
      return setCanView(true)
    }
  }, [router])
  return (
    <Box minH={'120vh'}>
      {canView && <HomePage data={data} />}
    </Box>
  )
}

export default index