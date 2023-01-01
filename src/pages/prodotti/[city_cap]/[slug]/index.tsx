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
import { Center, CircularProgress, Spinner, Text } from '@chakra-ui/react'
import { useLazyQuery, useQuery } from '@apollo/client'
import { findMacrocategoryName } from '../../../../../components/utils/find_macrocategory_name'
import Error_page from '../../../../../components/organisms/Error_page'
import createUrlSchema from '../../../../../components/utils/create_url'
import toUpperCaseFirstLetter from '../../../../../components/utils/uppercase_First_Letter'
import createFilterObject from '../../../../../components/utils/create_fiter_products_object'


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
    const { data, error } = await apolloClient.query({
      query: GET_PRODUCTS,
      variables: {
        range: 10000,
        offset: 0,
        limit: 8,
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
  const [loading, setLoading] = useState(false);
  const [useFilter, setUseFilter] = useState(false)

  const colors = useRef<Color[]>(COLORS);
  const [hasMoreData, setHasMoreData] = useState(true)
  const [productsFounded, setproductsFounded] = useState<Product[]>(products)
  const [offset, setOffset] = useState<number>(products.length)
  console.log(offset);


  const toProductPageUrl = (product: Product) => {

    const newUrl = toProductPage(product)
    if (newUrl) {
      router.push(`/prodotto/${product.id}/${newUrl}`)
    }
  }


  const toShopPage = (shopId: string, city: string, name: string) => {
    const slug = createUrlSchema([city, name])
    router.push(`/negozio/${shopId}/${slug}`)
  }

  const fetchMoreData = async () => {
    console.log('moredata');
    console.log(offset);
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
        const plus_for_limit = 8;
        const apolloClient = initApollo()
        if (productsFounded.length % plus_for_limit !== 0) {
          return setHasMoreData(false)
        }
        const { data, error } = await apolloClient.query({
          query: GET_PRODUCTS,
          variables: {
            range: 10000,
            offset: productsFounded.length,
            limit: productsFounded.length + plus_for_limit,
            filters: {
              cap: postcode,
              macroCategory: '',
              gender: gender === 'Uomo' ? 'M' : 'F',
              ...filters
            }
          }
        })

        console.log(data?.products);

        setproductsFounded((prevstate: Product[]) => {
          return [
            ...prevstate,
            ...data?.products
          ]
        })


        if (data?.products % plus_for_limit !== 0) {
          setHasMoreData(false)
        }

        setOffset((prevstate: number) => {
          console.log(prevstate);

          return prevstate + data.products.length
        })
      } catch (e: any) {
        console.log(e.message);

        setHasMoreData(false)
      }
    } else {
      try {
        const plus_for_limit = 8;
        const apolloClient = initApollo()
        if (productsFounded.length % plus_for_limit !== 0) {
          return setHasMoreData(false)
        }
        const { data, error } = await apolloClient.query({
          query: GET_PRODUCTS,
          variables: {
            range: 10000,
            offset: productsFounded.length,
            limit: productsFounded.length + plus_for_limit,
            filters: {
              cap: postcode,
              macroCategory: '',
              gender: gender === 'Uomo' ? 'M' : 'F'
            }
          }
        })

        console.log(data?.products);

        setproductsFounded((prevstate: Product[]) => {
          return [
            ...prevstate,
            ...data?.products
          ]
        })


        if (data?.products % plus_for_limit !== 0) {
          setHasMoreData(false)
        }

        setOffset((prevstate: number) => {
          console.log(prevstate);

          return prevstate + data.products.length
        })
      } catch (e: any) {
        console.log(e.message);

        setHasMoreData(false)
      }
    }
  }

  const [getFilterProduct, { error, data }] = useLazyQuery(GET_PRODUCTS);

  console.log(data);
  console.log(typeof category);




  useEffect(() => {
    console.log('categoria, ', category);

    const { brands, minPrice, maxPrice, colors, sizes } = router.query
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

      console.log(filters);



      setLoading(true)
      console.log('parte la query');
      //TODO: find best way than timeout
      setTimeout(() => {
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
      }, 500);
    }





    // else {
    //   console.log(brands, minPrice, maxPrice, colors, sizes);
    //   const apolloClient = initApollo()
    //   const fetchData = async () => {
    //     return await apolloClient.query({
    //       query: GET_PRODUCTS,
    //       variables: {
    //         range: 10000,
    //         offset: 0,
    //         limit: 8,
    //         filters: {
    //           cap: postcode,
    //           macroCategory: category === 'tutto' ? "" : category,
    //           gender: 'M',
    //           maxPrice: Number(maxPrice)
    //         }
    //       }
    //     })
    //   }

    //   fetchData().then((products) => {
    //     console.log(products.data.products);
    //     console.log('eccolo');
    //     //abortController.signal(),

    //     setproductsFounded(products.data.products)
    //   }).catch(e => {
    //     console.log(e);

    //   })
    // }

  }, [router.query])

  useEffect(() => {
    if (data) {
      setproductsFounded(data?.products)
      setLoading(false)
    }
  }, [data])

  if (errorMessage /* === `cap ${postcode} does not exists` */) {
    console.log(errorMessage);

    return (
      <div className='mt-40 text-center'>
        <Error_page errorMessage='cap-does-not-exist' />
      </div>
    )
  }



  return (
    <>
      <Desktop_Layout>
        <Logo_Below_Header city={city} gender={gender} category={category.replace(/-/g, ' ') || 'Tutto'}></Logo_Below_Header>
        {!loading && <InfiniteScroll
          dataLength={productsFounded.length}
          next={fetchMoreData}
          hasMore={hasMoreData && !useFilter}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full">
              {productsFounded[0] !== null && productsFounded.map((product) => {
                return (
                  <Box_Dress eventHandler={toProductPageUrl} key={product.id} product={product} toShop={toShopPage}></Box_Dress>
                )
              })}
            </div>
          </div>
        </InfiniteScroll>}
      </Desktop_Layout>
      <FIlter_Button gender={gender} macrocategory={category ? category : "Tutto l'abbligliamento"} />

    </>

  )
}

export default index