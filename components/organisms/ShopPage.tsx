import React, { useEffect, useRef, useState } from 'react'
import { GetShopQuery, Product, ProductsQueryResponse } from '../../src/lib/apollo/generated/graphql';
import PageNotFound from '../molecules/PageNotFound';
import { useRouter } from 'next/router';
import { numberOfLineText } from '../utils/numberOfLineText';
import { useLazyQuery } from '@apollo/client';
import GET_PRODUCTS_FROM_SHOP from '../../src/lib/apollo/queries/geetProductsShop';
import PopoverComponent, { ActionsPopover } from '../molecules/PopoverComponent';
import { Instagram, MoreHoriz, SmallShopAlt, TikTok } from 'iconoir-react';
import Desktop_Layout from '../atoms/Desktop_Layout';
import NoIndexSeo from './NoIndexSeo';
import PostMeta from './PostMeta';
import { motion } from 'framer-motion';
import toUpperCaseFirstLetter from '../utils/uppercase_First_Letter';
import { LIST_ITEM_VARIANT } from '../mook/transition';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { imageKitUrl } from '../utils/imageKitUrl';
import { Box, Button, ButtonGroup, HStack, Text } from '@chakra-ui/react';
import TagComponent from '../atoms/TagComponent';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CATEGORIES } from '../mook/categories';
import Box_Dress from '../molecules/Box_Dress';
import createUrlSchema from '../utils/create_url';

const RANGE = typeof process.env.NEXT_PUBLIC_RANGE === 'string' ? Number(process.env.NEXT_PUBLIC_RANGE) : 12

const ShopPage: React.FC<{ shop: GetShopQuery["shop"], gender: 'f' | 'm' }> = ({ shop, gender }) => {



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

    const [getMoreProducts] = useLazyQuery(GET_PRODUCTS_FROM_SHOP);



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

            if (!scrollPosition) return
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
            return
        }



        setproductsFounded(prevState => {
            return [
                ...prevState,
                ...products
            ]
        })
    }

    const popoverList = (): ActionsPopover[] => {
        const actionsPopoverElements: ActionsPopover[] = [];
        if (shop.links?.instagram) {
            actionsPopoverElements.push({
                title: 'Instagram',
                icon: <Instagram
                    className='w-7 h-7 my-auto'
                    strokeWidth={1.5}
                />,
                handleClick: () => {
                    if (typeof window !== 'undefined' && shop.links?.instagram) {
                        window.open(
                            //TODO inserire link Instagram
                            shop.links?.instagram,
                            '_blank' // <- This is what makes it open in a new window.
                        );
                    }

                }
            })
        }

        if (shop.links?.tiktok) {
            actionsPopoverElements.push({
                title: 'TikTok',
                icon: <TikTok
                    className='w-7 h-7 my-auto'
                    strokeWidth={1.5}
                />,
                handleClick: () => {
                    if (typeof window !== 'undefined' && shop.links?.tiktok) {
                        window.open(
                            //TODO inserire link Instagram
                            shop.links?.tiktok,
                            '_blank' // <- This is what makes it open in a new window.
                        );
                    }

                }
            })
        }




        if (shop.info?.phone) {
            actionsPopoverElements.push({
                title: 'Indicazioni',
                icon: <SmallShopAlt
                    className='w-7 h-7 my-auto'
                    strokeWidth={1.5}
                />,
                handleClick: () => {
                    if (typeof window !== 'undefined' && shop.address) {
                        window.open(
                            'https://www.google.it/maps/search/' + shop.address.city + ' ' + shop.address.postcode + ' ' + shop.address.street,
                            '_blank' // <- This is what makes it open in a new window.
                        );
                    }

                }
            })
        }
        return actionsPopoverElements;

    }



    return (
        <Desktop_Layout
            noPaddingXMobile={true}
        >
            <NoIndexSeo />

            <PostMeta
                canonicalUrl={'https://www.veplo.it' + router.asPath}
                title={`${shop.name ? toUpperCaseFirstLetter(shop.name.visualized) : 'Brand'} | Veplo`}
                subtitle={`${shop.name?.visualized} è su Veplo | Scopri i migliori brand di abbigliamento e accessori made in Italy. Con Veplo sostieni la moda responsabile.`}
                image={shop?.profilePhoto ? shop?.profilePhoto : ''}
                description={`${shop.name?.visualized} è su Veplo | Scopri i migliori brand di abbigliamento e accessori made in Italy. Con Veplo sostieni la moda responsabile.`}
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
                        effect='blur'
                        alt={shop.name?.visualized ? shop.name.visualized : ''}
                        className='w-full object-cover aspect-[2.3/1] lg:aspect-[3/1] min-h-[120px] lg:min-h-[300px] lg:rounded-[10px]'
                    />
                    <Box display={'flex'}
                        justifyContent={'space-between'}
                    >
                        <Box
                            marginBottom={1}
                            width={[28, '40']}
                            height={[28, '40']}
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
                                    effect='blur'
                                    //PlaceholderSrc={PlaceholderImage}
                                    alt={shop.name?.visualized ? shop.name.visualized : 'immagine non trovata'}
                                    className='m-auto h-full w-full p-[4px] lg:p-[5px] rounded-full'
                                />
                            </Box>

                        </Box>

                        {shop.minimumAmountForFreeShipping && <Box
                            fontSize={['sm', 'md']}
                            fontWeight={'bold'}
                            color={'primaryBlack.text'}
                            top={3}
                            noOfLines={1}
                            mr={[1.5, 0]}
                            mt={4}
                            display={'flex'}


                        >
                            <img src='https://www.datocms-assets.com/102220/1691334807-articulated-lorry.png'
                                className='w-5 h-5 mr-2'
                            />
                            Spedizione gratuita da {parseInt((shop.minimumAmountForFreeShipping / 100).toString())}€
                        </Box>}
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
                        <Box
                            my={'auto'}
                        >

                            <Text
                                className='font-extrabold text-2xl lg:text-4xl my-auto'
                            >
                                {shop.name?.visualized}
                            </Text>
                            <HStack spacing={2.5}
                                className='my-1 md:my-2'
                            >
                                {shop.categories && shop.categories.map((category) => (
                                    <TagComponent
                                        key={category}
                                        text={category}
                                        bg={'primary.opacityBg'}
                                        color={'primary.bg'}
                                    />
                                ))}
                            </HStack>

                        </Box>



                        <PopoverComponent
                            actionsPopover={popoverList()}
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
                                className='font-medium md:font-normal text-sm lg:text-md'
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
                                        if (!shop.name?.visualized) return
                                        if (genderInitial !== genderSelected) {
                                            router.replace(`/@${shop.name.unique}/${gender}`)
                                        } else {
                                            setGenderSelected(undefined)
                                            router.replace(`/@${shop.name.unique}`)
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
                                        doubleGridDevice={false}
                                        showStoreHeader={true/* isMobile */}
                                        handleEventSelectedDress={() => {
                                            sessionStorage.setItem("keyShopSession", window.history.state.key)
                                            sessionStorage.setItem("productsFoundedInShop", JSON.stringify(productsFounded))

                                            sessionStorage.setItem('scrollPositionShop', window.pageYOffset.toString());
                                        }}
                                        productLink={`/@${shop.name?.unique}/prodotto/${product.id}/${createUrlSchema([product?.info?.brand, product.name])}`}

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

export default ShopPage