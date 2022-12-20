import Router, { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import Desktop_Layout from '../../../../../components/atoms/Desktop_Layout'
import DintorniLogo_Below_Header from '../../../../../components/molecules/DintorniLogo_Below_Header'
import Box_Dress from '../../../../../components/molecules/Box_Dress'
import { Product } from '../../../../interfaces/product.interface'
import createUrlScheme from '../../../../../components/utils/create_url'


import user from '../../../../store/reducers/user'
import getCityAndPostcodeFromSlug from '../../../../../components/utils/get_City_and_Postcode_from_Slug'
import getGenderandMacrocategory from '../../../../../components/utils/get_Gender_and_Macrocategory'
import GET_PRODUCTS_FROM_SHOP from '../../../../lib/apollo/queries/geetProductsShop'
import GET_PRODUCTS from '../../../../lib/apollo/queries/getProducts'

import { initApollo } from '../../../../lib/apollo'
import { Color, COLORS } from '../../../../../components/mook/colors'
import { toProductPage } from '../../../../../components/utils/toProductPage'
import FIlter_Button from '../../../../../components/molecules/FIlter_Button'
import InfiniteScroll from 'react-infinite-scroll-component';
import Loading from '../../../../../components/molecules/Loading'
import { Center, CircularProgress, Spinner, Text } from '@chakra-ui/react'
import { useQuery } from '@apollo/client'
import { findMacrocategoryName } from '../../../../../components/utils/find_macrocategory_name'
import Error_page from '../../../../../components/organisms/Error_page'


type Router = {
  city: string,
  // genere: 'donna' | 'uomo',
  // categoria: string
}




export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking', // can also be true or false
  }
}

export async function getStaticProps(ctx: any) {

  let { city_cap, slug } = ctx.params;
  const elementCityCap: { city: string, postcode: string | null } = getCityAndPostcodeFromSlug(city_cap);
  const elementGenderMacrocategory: { gender: string | null, macrocategory: string | null } = getGenderandMacrocategory(slug);

  const apolloClient = initApollo()
  // const { data, error } = await apolloClient.query({
  //   query: GET_PRODUCTS_FROM_SHOP,
  //   variables: { id: '63865fa3f99ea8fe07a27a86' },
  // })

  try {
    if (!elementGenderMacrocategory.gender || !elementGenderMacrocategory.macrocategory) {
      throw new Error("categoria o gender non trovato");
    }
    const macrogategoryName = findMacrocategoryName(elementGenderMacrocategory.macrocategory, elementGenderMacrocategory.gender)
    const { data, error } = await apolloClient.query({
      query: GET_PRODUCTS,
      variables: {
        cap: elementCityCap.postcode,
        range: 10000,
        gender: elementGenderMacrocategory.gender === 'uomo' ? "M" : "F",
        macroCategory: macrogategoryName,
      }
    })

    

    return {
      props: {
        city: elementCityCap.city,
        gender: elementGenderMacrocategory.gender,
        category: elementGenderMacrocategory.macrocategory,
        postcode: elementCityCap.postcode,
        products: data?.products,
      },
      revalidate: 60 //seconds
    }
  } catch (e: any) {
    return {
      props: {
        city: elementCityCap.city,
        gender: elementGenderMacrocategory.gender,
        category: elementGenderMacrocategory.macrocategory,
        postcode: elementCityCap.postcode,
        products: [],
        errorMessage: e.message
      },
      revalidate: 60 //seconds
    }
  }


}



const index: React.FC<{ city: any, gender: any, category: any, postcode: any, products: Product[], errorMessage: string, }> = ({ city, gender, category, postcode, products, errorMessage }) => {
  const router = useRouter();
  const colors = useRef<Color[]>(COLORS);
  console.log(products);
  

  const [hasMoreData, setHasMoreData] = useState(true)
  const [productsFounded, setproductsFounded] = useState<Product[]>(products)




  const toProductPageUrl = (product: Product) => {

    const newUrl = toProductPage(product)
    if (newUrl) {
      router.push(`/prodotto/${product.id}/${newUrl}`)
    }
  }


  const toShopPage = (shopId: string) => {
    router.push(`/negozio/${shopId}`)
  }

  const fetchMoreData = () => {
    // if (page === 100) {
    //   setHasMoreData(true)
    // }
    console.log('passa');
    setproductsFounded((prevstate: Product[]) => {

      return [
        ...prevstate,
        ...prevstate.slice(0, 4)
      ]
    })

  }

  if (errorMessage === `cap ${postcode} does not exists`) {
    return (
      <div className='mt-40 text-center'>
        <Error_page errorMessage='cap-does-not-exist' />
      </div>
    )
  }



  return (
    <>
      <Desktop_Layout>
        <DintorniLogo_Below_Header city={city} gender={gender} category={category.replace(/-/g, ' ')}></DintorniLogo_Below_Header>

        <InfiniteScroll
          dataLength={productsFounded.length}
          next={fetchMoreData}
          hasMore={hasMoreData}
          loader={
            <>
              {/* <Center color='white'>
              <Spinner
                size='lg'
                emptyColor='gray.100'
                color='grey.300'
              />
            </Center> */}
              {productsFounded[1] && <Text textAlign={'center'}
                fontWeight={'bold'}
              >
                caricamento
              </Text>}
            </>
          }
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          <div className={` flex items-center justify-center`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full">

              {productsFounded[0] !== null && productsFounded.map((product, key) => {
                return (
                  <Box_Dress eventHandler={toProductPageUrl} key={key} product={product} toShop={toShopPage}></Box_Dress>
                )
              })}
            </div>
          </div>
        </InfiniteScroll>
      </Desktop_Layout>
      <FIlter_Button gender={gender} macrocategory={category} />

    </>

  )
}

export default index