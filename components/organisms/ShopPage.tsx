import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { GetShopQuery, Product, ProductsQueryResponse } from '../../src/lib/apollo/generated/graphql';
import PageNotFound from '../molecules/PageNotFound';
import { useRouter } from 'next/router';
import { numberOfLineText } from '../utils/numberOfLineText';
import { useLazyQuery, useMutation } from '@apollo/client';
import GET_PRODUCTS_FROM_SHOP from '../../src/lib/apollo/queries/geetProductsShop';
import PopoverComponent, { ActionsPopover } from '../molecules/PopoverComponent';
import { Instagram, MoreHoriz, ShareIos, SmallShopAlt, TikTok } from 'iconoir-react';
import Desktop_Layout from '../atoms/Desktop_Layout';
import NoIndexSeo from './NoIndexSeo';
import PostMeta from './PostMeta';
import { motion } from 'framer-motion';
import toUpperCaseFirstLetter from '../utils/uppercase_First_Letter';
import { LIST_ITEM_VARIANT } from '../mook/transition';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { imageKitUrl } from '../utils/imageKitUrl';
import { Box, Button, ButtonGroup, HStack, Text, useClipboard } from '@chakra-ui/react';
import TagComponent from '../atoms/TagComponent';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CATEGORIES } from '../mook/categories';
import Box_Dress from '../molecules/Box_Dress';
import createUrlSchema from '../utils/create_url';
import { isMobile } from 'react-device-detect';
import { Firebase_User } from '../../src/interfaces/firebase_user.interface';
import { useDispatch, useSelector } from 'react-redux';
import FOLLOW from '../../src/lib/apollo/mutations/follow';
import UNFOLLOW from '../../src/lib/apollo/mutations/unfollow';

import { changeFavouriteShops } from '../../src/store/reducers/user';
import ModalReausable from './ModalReausable';
import LoginAndRegistrationForm from './LoginAndRegistrationForm';
import { ToastOpen } from '../utils/Toast';
import expirationTimeTokenControll from '../utils/expirationTimeTokenControll';
import GET_USER from '../../src/lib/apollo/queries/getUser';

const RANGE = typeof process.env.NEXT_PUBLIC_RANGE === 'string' ? Number(process.env.NEXT_PUBLIC_RANGE) : 12

