import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Desktop_Layout from '../../../../../../components/atoms/Desktop_Layout';
import { Box, Button, Divider, HStack, Image, Tag, Text, Tooltip, useBreakpointValue } from '@chakra-ui/react';
import GET_PRODUCT_AND_SIMILAR_PRODUCTS_ON_SHOP from '../../../../../lib/apollo/queries/getProductAndSimilarProductsOnShop'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { initApollo } from '../../../../../lib/apollo';
import Size_Box from '../../../../../../components/atoms/Size_Box';
import Horizontal_Line from '../../../../../../components/atoms/Horizontal_Line';
import createUrlSchema from '../../../../../../components/utils/create_url';
import { Color, COLORS } from '../../../../../../components/mook/colors';
import 'react-lazy-load-image-component/src/effects/blur.css';
import GET_SIMILAR_PRODUCT_ON_SHOP from '../../../../../lib/apollo/queries/getProductAndSimilarProductsOnShop';
import Image_Product from '../../../../../../components/organisms/Image_Product';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { imageKitUrl } from '../../../../../../components/utils/imageKitUrl';
import PostMeta from '../../../../../../components/organisms/PostMeta';
import Link from 'next/link';
import CircleColorSelected from '../../../../../../components/atoms/CircleColorSelected';
import ModalReausable from '../../../../../../components/organisms/ModalReausable'
import CartDrawer from '../../../../../../components/organisms/CartDrawer';
import EDIT_CART from '../../../../../lib/apollo/mutations/editCart';
import { useDispatch, useSelector } from 'react-redux';
import { CartDispatch, ProductVariationInCart } from '../../../../../interfaces/carts.interface';
import { editVariationFromCart } from '../../../../../store/reducers/carts';
import { Firebase_User } from '../../../../../interfaces/firebase_user.interface';
import { newTotalHandler } from '../../../../../../components/utils/newTotalHandler';
import { setInLocalStorage } from '../../../../../../components/utils/setInLocalStorage';
import { sortShopsInCart } from '../../../../../../components/utils/sortShopsInCart';
import { handleErrorGraphQL } from '../../../../../../components/utils/handleError_graphQL';
import expirationTimeTokenControll from '../../../../../../components/utils/expirationTimeTokenControll';
import Box_Dress from '../../../../../../components/molecules/Box_Dress';
import { NavArrowDown } from 'iconoir-react';
import { sortAndFilterSizes } from '../../../../../../components/utils/sortAndFilterSizes';
import { Disclosure, Transition } from '@headlessui/react';
import NoIndexSeo from '../../../../../../components/organisms/NoIndexSeo';
import { InView, useInView } from 'react-intersection-observer';
import { AnimatePresence, motion } from 'framer-motion';
import { formatNumberWithTwoDecimalsInString } from '../../../../../../components/utils/formatNumberWithTwoDecimalsInString';
import GuideSize from '../../../../../../components/organisms/GuideSize';
import toUpperCaseFirstLetter from '../../../../../../components/utils/uppercase_First_Letter';

import { findMacrocategorySizeGuideFromMacrocategory } from '../../../../../../components/utils/findMacrocategorySizeGuideFromMacrocategory';
import { formatPercentage } from '../../../../../../components/utils/formatPercentage';
import { numberOfLineText } from '../../../../../../components/utils/numberOfLineText';
import { fbq } from '../../../../../lib/analytics/gtag';
import { PixelEventType } from '../../../../../lib/analytics/eventTypes';
import { openModal } from '../../../../../store/reducers/globalModal';
import PageNotFound from '../../../../../../components/molecules/PageNotFound';
import { Product, ProductVariation } from '../../../../../lib/apollo/generated/graphql';
import ProfilePhoto from '../../../../../../components/molecules/ProfilePhoto';
import ButtonFollow from '../../../../../../components/molecules/ButtonFollow';





// This gets called on every request
export async function getServerSideProps(ctx: any) {

    // const sizes = [
    //     "xxs",
    //     "xs",
    //     "s",
    //     "m",
    //     "l",
    //     "xl",
    //     "xxl",
    //     "3xl",
    //     "4xl",
    //     "5xl",
    // ]
    const { productId } = ctx.params
    // Call an external API endpoint to get posts.
    // You can use any data fetching library

    //! old graphQL schema
    const apolloClient = initApollo()
    try {
        const { data } = await apolloClient.query({
            query: GET_PRODUCT_AND_SIMILAR_PRODUCTS_ON_SHOP,
            variables: {
                id: productId,
                limit: 5,
                offset: 0,
                ofThisShop: true
            },
            //!useless
            // fetchPolicy: 'cache-first',
            // nextFetchPolicy: 'cache-only',
        })

        const colors = data.product?.variations?.map((variation: ProductVariation) => {
            return {
                name: variation?.color,
                cssColor: COLORS.find(color => color.name === variation?.color)?.cssColor
            }
        })

        const totalSizeAvailable = sortAndFilterSizes(data.product.variations)



        return {
            props: {
                productFounded: {
                    ...data.product,
                    colors,
                    totalSizeAvailable
                },
                //?understand cache in GraphQL
                initialApolloState: apolloClient.cache.extract(),
            },
            // revalidate: 60, // In seconds
        }

    } catch (e: any) {
        return {
            props: {
                errorLog: e?.graphQLErrors?.[0]?.message || 'errore',
                //?understand cache in GraphQL
                initialApolloState: apolloClient.cache.extract(),
            },
            // revalidate: 60, // In seconds
        }
    }

}



