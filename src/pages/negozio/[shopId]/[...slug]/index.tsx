import React, { useEffect, useRef, useState } from 'react'
import Box_Shop from '../../../../../components/molecules/Box_Shop'
import Desktop_Layout from '../../../../../components/atoms/Desktop_Layout'
import { Box, Button, ButtonGroup, defineStyle, Divider, Flex, Spacer, Text } from '@chakra-ui/react'
import Box_Dress from '../../../../../components/molecules/Box_Dress'
import { useRouter } from 'next/router'
import Horizontal_Line from '../../../../../components/atoms/Horizontal_Line'
import { Product } from '../../../../interfaces/product.interface'
import { Shop, ShopAndProducts } from '../../../../interfaces/shop.interface'
import createUrlSchema from '../../../../../components/utils/create_url'
import { initApollo } from '../../../../lib/apollo'
import GET_PRODUCTS_FROM_SHOP from '../../../../lib/apollo/queries/geetProductsShop'
import { toProductPage } from '../../../../../components/utils/toProductPage'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Link from 'next/link'
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@chakra-ui/icons'
import toUpperCaseFirstLetter from '../../../../../components/utils/uppercase_First_Letter'
import { imageKitUrl } from '../../../../../components/utils/imageKitUrl'
import PostMeta from '../../../../../components/organisms/PostMeta'
import InfiniteScroll from 'react-infinite-scroll-component';
import { useLazyQuery, useQuery } from '@apollo/client'
import Modal_Info_Store from '../../../../../components/organisms/Modal_Info_Store'
import isShopOpen from '../../../../../components/utils/isShopOpen'
import GET_SHOP_AND_PRODUCTS from '../../../../lib/apollo/queries/getSingleShop'
import GET_SINGLE_PRODUCT from '../../../../lib/apollo/queries/getSingleProduct'
import { MoreHoriz, MoreHorizCircle, Phone, PinAlt } from 'iconoir-react'
import PopoverComponent from '../../../../../components/molecules/PopoverComponent'
import { numberOfLineText } from '../../../../../components/utils/numberOfLineText'
import { isMobile } from 'react-device-detect'
import NoIndexSeo from '../../../../../components/organisms/NoIndexSeo'
import { CATEGORIES } from '../../../../../components/mook/categories'
import { GetShopQuery, ProductsQueryResponse } from '../../../../lib/apollo/generated/graphql'

const RANGE = 3

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
    const { data }: { data: GetShopQuery } = await apolloClient.query({
        query: GET_SHOP_AND_PRODUCTS,
        variables: { id: shopId, limit: RANGE, offset: 0 },
    })
    const gender = slug[1];




    return {
        props: {
            shop: data.shop,
            gender: gender ? gender : null
        },
        revalidate: 60, // In seconds
    }
}