const ShopPage: React.FC<{ shop: GetShopQuery["shop"], gender: 'f' | 'm' | undefined }> = ({ shop, gender }) => {
    const { onCopy, value, setValue, hasCopied } = useClipboard('https://www.veplo.it/@' + shop?.name?.unique);



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
    const user: Firebase_User = useSelector((state: any) => state.user.user);
    const [followShop] = useMutation(FOLLOW);
    const [unfollowShop] = useMutation(UNFOLLOW);
    const dispatch = useDispatch();
    const [onFollowLoading, setOnFollowLoading] = useState(false)
    const [typeLogin, setTypeLogin] = useState<'login' | 'registration' | 'reset_password'>('login')
    const [isOpenLoginModal, setIsOpenLoginModal] = useState(false)
    const { addToast } = ToastOpen();



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
        if (isMobile) {
            actionsPopoverElements.push({
                title: 'Condividi lo shop',
                icon: <ShareIos
                    className='w-7 h-7 my-auto'
                    strokeWidth={1.5}
                />,
                handleClick: async () => {
                    if (navigator.share) {
                        try {
                            await navigator.share({
                                title: 'Condividi @' + shop.name?.unique,
                                url: 'https://www.veplo.it/@' + shop.name?.unique,
                            });
                        } catch (error) {
                            console.error('Errore durante la condivisione:', error);
                        }
                    }
                }
            })
        } else {
            actionsPopoverElements.push({
                title: 'Copia link profilo',
                icon: <ShareIos
                    className='w-7 h-7 my-auto'
                    strokeWidth={1.5}
                />,
                handleClick: async () => {
                    onCopy();
                    return addToast({
                        position: 'top', title: 'link profilo copiato', status: 'success', duration: 2000, isClosable: true,
                        variant: "customSuccess"
                    })
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
    const isShopFollower = () => {
        const shopId = shop.id
        if (!user?.favouriteShops || !shopId) return false
        const result = user?.favouriteShops?.filter((element: string) => element === shopId)
        if (!result || result.length <= 0) return false
        return true
    }




    const addFollow = async () => {
        const resolve = await expirationTimeTokenControll(user.expirationTime)
        if (!resolve) return
        if (user.statusAuthentication === 'logged_out') {
            return setIsOpenLoginModal(true)
        }
        const isFollowed = isShopFollower();
        let favouriteShops = user.favouriteShops ? [...user.favouriteShops] : [];
        setOnFollowLoading(true)
        if (!shop.id) return
        if (!isFollowed) {
            favouriteShops.push(shop.id);
            dispatch(changeFavouriteShops({
                favouriteShops: favouriteShops
            }))

            try {
                await followShop({
                    variables: {
                        id: shop.id
                    }
                })
                setOnFollowLoading(false)
            }
            catch {
                //TODO handle error follow
                setOnFollowLoading(false)

            }
        } else {

            dispatch(changeFavouriteShops({
                favouriteShops: favouriteShops?.filter((shopId: string) => shopId !== shop.id)
            }))

            try {
                await unfollowShop({
                    variables: {
                        id: shop.id
                    }
                })
                setOnFollowLoading(false)

            }
            catch {
                //TODO handle error follow
                setOnFollowLoading(false)

            }
        }
    }

    const InfoAndFollow = () => {

        return (
            <>
                <PopoverComponent
                    actionsPopover={popoverList()}
                    icon={
                        <MoreHoriz
                            className='m-auto'
                            height={'full'}
                            width={'full'}
                            strokeWidth={2}
                        />
                    }
                />
                <Button
                    onClick={addFollow}
                    variant={isShopFollower() ? 'grayPrimary' : 'primary'}
                    borderRadius={'full'}
                    //paddingInline={isShopFollower() ? [6, 6, 7, 7] : [10, 10, 12, 12]}
                    width={[28, 28, 32, 32]}
                    fontWeight={isShopFollower() ? 'semibold' : 'extrabold'}
                    height={[9, 9, 12, 12]}
                    fontSize={['md', 'md', 'lg', 'lg']}
                    isDisabled={onFollowLoading}
                    _disabled={{
                    }}
                    _hover={{
                    }}
                >
                    {isShopFollower() ? 'segui già' : 'segui'}
                </Button>
            </>


        )
    }

    const TextFollower = () => {
        return (
            <Text
                mr={'5px'}
                fontSize={['13px', '13px', '14px']}
                mt={'2px'}
                fontWeight={'semibold'}
                textAlign={'end'}
                color={'#909090'}
            >{shop.stats?.followers} follower</Text>
        )
    }

    const closeModalHandler = useCallback(
        () => {
            setIsOpenLoginModal(false)
        }, []
    )

    return (
        <>
            <NoIndexSeo />

            <PostMeta
                canonicalUrl={'https://www.veplo.it' + router.asPath}
                title={`${shop.name ? shop.name.visualized + ' (@' + shop.name.unique : 'Brand'}) | Veplo`}
                subtitle={`${shop.name?.visualized} è su Veplo | Scopri i migliori brand di abbigliamento e accessori made in Italy. Con Veplo sostieni la moda responsabile.`}
                image={shop?.profilePhoto ? shop?.profilePhoto : ''}
                description={`${shop.name?.visualized} è su Veplo | Scopri i migliori brand di abbigliamento e accessori made in Italy. Con Veplo sostieni la moda responsabile.`}
            />
            <Box
                className='lg:mx-6 xl:w-10/12 2xl:w-9/12 xl:mx-auto mb-4 lg:mb-9'
            >
                <motion.div
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
                        {((user.statusAuthentication === 'logged_in' && (user.favouriteShops)) || user.statusAuthentication === 'logged_out') && <Box
                            className='lg:hidden mt-1 mr-2'
                        >
                            <Box
                                display={'flex'}
                                gap={[1.5, 1.5, 2.5]}>
                                <InfoAndFollow />
                            </Box>
                            {/* <TextFollower /> */}
                        </Box>}



                    </Box>
                </motion.div>



                <Box
                    mt={[4, 6]}
                    className='mx-2'
                >
                    <Box
                        display={'flex'}
                        justifyContent={'space-between'}
                        mb={[2, 4]}
                    >
                        <Box
                            my={'auto'}
                        >

                            <Text
                                className='font-extrabold text-2xl lg:text-4xl my-auto'
                            >
                                {shop.name?.visualized}
                            </Text>
                            <Text
                                fontSize={['md', 'lg']}
                                fontWeight={'normal'}
                                mt={['-5px', '-5px']}
                                borderRadius={'full'}
                                noOfLines={1}
                                color={'#909090'}
                                zIndex={10}

                            >
                                @{shop.name?.unique}
                            </Text>
                        </Box>

                        {((user.statusAuthentication === 'logged_in' && (user.favouriteShops)) || user.statusAuthentication === 'logged_out') && <Box
                            className='hidden lg:grid'
                        >
                            <Box
                                display={'flex'}
                                gap={2.5}>
                                <InfoAndFollow />
                            </Box>
                            {/* <TextFollower /> */}
                        </Box>}


                    </Box>
                    <Box
                        display={'flex'}
                        justifyContent={'space-between'}
                        width={'full'}
                        mb={[4, 4]}
                    >
                        <HStack spacing={[1, 2, 2.5]}
                            className='mt-0 mb-2 md:my-1'
                        >
                            {/* <img src='https://www.datocms-assets.com/102220/1691334807-articulated-lorry.png'
                                className='w-5 h-5 mr-2'
                            /> */}
                            {shop.categories && shop.categories.map((category) => (
                                <TagComponent
                                    key={category}
                                    text={category}
                                    bg={'primary.opacityBg'}
                                    color={'primary.bg'}
                                />
                            ))}
                        </HStack>
                        <HStack
                            className='mt-0 mb-2 md:my-1'
                        >
                            {shop?.minimumAmountForFreeShipping && <TagComponent
                                text={`spedizione gratis da ${parseInt((shop?.minimumAmountForFreeShipping / 100).toString())}€`}
                                bg={'secondary.opacityBg'}
                                color={'secondary.bg'}
                            />}
                        </HStack>

                    </Box>

                    {shop.info && shop.info.description &&
                        <Box
                            className='lg:w-8/12 mb-3'
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
                                            //setGenderSelected(undefined)
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
                    <div className="grid grid-cols-1 px-2 lg:px-0 md:grid-cols-3 gap-5  md:mx-6 2xl:w-9/12  xl:w-10/12 xl:mx-auto mb-10">

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
            <ModalReausable
                marginTop={0}
                title='' isOpen={isOpenLoginModal}
                closeModal={closeModalHandler}
            >
                <LoginAndRegistrationForm
                    open='modal'
                    type={typeLogin}
                    person='user'
                    handleChangeTypeOrPerson={(type, person) => {
                        if (person === 'business') return
                        setTypeLogin(type)
                    }}
                    closeModal={closeModalHandler}
                />
            </ModalReausable>



            {/* {false && <Modal_Info_Store isOpen={isOpen} onClose={() => setIsOpen(false)} shop={shop} />} */}

        </>

    )
}

export default ShopPage