interface ProductProps extends Product {
    colors: { name: string, cssColor: string }[],
    totalSizeAvailable?: string[]
}




const index: React.FC<{ productFounded: ProductProps, errorLog?: string, initialApolloState: any }> = ({ productFounded, errorLog, initialApolloState }) => {
    const { ref, inView, entry } = useInView({
        /* Optional options */
        threshold: 0,
    });


    const colors = useRef<Color[]>(COLORS)
    const router = useRouter();
    const [sizeSelected, setSizeSelected] = useState<string>('')
    const [openDrawerCart, setOpenDrawerCart] = useState(false)
    const [editCart, elementEditCart] = useMutation(EDIT_CART);
    const cartsDispatchProduct: CartDispatch[] = useSelector((state: any) => state.carts.carts);
    const user: Firebase_User = useSelector((state: any) => state.user.user);
    const [product, setproduct] = useState<ProductProps>(productFounded)
    const [variationSelected, setVariationSelected] = useState<ProductVariation>()
    const [colorSelected, setColorSelected] = useState<string | undefined | null>()
    const [isOpenModalGuideSize, setIsOpenModalGuideSize] = useState(false)
    const [macrocategorySizeGuide, setMacrocategorySizeGuide] = useState(false)
    const isSmallView = useBreakpointValue({ base: true, md: false });
    const [isAddedToCart, setIsAddedToCart] = useState(false)
    const [showAllDescriptionShop, setshowAllDescriptionShop] = useState(false)
    const [viewAllDescription, setViewAllDescription] = useState(false)
    if (errorLog) {
        return (
            <Box className='h-screen'>
                <PageNotFound
                    title='Prodotto non trovato'
                    description='Probabilmente il prodotto è stato appena cancellato dal brand'
                    imageSrc='https://www.datocms-assets.com/102220/1686599080-undraw_cancel_re_pkdm.png'
                />
            </Box>

        )
    }





    const dispatch = useDispatch();


    useEffect(() => {

        const product = { ...productFounded }
        if (!productFounded && !product?.variations?.[0] && product?.variations?.[0]?.color) return
        setproduct(productFounded)

        setVariationSelected(product?.variations?.[0])
        setColorSelected(product?.variations?.[0]?.color)
    }, [productFounded])


    useEffect(() => {

        if (elementEditCart.error?.graphQLErrors?.[0]?.name === "too much quantity for this product's variation") {
            //setOpenDrawerCart(true)
        }
    }, [elementEditCart.error])







    useEffect(() => {

        if (errorLog) {
            router.replace({
                pathname: '/404',
                query: { error: errorLog },
            })
        }
    }, [errorLog])

    useEffect(() => {
        const { colors, sizes } = router.query;
        let variation: ProductVariation | undefined
        const product = { ...productFounded }
        if (!product || !product?.variations) return
        if (typeof colors === 'string') {
            variation = product?.variations.find(variation => variation?.color?.toLowerCase() == colors.toLowerCase())
            if (!variation) { }
            else {
                if (variation.color !== variationSelected?.color) {
                    setVariationSelected(variation)
                }
                setColorSelected(variation?.color)
            }
        }
        if (typeof sizes === 'string') {
            if (variation && variation.lots) {
                const sizeWithQuantity = variation?.lots
                    .filter((lot) => lot.size === sizes)[0]
                if (sizeWithQuantity && sizeWithQuantity?.size && sizeWithQuantity?.quantity && sizeWithQuantity?.quantity > 0) {
                    setSizeSelected(sizeWithQuantity?.size)
                } else {
                    setSizeSelected('')
                }
            } else if (product?.variations?.[0]?.lots) {
                const sizeWithQuantity = product?.variations?.[0]?.lots
                    .filter((lot) => lot.size === sizes)[0]
                if (sizeWithQuantity && sizeWithQuantity?.size && sizeWithQuantity?.quantity && sizeWithQuantity?.quantity > 0) {
                    setSizeSelected(sizeWithQuantity.size)
                } else {
                    setSizeSelected('')
                }
            }
        } else {
            //metti già la taglia se ne ha solo una
            if (variation && variation.lots) {
                const sizeWithQuantity = variation?.lots
                    .filter((lot) => lot.quantity && lot.quantity > 0)
                    .map((lot) => lot.size);
                if (sizeWithQuantity?.[0] && sizeWithQuantity.length === 1) {
                    setSizeSelected(sizeWithQuantity[0])
                } else {
                    setSizeSelected('')
                }
            }
            else if (product?.variations?.[0]?.lots && product?.variations?.[0]?.lots.length === 1) {
                const sizeWithQuantity = product?.variations[0].lots
                    .filter((lot) => lot.quantity && lot.quantity > 0)
                    .map((lot) => lot.size);
                if (sizeWithQuantity?.[0] && sizeWithQuantity.length === 1) {
                    setSizeSelected(sizeWithQuantity[0])
                } else {
                    setSizeSelected('')
                }
            } else {
                setSizeSelected('')
            }
        }

    }, [router.query])




    useEffect(() => {

        if (!product) return




        if (product?.info?.gender === 'f' || product?.info?.gender === 'm') {
            setInLocalStorage('genderSelected', product?.info?.gender)
        }
        const genderSelected = product?.info?.gender === 'm' ? 'uomo' : product?.info?.gender === 'f' ? 'donna' : undefined;
        if (!genderSelected || !product?.info?.macroCategory) return
        //TODO prendere anche parametro "Accessori" o "abbigliamento" da prodotto

        const macrocategorySizeGuideFromMacrocategory = findMacrocategorySizeGuideFromMacrocategory(product?.info?.macroCategory, genderSelected, product?.info?.univers === 'abbigliamento' ? product?.info?.univers : product?.info?.univers === 'accessori' ? 'accessori' : 'abbigliamento')
        if (macrocategorySizeGuideFromMacrocategory) {
            setMacrocategorySizeGuide(macrocategorySizeGuideFromMacrocategory)
        }

        // dispatch(
        //     changeGenderSelected(product?.info?.gender)
        // );

    }, [product])




    const ShopComponent = () => {
        return (
            <Box
                my={'auto'}
            >
                {((user.statusAuthentication === 'logged_in' && (user.favouriteShops)) || user.statusAuthentication === 'logged_out') && <Box
                    className='mt-1 mr-2'
                >
                    <ButtonFollow shopId={product.shopInfo?.id} isSmall={true} />
                </Box>}
            </Box>
        )
    }





    const changeDressColorOrSize = useCallback(
        (color: string | undefined, size: string | undefined) => {
            if (!color && !size) return
            const { colors, sizes } = router.query
            let query: { colors?: any, sizes?: any } = {}
            if (typeof color === 'string' || typeof colors === 'string') {
                query["colors"] = color ? color.toLocaleLowerCase() : colors
            }
            if (typeof size === 'string' || typeof sizes === 'string') {
                query["sizes"] = size ? size.toLocaleLowerCase() : sizes
            }


            if (color) {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }

            return router.replace({
                pathname: router.asPath.split('?')[0],
                query
            },
                undefined, { shallow: true }
            )
        }, [router]
    )

    const addToCartEffect = () => {
        setIsAddedToCart(true);
        setTimeout(() => {
            setIsAddedToCart(false);
        }, 2000); // 2000ms (2 secondi) è il tempo in cui mostri "aggiunto al carrello" prima di tornare a "aggiungi al carrello"
        fbq({
            command: PixelEventType.addToCart
        })
    }

    const addToCart = async (product: Product) => {

        const resolve = await expirationTimeTokenControll(user.expirationTime)
        if (!resolve) return

        if (!sizeSelected || !colorSelected) {

            dispatch(openModal({
                title: 'Taglia mancante',
                description: 'Seleziona la taglia prima di aggiungere il prodotto al carrello.'
                // description: <Box>
                //     test jsx in funzione
                // </Box>
            }))
            return
        }
        if (isAddedToCart) return
        else {

            const Carts: CartDispatch[] = cartsDispatchProduct
            const Cart = Carts.find(cart => cart.shopInfo.id === product?.shopInfo?.id);
            let NewCart: CartDispatch;
            let NewCarts: CartDispatch[] = [];
            let quantityMax;
            let productVariationQuantity = 0;
            const variation = product?.variations?.find(variation => variation?.id === variationSelected?.id)
            const lots = variation?.lots

            if (lots) {
                quantityMax = lots.find(lot => lot.size === sizeSelected)?.quantity
            }
            //CART ESISTENTE
            if (Cart) {
                const quantity = Cart.productVariations.find(variation => variation?.size === sizeSelected && variation?.id === variationSelected?.id)?.quantity

                //caso in cui la Variation è già presente in cart
                if (quantity) {
                    const index = Cart.productVariations.findIndex(variation => variation?.size === sizeSelected)

                    //aggiunge un prodotto dove ha già raggiunto la massima quantità disponibile
                    if (quantityMax && quantity >= quantityMax) {
                        //TODO gestire alert "quantità massima già inserita"
                        dispatch(openModal({
                            title: 'Quantità massima raggiunta',
                            description: 'Hai già aggiunto al carrello il numero massimo di prodotti disponibili per questo colore e taglia.'
                            // description: <Box>
                            //     test jsx in funzione
                            // </Box>
                        }))
                        return
                    }
                    addToCartEffect()
                    productVariationQuantity = quantityMax && quantity >= quantityMax ? quantityMax : quantity + 1

                    const newProductVariation = {
                        ...Cart.productVariations[index],
                        quantity: productVariationQuantity
                    }

                    const productVariations = [
                        newProductVariation,
                        ...Cart.productVariations.filter(variation => variation?.size !== sizeSelected || variation?.id !== variationSelected?.id),
                    ]



                    const newTotal = newTotalHandler(productVariations)

                    const NewCart = {
                        ...Cart,
                        total: newTotal,
                        productVariations: productVariations

                    }

                    NewCarts = sortShopsInCart([
                        ...Carts.filter(cart => cart.shopInfo.id !== product?.shopInfo?.id),
                        NewCart
                    ])
                }
                //caso in cui la Variation non esiste nel cart
                if (!quantity) {
                    addToCartEffect()
                    const newProductVariation: ProductVariationInCart = {
                        id: variationSelected?.id ? variationSelected?.id : '',
                        photo: typeof variationSelected?.photos?.[0] === 'string' ? variationSelected?.photos?.[0] : '',
                        name: product?.name ? product?.name : '',
                        brand: product?.info?.brand ? product?.info?.brand : '',
                        quantity: 1,
                        maxQuantity: quantityMax ? quantityMax : 1,
                        color: variationSelected?.color ? variationSelected?.color : '',
                        size: sizeSelected,
                        productId: product.id ? product.id : '',
                        price: {
                            v1: product?.price?.v1 ? product?.price?.v1 : 0,
                            v2: product?.price?.v2 ? product?.price?.v2 : null,
                            discountPercentage: product?.price?.discountPercentage ? product?.price?.discountPercentage : null,
                        },
                    }

                    const productVariations = [
                        newProductVariation,
                        ...Cart.productVariations
                    ]

                    const newTotal = newTotalHandler(productVariations)


                    const NewCart = {
                        ...Cart,
                        total: newTotal,
                        productVariations
                    }
                    NewCarts = sortShopsInCart([
                        ...Carts.filter(cart => cart.shopInfo.id !== product?.shopInfo?.id),
                        NewCart
                    ])

                }
                //aggiungi al carrello

                dispatch(
                    editVariationFromCart({
                        //add new Carts
                        carts: NewCarts
                    })
                );
            }
            if (!Cart) {
                addToCartEffect()
            }



            //aggiungi al carrello

            dispatch(
                editVariationFromCart({
                    //add new Carts
                    carts: NewCarts
                })
            );
            //setOpenDrawerCart(true)

            try {
                if (user.uid) {

                    const result = await editCart({
                        variables: {
                            productVariationId: variationSelected?.id,
                            size: sizeSelected,
                            quantity: productVariationQuantity > 0 ? productVariationQuantity : 1
                        }
                    })

                    if (typeof result?.data.editCart !== 'string') return
                    //CART INESISTENTE
                    if (!Cart) {


                        const newProductVariation: ProductVariationInCart = {
                            id: variationSelected?.id ? variationSelected?.id : '',
                            photo: variationSelected?.photos?.[0] ? variationSelected?.photos[0] : '',
                            name: product?.name ? product?.name : '',
                            brand: product?.info?.brand ? product?.info?.brand : '',
                            quantity: 1,
                            maxQuantity: quantityMax ? quantityMax : 1,
                            color: variationSelected?.color ? variationSelected?.color : '',
                            size: sizeSelected,
                            productId: product.id ? product.id : '',
                            price: {
                                v1: product?.price?.v1 ? product?.price?.v1 : 0,
                                v2: product?.price?.v2 ? product?.price?.v2 : null,
                                discountPercentage: product?.price?.discountPercentage ? product?.price?.discountPercentage : null,
                            },
                        }

                        NewCart = {
                            id: result?.data.editCart,
                            userId: user.uid,
                            shopInfo: {
                                id: product?.shopInfo?.id ? product?.shopInfo?.id : '',
                                name: {
                                    unique: product?.shopInfo?.name?.unique ? product?.shopInfo?.name?.unique : '',
                                    visualized: product?.shopInfo?.name?.visualized ? product?.shopInfo?.name?.visualized : '',

                                },
                                city: product?.shopInfo?.city ? product?.shopInfo?.city : '',
                                status: product?.shopInfo?.status ? product?.shopInfo?.status : '',
                                minimumAmountForFreeShipping: product?.shopInfo?.minimumAmountForFreeShipping ? product?.shopInfo?.minimumAmountForFreeShipping : 0,
                                profilePhoto: product?.shopInfo?.profilePhoto ? product?.shopInfo?.profilePhoto : '',
                            },
                            total: product?.price?.v2 ? product?.price?.v2 : product?.price?.v1 ? product?.price?.v1 : 0,
                            productVariations: [newProductVariation]
                        }

                        NewCarts = sortShopsInCart(
                            [
                                ...Carts.filter(cart => cart.shopInfo.id !== product?.shopInfo?.id),
                                NewCart
                            ])
                        //aggiungi al carrello

                        dispatch(
                            editVariationFromCart({
                                //add new Carts
                                carts: NewCarts
                            })
                        );
                    }
                } else if (!user.uid) {
                    if (!Cart) {
                        const newProductVariation: ProductVariationInCart = {
                            id: variationSelected?.id ? variationSelected?.id : '',
                            photo: variationSelected?.photos?.[0] ? variationSelected?.photos[0] : '',
                            name: product?.name ? product?.name : '',
                            brand: product?.info?.brand ? product?.info?.brand : '',
                            quantity: 1,
                            maxQuantity: quantityMax ? quantityMax : 1,
                            color: variationSelected?.color ? variationSelected?.color : '',
                            size: sizeSelected,
                            productId: product.id ? product.id : '',
                            price: {
                                v1: product?.price?.v1 ? product?.price?.v1 : 0,
                                v2: product?.price?.v2 ? product?.price?.v2 : null,
                                discountPercentage: product?.price?.discountPercentage ? product?.price?.discountPercentage : null,
                            },
                        }

                        NewCart = {
                            id: product?.shopInfo?.id ? product?.shopInfo?.id : '',
                            userId: user.uid,
                            shopInfo: {
                                id: product?.shopInfo?.id ? product?.shopInfo?.id : '',
                                name: {
                                    unique: product?.shopInfo?.name?.unique ? product?.shopInfo?.name?.unique : '',
                                    visualized: product?.shopInfo?.name?.visualized ? product?.shopInfo?.name?.visualized : '',

                                },
                                city: product?.shopInfo?.city ? product?.shopInfo?.city : '',
                                status: product?.shopInfo?.status ? product?.shopInfo?.status : '',
                                minimumAmountForFreeShipping: product?.shopInfo?.minimumAmountForFreeShipping ? product?.shopInfo?.minimumAmountForFreeShipping : 0,
                                profilePhoto: product?.shopInfo?.profilePhoto ? product?.shopInfo?.profilePhoto : '',
                            },
                            total: product?.price?.v2 ? product?.price?.v2 : product?.price?.v1 ? product?.price?.v1 : 0,
                            productVariations: [newProductVariation]
                        }

                        NewCarts = sortShopsInCart(
                            [
                                ...Carts.filter(cart => cart.shopInfo.id !== product?.shopInfo?.id),
                                NewCart
                            ])
                        //aggiungi al carrello

                        dispatch(
                            editVariationFromCart({
                                //add new Carts
                                carts: NewCarts
                            })
                        );
                    }
                    localStorage.setItem('carts', JSON.stringify(NewCarts))

                }

                // if (!edited.data?.editCart) return //mettere un errore qui

            } catch (e: any) {

            }

        }
    }




    if (!variationSelected) {
        return (
            <Desktop_Layout>

            </Desktop_Layout>
        )
    }




    return (
        <>
            {product &&
                <Box
                    className='lg:mx-6 xl:w-10/12 2xl:w-9/12 md:mx-2 xl:mx-auto'
                >
                    <PostMeta
                        canonicalUrl={'https://www.veplo.it' + router.asPath}
                        //riverdere length description 150 to 160
                        title={`${toUpperCaseFirstLetter(product?.info?.macroCategory)} ${toUpperCaseFirstLetter(product?.info?.brand)} ${product?.name?.toUpperCase()} | Veplo`}
                        subtitle={`${toUpperCaseFirstLetter(product?.info?.macroCategory)} ${toUpperCaseFirstLetter(product?.info?.brand)} ${product?.name?.toUpperCase()} a ${product?.price?.v2 ? product?.price?.v2 : product?.price?.v1}€. Scopri i migliori brand di abbigliamento e accessori made in Italy. Con Veplo sostieni la moda responsabile.`}
                        image={imageKitUrl(variationSelected?.photos?.[0], 237, 247)}
                        description={`${toUpperCaseFirstLetter(product?.info?.macroCategory)} ${toUpperCaseFirstLetter(product?.info?.brand)} ${product?.name?.toUpperCase()} a ${product?.price?.v2 ? product?.price?.v2 : product?.price?.v1}€. Scopri i migliori brand di abbigliamento e accessori made in Italy. Con Veplo sostieni la moda responsabile.`}
                    />
                    {!isSmallView && <Box
                        display={'flex'}
                        mb={4}
                        gap={8}
                    >
                        <Link
                            prefetch={false}
                            href={product?.shopInfo?.name?.unique ? `/@${product.shopInfo.name.unique}` : ''}>
                            <ProfilePhoto
                                imgName={product.name}
                                scr={product.shopInfo?.profilePhoto}
                                primaryText={product.shopInfo?.name?.visualized}
                                secondaryText={'@' + product.shopInfo?.name?.unique}
                            />
                        </Link>
                        <ShopComponent />
                    </Box>}
                    <div className='md:flex justify-between w-full mb-5 lg:mb-0 gap-5'>

                        <Box
                            className='w-full sm:w-9/12 mx-auto md:w-full'
                        >
                            <Image_Product variation={variationSelected} />
                        </Box>
                        <Box className='md:block md:w-[90%] lg:w-[80%]  mx-2'>
                            {isSmallView &&
                                <Box>
                                    <Box
                                        display={'flex'}
                                        mt={2}
                                        justifyContent={'space-between'}
                                    >

                                        <Link
                                            prefetch={false}
                                            href={product?.shopInfo?.name?.unique ? `/@${product.shopInfo.name.unique}` : ''}>
                                            <ProfilePhoto
                                                imgName={product.name}
                                                scr={product.shopInfo?.profilePhoto}
                                                primaryText={product.shopInfo?.name?.visualized}
                                                secondaryText={'@' + product.shopInfo?.name?.unique}
                                                maxWidth={isSmallView ? '160px' : undefined}
                                            />
                                        </Link>

                                        <ShopComponent />
                                    </Box>
                                    <Divider
                                        pt={1}
                                        pb={2}
                                    />
                                </Box>
                            }

                            <Text
                                fontWeight='medium'
                                as='h2'
                                noOfLines={1}
                                mt={[2, 0, 0]}
                                fontSize={'md'}
                                color={'#909090'}
                            >
                                {product?.info?.brand}
                            </Text>

                            <Box
                                fontWeight='bold'
                                as='h1'
                                noOfLines={2}
                                mt='-1'
                                fontSize={['2xl', '3xl']}
                                lineHeight={'33px'}
                                pb='3'
                            >
                                {`${product?.name?.toLocaleUpperCase()}`}
                            </Box>
                            <Box
                                className='lg:flex'
                                justifyContent={'space-between'}
                            >
                                <Box
                                    fontWeight='medium'
                                    as='h1'
                                    noOfLines={2}
                                    fontSize={['lg', 'xl']}
                                    lineHeight={['4']}
                                    my={'auto'}
                                >
                                    {product?.price?.v2 && product?.price?.v1 && product?.price?.v2 < product.price?.v1 && <span className=' text-red-700 font-bold'>{formatNumberWithTwoDecimalsInString(product.price?.v2)}€<br /> </span>}

                                    {<span
                                        className={`${product?.price?.v2 && product?.price?.v1 && product.price?.v2 < product?.price?.v1 ? 'text-slate-500 font-normal text-sm ' : ''} mr-2`}
                                    >
                                        {product?.price?.v2 && product?.price?.v1 && product?.price?.v2 < product?.price?.v1 && <span>prima era: </span>}<span className={product?.price?.v2 && product?.price?.v1 && product?.price?.v2 < product?.price?.v1 ? 'line-through' : ''}>{formatNumberWithTwoDecimalsInString(product.price?.v1)}€</span>
                                        {typeof product?.price?.discountPercentage === 'number' && product?.price?.discountPercentage > 0 &&
                                            <span className='ml-2 text-red-500'>
                                                -{formatPercentage(product?.price?.discountPercentage)}%
                                            </span>
                                        }
                                    </span>}

                                </Box>
                                <Box
                                    fontWeight='normal'
                                    as='h2'
                                    lineHeight='tall'
                                    noOfLines={1}
                                    fontSize='sm'

                                    className={`${product?.price?.v2 ? 'mt-2' : 'mt-4'} lg:my-auto`}
                                >

                                    {/* {product?.info?.traits && <HStack spacing={2} justifyContent={'start'}>
                                    {product?.info?.traits.map(value => {

                                        return (
                                            <Tag
                                                key={value}
                                                size={'md'}
                                                px={6}
                                                py={2}
                                                variant='solid'
                                                borderRadius={'full'}
                                                color={(value === 'eco-friendly' || value === 'vegan') ? '#207441' : '#552D09'}
                                                backgroundColor={(value === 'eco-friendly' || value === 'vegan') ? '#B2FDCF' : '#FDD6B2'}
                                            >
                                                {value}
                                            </Tag>
                                        )
                                    })

                                    }
                                </HStack>} */}
                                </Box>

                            </Box>


                            {product?.colors && <Box
                                fontWeight='light'
                                as='h1'
                                noOfLines={1}
                                mt={['4', '6']}
                                fontSize='md'
                            >
                                {product.colors.length || 0}
                                {product.colors.length === 1 && <span className='ml-1'>colorazione disponibile</span>}
                                {product.colors.length > 1 && <span className='ml-1'>colorazioni disponibili</span>}
                            </Box>}

                            {product.colors && <div className='mt-2'>
                                <CircleColorSelected
                                    colorSelected={colorSelected ? colorSelected : ''}
                                    colors={
                                        product?.colors
                                    }
                                    handleSelectColor={changeDressColorOrSize}
                                    dimension={'1.5rem'} space={5} showTooltip={true}
                                />
                            </div>}

                            <Box
                                fontWeight='light'
                                as='h1'
                                mt={5}
                                mb={0}
                                fontSize='md'
                                display={'flex'}
                                gap={1}
                                width={'full'}
                            >
                                pubblicato da:
                                <Link
                                    className='font-semibold'
                                    href={'/@' + product?.shopInfo?.name?.unique}
                                >
                                    @{product?.shopInfo?.name?.unique}
                                </Link>
                            </Box>
                            <Box
                                fontWeight='light'
                                as='h1'
                                noOfLines={1}
                                mt='6'
                                mb={3}
                                fontSize='md'
                                display={'flex'}
                                justifyContent={'space-between'}
                                width={'full'}
                            >
                                <Text>
                                    Taglie disponibili
                                </Text>
                                {macrocategorySizeGuide && <Box
                                    cursor={'pointer'}
                                    onClick={() => setIsOpenModalGuideSize(true)}
                                    display={'flex'}
                                    gap={2}
                                >
                                    <img
                                        className='h-[18px] my-auto'
                                        loading='lazy'
                                        src='https://em-content.zobj.net/thumbs/240/apple/354/straight-ruler_1f4cf.png'
                                    >
                                    </img>
                                    Guida alle taglie
                                </Box>}
                            </Box>
                            {product?.totalSizeAvailable && <Size_Box
                                borderWidth='1px'
                                py={2}
                                totalLotsProduct={product.totalSizeAvailable}
                                borderRadius={'lg'}
                                fontSize={'2xl'}
                                fontWeight={'medium'}
                                lots={variationSelected?.lots ? variationSelected?.lots : undefined}
                                handleLot={(size: string) => {
                                    changeDressColorOrSize(undefined, size)
                                    //setSizeSelected(size)
                                }}
                                sizeSelected={sizeSelected}
                            />}


                            {!isSmallView ? (<Button
                                mt={5}
                                onClick={() => addToCart(product)}
                                type={'button'}
                                borderRadius={'10px'}
                                size={'xl'}
                                padding={5}
                                fontSize={['xl', 'lg']}
                                paddingInline={10}
                                width={'full'}
                                height={'fit-content'}
                                cursor={isAddedToCart ? 'default' : 'pointer'}
                                variant={!isAddedToCart ? 'primary' : 'primary'}
                            >
                                {isAddedToCart ? (
                                    <motion.span
                                        key="addedToCart"
                                        initial={{ opacity: 0, x: '-100%' }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: '100%' }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        Aggiunto al carrello {String.fromCodePoint(0x1F680)}
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="addToCart"
                                        initial={{ opacity: 0, x: '-100%' }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: '100%' }}
                                    >

                                        {sizeSelected ?
                                            <span >Aggiungi al carrello - {sizeSelected.toLocaleUpperCase()}</span>
                                            : <span >Seleziona la taglia</span>
                                        }
                                    </motion.span>
                                )}
                            </Button>)
                                : (
                                    <Box
                                        position="fixed"
                                        bottom="0"
                                        left="0"
                                        right="0"
                                        zIndex={1}
                                    >
                                        <Box
                                            bg={'#FFFFFF'}
                                            width={'full'}
                                            height={'fit-content'}
                                            paddingX={3}
                                            paddingY={3}
                                        >

                                            <Button
                                                onClick={() => addToCart(product)}
                                                type={'button'}
                                                borderRadius={'10px'}
                                                size={'xl'}
                                                fontWeight={'bold'}
                                                padding={5}
                                                fontSize={['xl', 'lg']}
                                                paddingInline={10}
                                                width={'full'}
                                                height={'fit-content'}
                                                cursor={isAddedToCart ? 'default' : 'pointer'}
                                                variant={!isAddedToCart ? 'primary' : 'primary'}
                                            >
                                                {isAddedToCart ? (
                                                    <motion.span
                                                        key="addedToCart"
                                                        initial={{ opacity: 0, x: '-100%' }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: '100%' }}
                                                        transition={{ duration: 0.4 }}
                                                    >
                                                        Aggiunto al carrello {String.fromCodePoint(0x1F680)}
                                                    </motion.span>
                                                ) : (
                                                    <motion.span
                                                        key="addToCart"
                                                        initial={{ opacity: 0, x: '-100%' }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: '100%' }}
                                                    >
                                                        {sizeSelected ?
                                                            <span >Aggiungi al carrello - {sizeSelected.toLocaleUpperCase()}</span>
                                                            : <span >Seleziona la taglia</span>
                                                        }
                                                    </motion.span>
                                                )}
                                            </Button>
                                        </Box>
                                    </Box>

                                )
                            }

                            <Box
                                className='grid grid-cols-3 lg:grid-cols-4 w-fit gap-x-1 gap-y-4 lg:gap-4 mt-6'
                            >

                                {product?.info?.modelDescription && product?.info?.modelDescription?.length > 0 &&
                                    <>
                                        <Text
                                            fontSize={'md'}
                                            fontWeight={'semibold'}
                                            color={'black'}
                                        >
                                            Aiuto alla taglia
                                        </Text>
                                        <Text
                                            fontSize={'md'}
                                            fontWeight={'normal'}
                                            color={'#909090'}
                                            className='col-span-2 lg:col-span-3'
                                        >   {
                                                product?.info?.modelDescription
                                            }
                                        </Text>
                                    </>
                                }
                                {product?.info?.materials &&
                                    <>
                                        <Text
                                            fontSize={'md'}
                                            fontWeight={'semibold'}
                                            color={'black'}
                                        >
                                            Materiale
                                        </Text>
                                        <Text
                                            fontSize={'md'}
                                            fontWeight={'normal'}
                                            color={'#909090'}
                                            className='col-span-2 lg:col-span-3'
                                        >
                                            {product?.info?.materials?.length && product?.info?.materials?.length > 0 ? product?.info?.materials.join(', ') : 'non disponibile'}
                                        </Text>
                                    </>
                                }
                                {
                                    product?.info?.fit &&
                                    <>
                                        <Text
                                            fontSize={'md'}
                                            fontWeight={'semibold'}
                                            color={'black'}
                                        >
                                            Fit
                                        </Text>
                                        <Text
                                            fontSize={'md'}
                                            fontWeight={'normal'}
                                            color={'#909090'}
                                            className='col-span-2 lg:col-span-3'
                                        >
                                            {product?.info?.fit ? product?.info?.fit : 'non disponibile'}
                                        </Text>
                                    </>
                                }
                                {
                                    product?.info?.length && <>
                                        <Text
                                            fontSize={'md'}
                                            fontWeight={'semibold'}
                                            color={'black'}
                                        >
                                            Lunghezza
                                        </Text>
                                        <Text
                                            fontSize={'md'}
                                            fontWeight={'normal'}
                                            color={'#909090'}
                                            className='col-span-2 lg:col-span-3'
                                        >
                                            {product?.info?.length ? product?.info?.length : 'non disponibile'}
                                        </Text>
                                    </>
                                }
                                {product?.info?.description && product?.info?.description?.length > 0 &&
                                    <>
                                        <Text
                                            fontSize={'md'}
                                            fontWeight={'semibold'}
                                            color={'black'}
                                        >
                                            Descrizione
                                        </Text>
                                        <Box
                                            className='col-span-2 lg:col-span-3'
                                        >
                                            <Text
                                                fontSize={'md'}
                                                fontWeight={'normal'}
                                                color={'#909090'}
                                                className='col-span-2 lg:col-span-3'
                                            >
                                                {`${product?.info?.description?.length > 150 &&
                                                    !viewAllDescription
                                                    ? product?.info?.description.slice(0, 120) + '...' : product?.info?.description}`}

                                            </Text>
                                            {product?.info?.description?.length > 150 && <Text
                                                onClick={() => setViewAllDescription(!viewAllDescription)}
                                                color={'#909090'}
                                                cursor={'pointer'}
                                                className='font-semibold underline text-sm lg:text-md'
                                            >
                                                {!viewAllDescription ? 'mostra altro' : 'mostra meno'}
                                            </Text>}
                                        </Box>

                                    </>
                                }
                            </Box>




                        </Box>
                    </div >
                    <Horizontal_Line />
                    <Box

                        fontWeight='bold'
                        as='h1'
                        noOfLines={1}
                        className='text-2xl md:text-5xl mt-5 lg:mt-0 ml-2'
                        lineHeight={'normal'}
                    >
                        {product?.shopInfo?.name?.visualized}
                    </Box>
                    <Link
                        prefetch={false}
                        href={`/@${product.shopInfo?.name?.unique}`}>
                        <Box
                            fontWeight='normal'
                            as='h1'
                            noOfLines={1}
                            mb={5}
                            className='text-xl md:text-2xl w-fit ml-2'
                            lineHeight={'normal'}
                        >
                            Altri prodotti di <span className='underline '>{product?.shopInfo?.name?.visualized}</span>
                        </Box>
                    </Link>
                    <div
                        className="overflow-x-scroll flex gap-4 pb-4 min-h-[320px] ml-2 pr-10"
                    >
                        <AnimatePresence>
                            {product.productsLikeThis && product.productsLikeThis.map((product: Product, index: number) => {
                                //motion
                                const listItemVariants = {
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            delay: index * 0.1,
                                            duration: 0.5,
                                            ease: "easeOut",
                                        },
                                    },
                                    hidden: {
                                        opacity: 0,
                                        y: 0,
                                        transition: {
                                            duration: 0.5,
                                            ease: "easeOut",
                                        },
                                    },
                                };
                                return (
                                    <div
                                        key={product.id}
                                        className={'flex gap-4 w-fit'} >
                                        <Box
                                            overflow='hidden'
                                            mb={2}
                                            className={`w-72 lg:w-[350px]`}/*  aspect-[8.5/12] */
                                        >
                                            <motion.div
                                                key={product.id}
                                                variants={listItemVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="hidden"
                                            >

                                                <Box_Dress
                                                    doubleGridDevice={false}
                                                    overflowCards={true}
                                                    productLink={`/@${product?.shopInfo?.name?.unique}/prodotto/${product.id}/${createUrlSchema([product?.info?.brand, product?.name])}`}
                                                    showStoreHeader={false} product={product} color={typeof colors === 'string' ? colors : undefined} />
                                            </motion.div>

                                        </Box>
                                    </div>
                                )

                            })

                            }
                        </AnimatePresence>


                    </div>

                </Box >

            }

            <ModalReausable
                marginTop={10}
                positionTopModal={true}
                title={`${toUpperCaseFirstLetter(product?.info?.macroCategory)} da ${product?.info?.gender === 'm' ? 'uomo' : 'donna'}`} isOpen={isOpenModalGuideSize}
                closeModal={() => setIsOpenModalGuideSize(false)}
            >
                <GuideSize
                    macrocategorySizeGuide={macrocategorySizeGuide}
                />

            </ModalReausable>
            <CartDrawer isOpen={openDrawerCart} closeDrawer={() => setOpenDrawerCart(false)} />
        </>

    )
}

export default index