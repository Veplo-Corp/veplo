import Router, { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import Desktop_Layout from '../../../../../components/atoms/Desktop_Layout'
import Logo_Below_Header from '../../../../../components/molecules/Logo_Below_Header'
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
import { Box, Button, Center, CircularProgress, Spinner, Text } from '@chakra-ui/react'
import { useLazyQuery, useQuery } from '@apollo/client'
import { findMacrocategoryName } from '../../../../../components/utils/find_macrocategory_name'
import Error_page from '../../../../../components/organisms/Error_page'
import createUrlSchema from '../../../../../components/utils/create_url'
import toUpperCaseFirstLetter from '../../../../../components/utils/uppercase_First_Letter'
import createFilterObject from '../../../../../components/utils/create_fiter_products_object'
import PostMeta from '../../../../../components/organisms/PostMeta'
import { Error_log } from '../../../../interfaces/error_log'
import Link from 'next/link'


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

  const { brands, minPrice, maxPrice, colors, sizes } = ctx.params
  if (brands || minPrice || maxPrice || colors || sizes) {
    return {
      props: {
        city: elementCityCap.city,
        gender: elementGenderMacrocategory.gender,
        category: elementGenderMacrocategory.macrocategory,
        postcode: elementCityCap.postcode,
        products: [],
      },
      //revalidate: 60 //seconds
    }
  }

  try {
    if (!elementGenderMacrocategory.gender || !elementGenderMacrocategory.macrocategory) {
      throw new Error("categoria o gender non trovato");
    }
    const macrogategoryName = findMacrocategoryName(elementGenderMacrocategory.macrocategory, elementGenderMacrocategory.gender) || ''
    const { data, errors } = await apolloClient.query({
      query: GET_PRODUCTS,
      variables: {
        range: 10000,
        offset: 0,
        limit: 6,
        filters: {
          cap: elementCityCap.postcode,
          macroCategory: macrogategoryName,
          gender: elementGenderMacrocategory.gender === 'uomo' ? 'M' : 'F'
        }
      }
    })

    return {
      props: {
        city: elementCityCap.city,
        gender: toUpperCaseFirstLetter(elementGenderMacrocategory.gender),
        category: macrogategoryName,
        postcode: elementCityCap.postcode,
        products: data?.products,
      },
      revalidate: 60 //seconds
    }
  } catch (e: any) {
    console.log(e);

    // const errorLog: Error_log = {
    //   message: e.messsage,
    //   extensions: {
    //     code: e.extensions.code,
    //     path: e.extensions.path,
    //     message: e.extensions.message,
    //     id: e.extensions.id
    // }
    // }

    return {
      props: {
        city: elementCityCap.city,
        gender: elementGenderMacrocategory.gender,
        category: elementGenderMacrocategory.macrocategory,
        postcode: elementCityCap.postcode,
        products: [],
        errorLog: e.graphQLErrors[0]?.name || 'errore'
      },
      // notFound: true,
      revalidate: 60 //seconds
    }
  }


}



