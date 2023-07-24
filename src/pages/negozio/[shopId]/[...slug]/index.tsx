import React, { useEffect, useRef, useState } from 'react'
import Desktop_Layout from '../../../../../components/atoms/Desktop_Layout'
import { Box, Button, ButtonGroup, defineStyle, Divider, Flex, Spacer, Text } from '@chakra-ui/react'
import Box_Dress from '../../../../../components/molecules/Box_Dress'
import { useRouter } from 'next/router'
import createUrlSchema from '../../../../../components/utils/create_url'
import { initApollo } from '../../../../lib/apollo'
import GET_PRODUCTS_FROM_SHOP from '../../../../lib/apollo/queries/geetProductsShop'
import { LazyLoadImage } from 'react-lazy-load-image-component'

import toUpperCaseFirstLetter from '../../../../../components/utils/uppercase_First_Letter'
import { imageKitUrl } from '../../../../../components/utils/imageKitUrl'
import PostMeta from '../../../../../components/organisms/PostMeta'
import InfiniteScroll from 'react-infinite-scroll-component';
import { useLazyQuery, useQuery } from '@apollo/client'
import GET_SHOP_AND_PRODUCTS from '../../../../lib/apollo/queries/getSingleShop'
import { MoreHoriz, Phone, PinAlt } from 'iconoir-react'
import PopoverComponent from '../../../../../components/molecules/PopoverComponent'
import { numberOfLineText } from '../../../../../components/utils/numberOfLineText'
import { isMobile } from 'react-device-detect'
import NoIndexSeo from '../../../../../components/organisms/NoIndexSeo'
import { CATEGORIES } from '../../../../../components/mook/categories'
import { GetShopQuery, Product, ProductsQueryResponse } from '../../../../lib/apollo/generated/graphql'
import { LIST_ITEM_VARIANT } from '../../../../../components/mook/transition'
import { AnimatePresence, motion } from 'framer-motion';
import PageNotFound from '../../../../../components/molecules/PageNotFound'

const RANGE = typeof process.env.NEXT_PUBLIC_RANGE === 'string' ? Number(process.env.NEXT_PUBLIC_RANGE) : 12


export async function getStaticPaths() {
    return {
        paths: [],
        fallback: 'blocking', // can also be true or false
    }
}

export async function getStaticProps(ctx: any) {
    let { shopId, slug } = ctx.params;
    const apolloClient = initApollo();
    //!creare filtro per gender
    const gender = slug[1];

    try {
        const { data }: { data: GetShopQuery } = await apolloClient.query({
            query: GET_SHOP_AND_PRODUCTS,
            variables: {
                id: shopId,
                limit: RANGE,
                offset: 0,
                filters: {
                    gender: gender ? (gender === 'uomo' ? 'm' : 'f') : null
                }
            },
        })




        return {
            props: {
                shop: data.shop,
                gender: gender ? (gender === 'uomo' ? 'm' : 'f') : null
            },
            revalidate: 60, // In seconds
        }
    } catch (e) {
        console.log(e);

        return {
            props: {

                shop: null,
                gender: gender ? (gender === 'uomo' ? 'm' : 'f') : null
            },
            revalidate: 1, // In seconds
        }
    }


}