const index: React.FC<{ shop: GetShopQuery["shop"], gender: string }> = ({ shop, gender }) => {

    if (!shop) return (
        /* gestire errore in caso shop non viene preso */
        <>
        </>
    )

    console.log(gender);

    //TODO lazyload scroll products
    console.log(shop);
    const router = useRouter();
    const [addressForMaps, setaddressForMaps] = useState('')
    const [productsFounded, setproductsFounded] = useState<ProductsQueryResponse["products"]>([])
    const [hasMoreData, setHasMoreData] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [showAllDescriptionShop, setshowAllDescriptionShop] = useState(false)
    const [descriptionRefTextLength, setDescriptionRefTextLength] = useState(0)
    const descriptionRefText = useRef<any>(null);
    const [genderSelected, setGenderSelected] = useState<string>()

    useEffect(() => {
        if (descriptionRefText.current) {
            const numberOfLine = numberOfLineText(descriptionRefText.current);
            setDescriptionRefTextLength(numberOfLine);
        }
    }, [descriptionRefText]);

    const [getMoreProducts, { loading, error, data, fetchMore }] = useLazyQuery(GET_PRODUCTS_FROM_SHOP);

    console.log(data);


    const createAddressForMAps = () => {
        if (!shop.address?.street || !shop.address.city) return "indirizzo non trovato"
        setaddressForMaps(shop.address.street.replaceAll(' ', '+') + ', ' + shop.address.city.replaceAll(' ', '+'))
    }

    useEffect(() => {
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
        setGenderSelected(gender)
        createAddressForMAps()
    }, [shop])


    const fetchMoreData = async () => {
        const data = await getMoreProducts({
            variables: {
                id: shop.id,
                limit: RANGE,
                offset: productsFounded.length
            }
        })

        const products = data.data.shop.products.products;


        if (shop.products.products.length % RANGE !== 0 || products?.data?.products.length === 0) {
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
                title={`${shop.name ? toUpperCaseFirstLetter(shop.name) : 'Brand'} - Veplo.it`}
                subtitle={`Visita il negozio di abbigliamento ${shop.name} | Abbigliamento · Scarpe · Vestiti | scopri le offerte | vivi Veplo`}
                image={shop?.profileCover ? shop?.profileCover : ''}
                description={`Visita il negozio di abbigliamento ${shop.name} | Abbigliamento · Scarpe · Vestiti | scopri le offerte | vivi Veplo`}
            />

            <Box
                className='lg:w-9/12 m-auto -p-10 mb-6 lg:mb-9'

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
                        left={3}
                        borderRadius={'full'}
                        noOfLines={1}
                        mr={[1, 0]}
                        mt={4}
                        width={'fit-content'}
                        height={'fit-content'}
                    >
                        spedizione gratuita da {shop.minimumAmountForFreeShipping.toLocaleString().replace('.', '.')}€
                    </Text>}
                </Box>

                <Box
                    mt={[4, 6]}
                    className='px-5 lg:p-0'
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
                        <>
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
                        </>
                    }
                    <ButtonGroup
                        gap={0}
                        mt={3}
                    >
                        {Object.keys(CATEGORIES).map(gender => {
                            return (
                                <Button
                                    onClick={() => {
                                        //elimina sessionStorage
                                        sessionStorage.removeItem("keyShopSession")
                                        sessionStorage.removeItem("productsFoundedInShop")
                                        sessionStorage.removeItem('scrollPositionShop');
                                        if (!shop.name) return
                                        if (gender !== genderSelected) {
                                            router.replace(`/negozio/${shop.id}/${createUrlSchema([shop.name])}/${gender}`)
                                        } else {
                                            setGenderSelected('')
                                            router.replace(`/negozio/${shop.id}/${createUrlSchema([shop.name])}`)
                                        }
                                    }}
                                    key={gender}
                                    borderWidth={1}
                                    borderColor={'secondaryBlack.borderColor'}
                                    borderRadius={'10px'}
                                    height={12}
                                    paddingX={8}
                                    bg={genderSelected === gender ? 'black' : 'white'}
                                    color={genderSelected === gender ? 'white' : 'secondaryBlack.text'}
                                    _hover={
                                        {
                                            bg: genderSelected === gender ? 'black' : 'white'
                                        }
                                    }
                                    _focus={{
                                        bg: genderSelected === gender ? 'black' : 'white'
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
                                caricamento
                            </Text>}
                    </Box>
                }
                endMessage={
                    <></>
                }
            >
                {productsFounded &&
                    <div className="grid grid-cols-1 px-3 lg:px-0 md:grid-cols-3 gap-5 w-full lg:w-9/12 mx-auto mb-10">

                        {productsFounded.map((product) => {
                            return (
                                <div
                                    key={product.id}
                                >
                                    <Box_Dress product={product}
                                        showStoreHeader={isMobile}
                                        handleEventSelectedDress={() => {
                                            sessionStorage.setItem("keyShopSession", window.history.state.key)
                                            sessionStorage.setItem("productsFoundedInShop", JSON.stringify(productsFounded))

                                            sessionStorage.setItem('scrollPositionShop', window.pageYOffset.toString());
                                        }}
                                    ></Box_Dress>
                                </div>

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