const index: React.FC<{ city: any, gender: any, category: any, postcode: any, products: Product[], errorLog?: string, }> = ({ city, gender, category, postcode, products, errorLog }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [useFilter, setUseFilter] = useState(false)

  const colors = useRef<Color[]>(COLORS);
  const [hasMoreData, setHasMoreData] = useState(true)
  const [productsFounded, setproductsFounded] = useState<Product[]>(products)
  const [offset, setOffset] = useState<number>(products.length)
  console.log(errorLog);


  const toProductPageUrl = (product: Product) => {

    // const newUrl = toProductPage(product)
    // if (newUrl) {
    //   router.push(`/prodotto/${product.id}/${newUrl}`)
    // }
  }





  const toShopPage = (shopId: string, city: string, name: string) => {
    const slug = createUrlSchema([city, name])
    router.push(`/negozio/${shopId}/${slug}`)
  }

  const resetFilter = () => {
    if (!router.query.filterProducts) return
    console.log(router);

    router.push({
      pathname: `/prodotti/${router.query.city_cap}/${router.query.slug}`,
    },
      undefined, { shallow: true }
    )

  }

  const fetchMoreData = async () => {

    console.log(category);
    // console.log(offset);
    const apolloClient = initApollo()
    const plus_for_limit = 6;
    console.log('RIPASSA');

    if (products.length % plus_for_limit !== 0 || data?.products.length === 0) {

      setHasMoreData(false)

      return console.log('no more data');

    }
    if (useFilter) {
      const { brands, minPrice, maxPrice, colors, sizes } = router.query
      let filters: any = createFilterObject(
        brands,
        minPrice,
        maxPrice,
        colors,
        sizes
      )
      try {
        if (productsFounded.length % plus_for_limit !== 0) {
          return setHasMoreData(false)
        }
        const { data, error } = await apolloClient.query({
          query: GET_PRODUCTS,
          variables: {
            range: 10000,
            offset: productsFounded.length,
            limit: plus_for_limit,
            filters: {
              cap: postcode,
              macroCategory: '',
              gender: gender === 'Uomo' ? 'M' : 'F',
              ...filters
            }
          }
        })

        //console.log(data?.products);

        setproductsFounded((prevstate: Product[]) => {
          return [
            ...prevstate,
            ...data?.products
          ]
        })


        if (data?.products % plus_for_limit !== 0 || data?.products.length === 0) {
          setHasMoreData(false)
        }

        setOffset((prevstate: number) => {
          //console.log(prevstate);
          return prevstate + data.products.length
        })
      } catch (e: any) {
        //console.log(e);

        setHasMoreData(false)
      }
    } else {
      try {
        // if (productsFounded.length % plus_for_limit !== 0) {
        //   return setHasMoreData(false)
        // }
        const { data, error } = await apolloClient.query({
          query: GET_PRODUCTS,
          variables: {
            range: 10000,
            offset: productsFounded.length,
            limit: plus_for_limit,
            filters: {
              //test postcode
              cap: postcode,
              macroCategory: category ? category : '',
              gender: gender === 'Uomo' ? 'M' : 'F'
            }
          }
        })


        //console.log(data?.products);

        setproductsFounded((prevstate: Product[]) => {
          return [
            ...prevstate,
            ...data?.products
          ]
        })


        if (data?.products.length % plus_for_limit !== 0 || data?.products.length === 0) {
          setHasMoreData(false)
        }

        setOffset((prevstate: number) => {
          //console.log(prevstate);

          return prevstate + data.products.length
        })
      } catch (e: any) {
        //console.log(e);
        setHasMoreData(false)
      }
    }
  }

  const [getFilterProduct, { error, data }] = useLazyQuery(GET_PRODUCTS);


  console.log(typeof category);




  useEffect(() => {

    const { brands, minPrice, maxPrice, colors, sizes } = router.query
    console.log('BRAND, ', category);

    console.log(brands, minPrice, maxPrice, colors, sizes);
    if (!brands && !minPrice && !maxPrice && !colors && !sizes) return
    if (brands || minPrice || maxPrice || colors || sizes) {
      let filters: any = createFilterObject(
        brands,
        minPrice,
        maxPrice,
        colors,
        sizes
      )
      setLoading(true)
      console.log('parte la query');
      //TODO: find best way than timeout
      setUseFilter(true)
      getFilterProduct({
        variables: {
          range: 10000,
          offset: 0,
          limit: 8,
          filters: {
            cap: postcode,
            macroCategory: category,
            gender: gender === 'Uomo' ? 'M' : 'F',
            ...filters
          }
        }
      })

    }


  }, [router.query.filterProducts])

  useEffect(() => {

    //if (!errorLog) return

    if (errorLog) {
      console.log(errorLog);

      router.push({
        pathname: '/404',
        query: { error: errorLog },
      })
    }
    if (data) {
      console.log(data?.products.length);

      setproductsFounded(data?.products)
      setLoading(false)
    }
  }, [data, errorLog])

  if (errorLog /* === `cap ${postcode} does not exists` */) {

    return (
      <div className='mt-40 text-center'>
        {/* <Error_page errorLog='cap-does-not-exist' /> */}
      </div>
    )
  }



  return (
    <>
      <Desktop_Layout>
        <PostMeta
          canonicalUrl={'https://www.veplo.it' + router.asPath}
          title={`${category === '' ? 'Abbigliamento' : category} ${gender} a ${city} | Veplo`}
          subtitle={`Tutto l'abbigliamento ${gender} a ${city} - ${category === '' ? 'Vestiti' : category} a ${city}, vicino e te - CAP ${postcode} | Abbigliamento · Scarpe · Vestiti | scopri le offerte | vivi Veplo`}
          image={''}
          description={`Tutto l'abbigliamento ${gender} a ${city} - ${category === '' ? 'Vestiti' : category} a ${city}, vicino e te - CAP ${postcode} | Abbigliamento · Scarpe · Vestiti | scopri le offerte | vivi Veplo`}
        />
        <div className='flex justify-between mb-5 mt-2 md:mt-0'>
          <Logo_Below_Header city={city} gender={gender} category={category.replace(/-/g, ' ') || 'Tutto'}></Logo_Below_Header>
          {router.query?.filterProducts &&
            <Box
              className='underline-offset-2 underline cursor-pointer text-sm text-blue-800'
              _active={{
                transform: 'scale(0.98)',
              }}
              marginY={'auto'}
              onClick={resetFilter}
            >
              Resetta filtri
            </Box>}
        </div>
        {!loading && <InfiniteScroll
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
              {productsFounded[3] && <Text textAlign={'center'}
                fontWeight={'bold'}
              >
                caricamento
              </Text>}
            </>
          }
          endMessage={
            <></>
            // <Text textAlign={'center'}
            //   fontWeight={'bold'}
            // >
            //   Hai visualizzato tutti i prodotti
            // </Text>
          }
        >
          <div className={` flex items-center justify-center`}>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 gap-y-5 w-full">
              {productsFounded.length > 0 ?

                (productsFounded.map((product) => {
                  return (
                    <Link key={product.id} href={`/prodotto/${product.id}/${toProductPage(product)}`}>
                      <Box_Dress eventHandler={toProductPageUrl} product={product} toShop={toShopPage}></Box_Dress>
                    </Link>
                  )
                })) : (
                  <div className='text-center h-screen content-center'>
                    <div className='absolute w-full top-56'>
                      <h1 className='font-extrabold md:8/12 lg:w-6/12 m-auto text-xl lg:text-2xl mb-10 text-[#707070] px-9 line-clamp-2'>
                        Nessun prodotto trovato
                      </h1>
                      <img
                        className='m-auto h-28 w-28 mb-6'
                        src="/error/cryingBoy.svg"
                        alt="non trovata" />
                      <Button
                        colorScheme={'blackAlpha'}
                        mt={'1'}
                        onClick={resetFilter}
                      >Resetta filtri</Button>
                    </div>
                  </div>
                )
              }
            </div>
          </div>
        </InfiniteScroll>}
      </Desktop_Layout>
      <FIlter_Button gender={gender} macrocategory={category ? category : "Tutto l'abbigliamento"} />

    </>

  )
}

export default index