const index: React.FC<{ shop: GetShopQuery["shop"], gender: 'f' | 'm' }> = ({ shop, gender }) => {



    if (!shop) return (
        /* gestire errore in caso shop non viene trovato */

        <div className='min-h-[100vh]'>
            <PageNotFound
                title='pagina non trovata'
                description='non siamo riusciti a trovare la pagina che cercavi'
                imageSrc="https://www.datocms-assets.com/102220/1686599080-undraw_cancel_re_pkdm.png"
            />
        </div>
    )



    //TODO lazyload scroll products
    const router = useRouter();
    const [addressForMaps, setaddressForMaps] = useState('')
    const [productsFounded, setproductsFounded] = useState<ProductsQueryResponse["products"]>([])
    const [hasMoreData, setHasMoreData] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [showAllDescriptionShop, setshowAllDescriptionShop] = useState(false)
    const [descriptionRefTextLength, setDescriptionRefTextLength] = useState(0)
    const descriptionRefText = useRef<any>(null);
    const [genderSelected, setGenderSelected] = useState<'f' | 'm'>()

    useEffect(() => {
        if (descriptionRefText.current) {
            const numberOfLine = numberOfLineText(descriptionRefText.current);
            setDescriptionRefTextLength(numberOfLine);
        }
    }, [descriptionRefText]);

    const [getMoreProducts, { loading, error, data, fetchMore }] = useLazyQuery(GET_PRODUCTS_FROM_SHOP);



    const createAddressForMAps = () => {
        if (!shop.address?.street || !shop.address.city) return "indirizzo non trovato"
        setaddressForMaps(shop.address.street.replaceAll(' ', '+') + ', ' + shop.address.city.replaceAll(' ', '+'))
    }

    useEffect(() => {
        setHasMoreData(true)
        if (window.history.state.key === sessionStorage.getItem("keyShopSession")) {
            setproductsFounded([])
            const productsFounded = sessionStorage.getItem("productsFoundedInShop");
            if (!productsFounded || !shop?.products?.products) return setproductsFounded(shop.products.products)
            setproductsFounded(JSON.parse(productsFounded))
            const scrollPosition = sessionStorage.getItem('scrollPositionShop');
            console.log('scrollPosition', scrollPosition);

            if (!scrollPosition) return
            console.log(scrollPosition);
            setTimeout(() => {
                //window.scrollTo(0, parseInt(scrollPosition));
                window.scrollTo({
                    top: parseInt(scrollPosition),
                    behavior: "smooth"
                });
            }, 500);
            setHasMoreData(true)
        }
        else {
            setproductsFounded(shop.products.products)
        }
        if (gender) {
            setGenderSelected(gender)
        }
        createAddressForMAps()
    }, [shop, gender])


    const fetchMoreData = async () => {
        console.log(genderSelected);

        const data = await getMoreProducts({
            variables: {
                id: shop.id,
                limit: RANGE,
                offset: productsFounded.length,
                filters: {
                    gender: genderSelected ? genderSelected : null
                }
            }
        })

        const products = data.data.shop.products.products;


        if (shop.products.products.length % RANGE !== 0 || products.length <= 0) {
            setHasMoreData(false)
            return console.log('no more data');
        }



        setproductsFounded(prevState => {
            return [
                ...prevState,
                ...products
            ]
        })
    }



    return (
        <Desktop_Layout
            noPaddingXMobile={true}
        >
            <NoIndexSeo />

            <PostMeta
                canonicalUrl={'https://www.veplo.it' + router.asPath}
                title={`${shop.name ? toUpperCaseFirstLetter(shop.name) : 'Brand'} | Veplo`}
                subtitle={`${shop.name} è su Veplo | Scopri i migliori brand di abbigliamento e accessori made in Italy. Con Veplo sostieni la moda responsabile.`}
                image={shop?.profilePhoto ? shop?.profilePhoto : ''}
                description={`${shop.name} è su Veplo | Scopri i migliori brand di abbigliamento e accessori made in Italy. Con Veplo sostieni la moda responsabile.`}
            />

            <Box
                className='xl:w-9/12 m-auto -p-10 mb-6 lg:mb-9'

            ><motion.div
                key={shop.id}
                variants={LIST_ITEM_VARIANT}
                initial="hidden"
                animate="visible"
                exit="hidden"
            >
                    <LazyLoadImage src={shop.profileCover ? imageKitUrl(shop.profileCover) : ''}
                        //PlaceholderSrc={PlaceholderImage}
                        alt={shop.name ? shop.name : 'immagine non trovata'}
                        className='w-full object-cover aspect-[2.3/1] lg:aspect-[3/1] lg:rounded-[10px]'
                    />
                    <Box display={'flex'}
                        justifyContent={'space-between'}
                    >
                        <Box
                            marginBottom={1}
                            width={['28', '40']}
                            height={['28', '40']}
                            mt={[-14, -20]}
                            zIndex={10}
                            borderWidth={1}
                            borderColor={'white'}
                            background={'white'}
                            borderRadius={'full'}
                            color={'gray.400'}
                            fontSize={['xs', 'sm']}
                            className='ml-5 md:ml-8'
                            display={'flex'}
                        >
                            <Box
                                borderRadius={'full'}
                                width={'full'}
                                height={'full'}
                                background={'white'}
                                textAlign={'center'}
                                display={'flex'}
                            >

                                <LazyLoadImage src={
                                    shop.profilePhoto ?
                                        imageKitUrl(shop.profilePhoto) :
                                        ''
                                }
                                    //PlaceholderSrc={PlaceholderImage}
                                    alt={shop.name ? shop.name : 'immagine non trovata'}
                                    className='m-auto h-full w-full p-[4px] lg:p-[5px] rounded-full'
                                />
                            </Box>

                        </Box>
                        {shop.minimumAmountForFreeShipping && <Text
                            fontSize={['sm', 'md']}
                            fontWeight={'bold'}
                            py={0}
                            px={2}
                            bgColor={'#D9D9D9'}
                            top={3}
                            borderRadius={'full'}
                            noOfLines={1}
                            mr={[1.5, 0]}
                            mt={4}
                            width={'fit-content'}
                            height={'fit-content'}
                        >
                            spedizione gratuita da {parseInt((shop.minimumAmountForFreeShipping / 100).toString())}€
                        </Text>}
                    </Box>
                </motion.div>



                <Box
                    mt={[4, 6]}
                    className='px-2 lg:p-0'
                >
                    <Box
                        display={'flex'}
                        justifyContent={'space-between'}
                    >
                        <Box>

                            <Text
                                className='font-bold text-2xl lg:text-4xl my-auto'
                            >
                                {shop.name}
                            </Text>

                        </Box>



                        <PopoverComponent
                            actionsPopover={
                                [
                                    {
                                        title: 'Contatta',
                                        icon: <Phone
                                            className='w-4 h-4 my-auto'
                                            strokeWidth={2.5}
                                        />,
                                        handleClick: () => {
                                            console.log('merlo');
                                            if (typeof window !== 'undefined' && shop.info) {
                                                window.location.href = 'tel:+39' + shop.info.phone;

                                            }
                                        }
                                    },
                                    {
                                        title: 'Indicazioni',
                                        icon: <PinAlt
                                            className='w-4 h-4 my-auto'
                                            strokeWidth={2.5}
                                        />,
                                        handleClick: () => {
                                            console.log('merlo');
                                            if (typeof window !== 'undefined' && shop.address) {
                                                window.open(
                                                    'https://www.google.it/maps/search/' + shop.address.city + ' ' + shop.address.postcode + ' ' + shop.address.street,
                                                    '_blank' // <- This is what makes it open in a new window.
                                                );
                                            }

                                        }
                                    },

                                ]
                            }
                            icon={
                                <MoreHoriz
                                    className='m-auto'
                                    height={'full'}
                                    width={'full'}
                                    strokeWidth={2}
                                />
                            } />

                    </Box>

                    {shop.info && shop.info.description &&
                        <Box
                            className='lg:w-10/12'
                        >
                            <Text
                                noOfLines={!showAllDescriptionShop || descriptionRefTextLength <= 3 ? 3 : 100}
                                color={'#909090'}
                                className='font-medium text-sm mt-2 lg:text-md'
                                ref={descriptionRefText}
                            >
                                {shop.info.description}
                            </Text>
                            {descriptionRefTextLength > 3 && <Text
                                onClick={() => setshowAllDescriptionShop(!showAllDescriptionShop)}
                                color={'#909090'}
                                cursor={'pointer'}
                                className='font-semibold underline text-sm lg:text-md'
                            >
                                {!showAllDescriptionShop ? 'mostra altro' : 'mostra meno'}
                            </Text>}
                        </Box>
                    }
                    <ButtonGroup
                        gap={0}
                        mt={3}
                    >
                        {Object.keys(CATEGORIES).map(gender => {
                            const genderInitial = gender === 'uomo' ? 'm' : 'f'
                            return (
                                <Button
                                    onClick={() => {
                                        //elimina sessionStorage
                                        sessionStorage.removeItem("keyShopSession")
                                        sessionStorage.removeItem("productsFoundedInShop")
                                        sessionStorage.removeItem('scrollPositionShop');
                                        if (!shop.name) return
                                        if (genderInitial !== genderSelected) {
                                            router.replace(`/negozio/${shop.id}/${createUrlSchema([shop.name])}/${gender}`)
                                        } else {
                                            setGenderSelected(undefined)
                                            router.replace(`/negozio/${shop.id}/${createUrlSchema([shop.name])}`)
                                        }
                                    }}
                                    key={gender}
                                    borderWidth={1}
                                    borderColor={'secondaryBlack.borderColor'}
                                    borderRadius={'10px'}
                                    height={12}
                                    paddingX={8}
                                    bg={genderSelected === genderInitial ? 'black' : 'white'}
                                    color={genderSelected === genderInitial ? 'white' : 'secondaryBlack.text'}
                                    _hover={
                                        {
                                            bg: genderSelected === genderInitial ? 'black' : 'white'
                                        }
                                    }
                                    _focus={{
                                        bg: genderSelected === genderInitial ? 'black' : 'white'
                                    }}
                                    _active={{
                                        transform: 'scale(0.98)',
                                    }}
                                    fontSize={'16px'}
                                    fontWeight={'bold'}
                                >
                                    {toUpperCaseFirstLetter(gender)}
                                </Button>
                            )
                        })}
                    </ButtonGroup>
                </Box>

            </Box>



            <InfiniteScroll
                dataLength={productsFounded.length}
                next={fetchMoreData}
                hasMore={hasMoreData}
                className='min-h-[130vh]'
                loader={
                    <Box mb={5}>
                        {productsFounded[3] &&
                            <Text textAlign={'center'}
                                fontWeight={'bold'}
                            >
                                {/* caricamento */}
                            </Text>}
                    </Box>
                }
                endMessage={
                    <></>
                }
            >
                {productsFounded &&
                    <div className="grid grid-cols-1 px-2 lg:px-0 md:grid-cols-3 gap-5 w-full xl:w-9/12 mx-auto mb-10">

                        {productsFounded.map((product: Product, index) => {
                            return (
                                <motion.div
                                    variants={LIST_ITEM_VARIANT}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    key={product?.id ? product?.id : Math.random() + index}
                                >
                                    <Box_Dress product={product}
                                        showStoreHeader={true/* isMobile */}
                                        handleEventSelectedDress={() => {
                                            sessionStorage.setItem("keyShopSession", window.history.state.key)
                                            sessionStorage.setItem("productsFoundedInShop", JSON.stringify(productsFounded))

                                            sessionStorage.setItem('scrollPositionShop', window.pageYOffset.toString());
                                        }}
                                        productLink={`/prodotto/${product.id}/${product?.info?.brand}-${product.name}`}

                                    ></Box_Dress>
                                </motion.div>


                            )
                        })}
                    </div>
                }
            </InfiniteScroll>



            {/* {false && <Modal_Info_Store isOpen={isOpen} onClose={() => setIsOpen(false)} shop={shop} />} */}

        </Desktop_Layout>

    )
}

export default index