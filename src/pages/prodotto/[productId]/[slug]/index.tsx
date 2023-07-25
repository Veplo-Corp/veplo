import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import Desktop_Layout from '../../../../../components/atoms/Desktop_Layout';
import { Box, Button, HStack, Image, Tag, Text, Tooltip, useBreakpointValue } from '@chakra-ui/react';
import GET_SINGLE_PRODUCT from '../../../../lib/apollo/queries/getSingleProduct'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Product, Variation } from '../../../../interfaces/product.interface';
import { initApollo } from '../../../../lib/apollo';
import Size_Box from '../../../../../components/atoms/Size_Box';
import Horizontal_Line from '../../../../../components/atoms/Horizontal_Line';
import createUrlSchema from '../../../../../components/utils/create_url';
import { Color, COLORS } from '../../../../../components/mook/colors';
import 'react-lazy-load-image-component/src/effects/blur.css';
import GET_SIMILAR_PRODUCT_ON_SHOP from '../../../../lib/apollo/queries/getSimilarProductOnShop';
import Image_Product from '../../../../../components/organisms/Image_Product';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { imageKitUrl } from '../../../../../components/utils/imageKitUrl';
import PostMeta from '../../../../../components/organisms/PostMeta';
import Link from 'next/link';
import CircleColorSelected from '../../../../../components/atoms/CircleColorSelected';
import ModalReausable from '../../../../../components/organisms/ModalReausable'
import CartDrawer from '../../../../../components/organisms/CartDrawer';
import EDIT_CART from '../../../../lib/apollo/mutations/editCart';
import { useDispatch, useSelector } from 'react-redux';
import { Cart, ProductVariation } from '../../../../interfaces/carts.interface';
import { editVariationFromCart } from '../../../../store/reducers/carts';
import { Firebase_User } from '../../../../interfaces/firebase_user.interface';
import { newTotalHandler } from '../../../../../components/utils/newTotalHandler';
import { setInLocalStorage } from '../../../../../components/utils/setInLocalStorage';
import { sortShopsInCart } from '../../../../../components/utils/sortShopsInCart';
import { handleErrorGraphQL } from '../../../../../components/utils/handleError_graphQL';
import expirationTimeTokenControll from '../../../../../components/utils/expirationTimeTokenControll';
import Box_Dress from '../../../../../components/molecules/Box_Dress';
import { NavArrowDown } from 'iconoir-react';
import { sortAndFilterSizes } from '../../../../../components/utils/sortAndFilterSizes';
import { Disclosure, Transition } from '@headlessui/react';
import NoIndexSeo from '../../../../../components/organisms/NoIndexSeo';
import { InView, useInView } from 'react-intersection-observer';
import { AnimatePresence, motion } from 'framer-motion';
import { formatNumberWithTwoDecimalsInString } from '../../../../../components/utils/formatNumberWithTwoDecimalsInString';
import GuideSize from '../../../../../components/organisms/GuideSize';
import toUpperCaseFirstLetter from '../../../../../components/utils/uppercase_First_Letter';

import { findMacrocategorySizeGuideFromMacrocategory } from '../../../../../components/utils/findMacrocategorySizeGuideFromMacrocategory';
import { formatPercentage } from '../../../../../components/utils/formatPercentage';
import { numberOfLineText } from '../../../../../components/utils/numberOfLineText';
import { fbq } from '../../../../lib/analytics/gtag';
import { PixelEventType } from '../../../../lib/analytics/eventTypes';
import { openModal } from '../../../../store/reducers/globalModal';
import PageNotFound from '../../../../../components/molecules/PageNotFound';





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
    //console.log(productId);
    try {
        const { data } = await apolloClient.query({
            query: GET_SINGLE_PRODUCT,
            variables: { id: productId },
            //!useless
            // fetchPolicy: 'cache-first',
            // nextFetchPolicy: 'cache-only',
        })

        const colors = data.product.variations.map((variation: Variation) => {
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
        console.log(e);
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






const index: React.FC<{ productFounded: Product, errorLog?: string, initialApolloState: any }> = ({ productFounded, errorLog, initialApolloState }) => {
    const { ref, inView, entry } = useInView({
        /* Optional options */
        threshold: 0,
    });

    const colors = useRef<Color[]>(COLORS)
    const router = useRouter();
    const { slug } = router.query;
    const [sizeSelected, setSizeSelected] = useState<string>('')
    const [getSimilarProductOnShop, shopProductsData] = useLazyQuery(GET_SIMILAR_PRODUCT_ON_SHOP);
    const [openDrawerCart, setOpenDrawerCart] = useState(false)
    const [editCart, elementEditCart] = useMutation(EDIT_CART);
    const cartsDispatchProduct: Cart[] = useSelector((state: any) => state.carts.carts);
    const user: Firebase_User = useSelector((state: any) => state.user.user);
    const [product, setproduct] = useState<Product>(productFounded)
    const [variationSelected, setVariationSelected] = useState<Variation>(productFounded?.variations?.[0])
    const [colorSelected, setColorSelected] = useState<string>()
    const [productsLikeThis, setproductsLikeThis] = useState<Product[]>()
    const [isOpenModalGuideSize, setIsOpenModalGuideSize] = useState(false)
    const [macrocategorySizeGuide, setMacrocategorySizeGuide] = useState(false)
    const isSmallView = useBreakpointValue({ base: true, md: false });
    console.log(errorLog);
    const [isAddedToCart, setIsAddedToCart] = useState(false)
    const [showAllDescriptionShop, setshowAllDescriptionShop] = useState(false)
    const [descriptionRefTextLength, setDescriptionRefTextLength] = useState(0)
    const descriptionRefText = useRef<any>(null);

    if (errorLog) {
        return (
            <PageNotFound
                title='Prodotto non trovato'
                description='Probabilmente il prodotto è stato appena cancellato dal brand'
                imageSrc='https://www.datocms-assets.com/102220/1686599080-undraw_cancel_re_pkdm.png'
            />
        )
    }

    if (!variationSelected) {
        return (
            <Desktop_Layout>

            </Desktop_Layout>
        )
    }



    const dispatch = useDispatch();


    useEffect(() => {
        if (!productFounded) return
        setproduct(productFounded)
        setVariationSelected(productFounded?.variations?.[0])
        setColorSelected(productFounded?.variations?.[0]?.color)
    }, [productFounded])


    useEffect(() => {
        console.log(elementEditCart.error);

        if (elementEditCart.error?.graphQLErrors?.[0]?.name === "too much quantity for this product's variation") {
            //setOpenDrawerCart(true)
        }
    }, [elementEditCart.error])







    useEffect(() => {

        if (errorLog) {
            console.log(errorLog);
            router.replace({
                pathname: '/404',
                query: { error: errorLog },
            })
        }
    }, [errorLog])

    useEffect(() => {
        const { colors, sizes } = router.query;
        let variation: Variation | undefined


        if (typeof colors === 'string' && product) {
            variation = product.variations.find(variation => variation?.color.toLowerCase() == colors.toLowerCase())
            if (!variation) { }
            else {
                setVariationSelected(variation)
                setColorSelected(variation?.color)
            }
        }
        if (typeof sizes === 'string') {

            console.log(sizes);
            if (variation) {
                const sizeWithQuantity = variation.lots
                    .filter((lot) => lot.size === sizes)[0]
                if (sizeWithQuantity && sizeWithQuantity?.quantity > 0) {
                    setSizeSelected(sizeWithQuantity.size)
                }
            } else {
                const sizeWithQuantity = product.variations[0].lots
                    .filter((lot) => lot.size === sizes)[0]
                if (sizeWithQuantity && sizeWithQuantity?.quantity > 0) {
                    setSizeSelected(sizeWithQuantity.size)
                }
            }
        } else {
            //metti già la taglia se ne ha solo una
            if (variation) {
                const sizeWithQuantity = variation.lots
                    .filter((lot) => lot.quantity > 0)
                    .map((lot) => lot.size);
                if (sizeWithQuantity.length === 1) {
                    setSizeSelected(sizeWithQuantity[0])
                }
            }
            else if (product.variations[0].lots.length === 1) {
                const sizeWithQuantity = product.variations[0].lots
                    .filter((lot) => lot.quantity > 0)
                    .map((lot) => lot.size);
                if (sizeWithQuantity.length === 1) {
                    setSizeSelected(sizeWithQuantity[0])
                }

            }
        }

    }, [router.query])



    useEffect(() => {
        if (!product) return
        if (descriptionRefText.current) {
            const numberOfLine = numberOfLineText(descriptionRefText.current);
            setDescriptionRefTextLength(numberOfLine);
        }


        setproductsLikeThis(undefined)

        setInLocalStorage('genderSelected', product.info.gender)
        const genderSelected = product.info.gender === 'm' ? 'uomo' : product.info.gender === 'f' ? 'donna' : undefined;
        if (!genderSelected) return
        //TODO prendere anche parametro "Accessori" o "abbigliamento" da prodotto

        console.log(product.info.macroCategory);
        const macrocategorySizeGuideFromMacrocategory = findMacrocategorySizeGuideFromMacrocategory(product.info.macroCategory, genderSelected)
        console.log(macrocategorySizeGuideFromMacrocategory);
        if (macrocategorySizeGuideFromMacrocategory) {
            setMacrocategorySizeGuide(macrocategorySizeGuideFromMacrocategory)
        }

        // dispatch(
        //     changeGenderSelected(product.info.gender)
        // );

    }, [product])





    //!handle error case

    //const router = useRouter();
    //const query = router.query;
    //decodeURI
    //console.log(decodeURIComponent(query.nome));


    const chatWithStore = async () => {
        const apolloClient = initApollo()
        //! get Shop phone number
        // try {
        //     const { data, error } = await apolloClient.query({
        //         query: GET_SINGLE_SHOP,
        //         variables: { id: product.shopId },
        //     })
        //     if (error) return
        //     window.open(
        //         `https://wa.me/+39${data.shop.phone}?text=ciao, ero su Veplo.it e stavo visitando il tuo negozio ${product.shopOptions.name}. Avrei bisogno di una informazione sul prodotto *${product.name} - ${product.info.brand}*`
        //         , '_blank')
        // } catch (e) {
        //     console.log(e);
        // }
    }


    //console.log(imageKitUrl(product.photos[0], 237, 247));




    const changeDressColor = (color: string) => {
        const variation = product.variations.find(variation => variation?.color.toLowerCase() == color.toLowerCase())
        if (!variation) return
        setVariationSelected(variation)
        setColorSelected(variation?.color)
        setSizeSelected('')

        //metti già la taglia se ne ha solo una
        const sizeWithQuantity = variation.lots
            .filter((lot) => lot.quantity > 0)
            .map((lot) => lot.size);
        if (sizeWithQuantity.length === 1) {
            setSizeSelected(sizeWithQuantity[0])
        }


        router.replace({
            pathname: router.asPath.split('?')[0],
            query: { colors: color.toLocaleLowerCase() }
        },
            undefined, { shallow: true }
        )
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

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
                description: 'Inserisci la taglia prima di aggiungere il prodotto al carrello.'
                // description: <Box>
                //     test jsx in funzione
                // </Box>
            }))
            return
        }
        if (isAddedToCart) return
        else {

            console.log(cartsDispatchProduct);
            const Carts: Cart[] = cartsDispatchProduct
            const Cart = Carts.find(cart => cart.shopInfo.id === product.shopInfo.id);
            let NewCart: Cart;
            let NewCarts: Cart[] = [];
            let quantityMax;
            let productVariationQuantity = 0;
            const variation = product.variations.find(variation => variation?.id === variationSelected.id)
            const lots = variation?.lots

            if (lots) {
                quantityMax = lots.find(lot => lot.size === sizeSelected)?.quantity
            }
            //CART ESISTENTE
            if (Cart) {
                console.log(Cart.productVariations);
                const quantity = Cart.productVariations.find(variation => variation?.size === sizeSelected && variation?.id === variationSelected.id)?.quantity

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
                        ...Cart.productVariations.filter(variation => variation?.size !== sizeSelected || variation?.id !== variationSelected.id),
                    ]


                    console.log(productVariations);

                    const newTotal = newTotalHandler(productVariations)

                    const NewCart = {
                        ...Cart,
                        total: newTotal,
                        productVariations: productVariations

                    }

                    NewCarts = sortShopsInCart([
                        ...Carts.filter(cart => cart.shopInfo.id !== product.shopInfo.id),
                        NewCart
                    ])
                }
                //caso in cui la Variation non esiste nel cart
                if (!quantity) {
                    addToCartEffect()

                    const newProductVariation: ProductVariation = {
                        id: variationSelected.id,
                        photo: variationSelected.photos[0],
                        name: product.name,
                        brand: product.info.brand,
                        quantity: 1,
                        maxQuantity: quantityMax ? quantityMax : 1,
                        color: variationSelected.color,
                        size: sizeSelected,
                        productId: product.id,
                        price: {
                            v1: product.price.v1,
                            v2: product.price.v2 ? product.price.v2 : null,
                            discountPercentage: product.price.discountPercentage ? product.price.discountPercentage : null,
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
                        ...Carts.filter(cart => cart.shopInfo.id !== product.shopInfo.id),
                        NewCart
                    ])

                }
            }

            //CART INESISTENTE
            if (!Cart) {
                addToCartEffect()

                const newProductVariation: ProductVariation = {
                    id: variationSelected.id,
                    photo: variationSelected.photos[0],
                    name: product.name,
                    brand: product.info.brand,
                    quantity: 1,
                    maxQuantity: quantityMax ? quantityMax : 1,
                    color: variationSelected.color,
                    size: sizeSelected,
                    productId: product.id,
                    price: {
                        v1: product.price.v1,
                        v2: product.price.v2 ? product.price.v2 : null,
                        discountPercentage: product.price.discountPercentage ? product.price.discountPercentage : null,
                    },
                }

                NewCart = {
                    id: 'cartId',
                    userId: user.uid,
                    shopInfo: {
                        id: product.shopInfo.id,
                        name: product.shopInfo.name,
                        city: product.shopInfo.city,
                        status: product.shopInfo.status,
                        minimumAmountForFreeShipping: product.shopInfo.minimumAmountForFreeShipping,
                        profilePhoto: product.shopInfo.profilePhoto,
                    },
                    total: product?.price.v2 ? product?.price.v2 : product?.price.v1,
                    productVariations: [newProductVariation]
                }

                NewCarts = sortShopsInCart(
                    [
                        ...Carts.filter(cart => cart.shopInfo.id !== product.shopInfo.id),
                        NewCart
                    ])
            }

            console.log(NewCarts);

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

                    await editCart({
                        variables: {
                            productVariationId: variationSelected.id,
                            size: sizeSelected,
                            quantity: productVariationQuantity > 0 ? productVariationQuantity : 1
                        }
                    })
                } else if (!user.uid) {
                    localStorage.setItem('carts', JSON.stringify(NewCarts))
                }

                // if (!edited.data?.editCart) return //mettere un errore qui

            } catch (e: any) {
                console.log(e.message);

            }

        }
    }

    const handleVisibilityChange = async (inView: boolean) => {

        if (inView) {
            // Funzione da eseguire quando il componente diventa visibile
            //! lista di prodotti del negozio
            console.log('AOOOOO passa qui');
            setTimeout(async () => {
                const element = await getSimilarProductOnShop({
                    variables: {
                        productId: product.id,
                        limit: 6,
                        offset: 0,
                        shopId: product.shopInfo.id
                    },
                    fetchPolicy: 'cache-first',
                })

                if (element) {
                    setproductsLikeThis(element?.data?.product.productsLikeThis)
                }
            }, 200);

        }
    };



    return (
        <>
            {product &&
                <Box
                    className='lg:mx-6 xl:w-10/12 2xl:w-9/12 md:mx-2 xl:mx-auto'
                >


                    <NoIndexSeo />

                    <PostMeta
                        canonicalUrl={'https://www.veplo.it' + router.asPath}
                        //riverdere length description 150 to 160
                        title={`${toUpperCaseFirstLetter(product.info.macroCategory)} ${toUpperCaseFirstLetter(product.info.brand)} ${product.name.toUpperCase()} | Veplo`}
                        subtitle={`${toUpperCaseFirstLetter(product.info.macroCategory)} ${toUpperCaseFirstLetter(product.info.brand)} ${product.name.toUpperCase()} a ${product.price.v2 ? product.price.v2 : product.price.v1}€. Scopri i migliori brand di abbigliamento e accessori made in Italy. Con Veplo sostieni la moda responsabile.`}
                        image={imageKitUrl(variationSelected.photos[0], 237, 247)}
                        description={`${toUpperCaseFirstLetter(product.info.macroCategory)} ${toUpperCaseFirstLetter(product.info.brand)} ${product.name.toUpperCase()} a ${product.price.v2 ? product.price.v2 : product.price.v1}€. Scopri i migliori brand di abbigliamento e accessori made in Italy. Con Veplo sostieni la moda responsabile.`}
                    />
                    <div className='md:flex justify-between w-full mb-5 lg:mb-0 gap-5'>
                        <Box
                            className='w-full sm:w-9/12 mx-auto md:w-full'
                        >
                            <Image_Product variation={variationSelected} />

                        </Box>
                        <Box className='md:block md:w-[90%] lg:w-[80%]  mx-2'>
                            <Text
                                fontWeight='medium'
                                as='h2'
                                noOfLines={1}
                                mt={[2, 0, 0]}
                                fontSize={'md'}
                                color={'#909090'}
                            >
                                {product.info.brand}
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
                                {`${product.name.toLocaleUpperCase()}`}

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
                                    {product?.price?.v2 < product.price?.v1 && <span className=' text-red-700 font-bold'>{formatNumberWithTwoDecimalsInString(product.price?.v2)}€<br /> </span>}

                                    <span
                                        className={`${product.price?.v2 < product.price.v1 ? 'text-slate-500 font-normal text-sm ' : ''} mr-2`}
                                    >
                                        {product.price.v2 < product.price.v1 && <span>prima era: </span>}<span className={product.price.v2 < product.price.v1 ? 'line-through' : ''}>{formatNumberWithTwoDecimalsInString(product.price?.v1)} €</span>
                                        {product?.price?.discountPercentage > 0 &&
                                            <span className='ml-2 text-red-500'>
                                                -{formatPercentage(product.price.discountPercentage)}%
                                            </span>}
                                    </span>

                                </Box>
                                <Box
                                    fontWeight='normal'
                                    as='h2'
                                    lineHeight='tall'
                                    noOfLines={1}
                                    fontSize='sm'

                                    className={`${product.price.v2 ? 'mt-2' : 'mt-4'} lg:my-auto`}
                                >

                                    {/* {product.info.traits && <HStack spacing={2} justifyContent={'start'}>
                                    {product.info.traits.map(value => {

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
                                        product.colors
                                    }
                                    handleSelectColor={(color: string) => changeDressColor(color)}
                                    dimension={'1.5rem'} space={5} showTooltip={true}
                                />
                            </div>}
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
                                fontWeight={'normal'}
                                lots={variationSelected.lots}
                                handleLot={(size: string) => setSizeSelected(size)}
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
                                variant={!isAddedToCart ? 'secondary' : 'primary'}
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
                                        Aggiungi al carrello
                                        {sizeSelected && <span className='ml-[5px]'> - {sizeSelected.toLocaleUpperCase()}</span>}
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
                                                variant={!isAddedToCart ? 'secondary' : 'primary'}
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
                                                        Aggiungi al carrello
                                                        {sizeSelected && <span className='ml-[5px]'> - {sizeSelected.toLocaleUpperCase()}</span>}
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
                                {product.info.modelDescription && product.info.modelDescription?.length > 0 &&
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
                                                product.info.modelDescription
                                            }
                                        </Text>
                                    </>
                                }
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
                                    {product.info.materials?.length && product.info.materials?.length > 0 ? product.info.materials.join(', ') : 'non disponibile'}
                                </Text>
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
                                    {product.info.fit ? product.info.fit : 'non disponibile'}
                                </Text>
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
                                    {product.info.length ? product.info.length : 'non disponibile'}
                                </Text>
                                {product.info.description && product.info.description?.length > 0 &&
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
                                                noOfLines={!showAllDescriptionShop || descriptionRefTextLength <= 3 ? 3 : 100}
                                                fontSize={'md'}
                                                fontWeight={'normal'}
                                                color={'#909090'}
                                                className='col-span-2 lg:col-span-3'
                                                ref={descriptionRefText}
                                            >
                                                {product.info.description}
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

                                    </>
                                }
                            </Box>

                            {false && <Box
                                mt={3}

                                borderRadius={10}
                                bg={'white'}
                                position={'relative'}

                            >
                                <Disclosure
                                >
                                    {({ open }) => (
                                        <Box
                                            width={'full'}
                                            paddingY={[5, 5]}
                                            paddingX={[2, 5]}
                                            position={open && !isSmallView ? 'absolute' : 'static'}
                                            bg={'white'}
                                            borderRadius={10}
                                            borderWidth={1}
                                        >
                                            <Disclosure.Button className="flex text-center w-full h-full"
                                            >
                                                <Box
                                                    className='m-auto flex'

                                                    bg={'white'}
                                                >
                                                    <Text
                                                        fontSize={'lg'}
                                                        fontWeight={'bold'}
                                                        margin={'auto'}
                                                    >
                                                        Caratteristiche
                                                    </Text>
                                                    <NavArrowDown
                                                        strokeWidth={3}
                                                        className={`${open ? 'rotate-180 transform' : ''
                                                            } h-6 w-6 my-auto ml-1`}
                                                    />
                                                </Box>

                                            </Disclosure.Button>
                                            <Disclosure.Panel className="pl-1 pt-4 pb-2 text-sm text-gray-500">

                                                <Box
                                                    className='grid grid-cols-3 lg:grid-cols-4 w-fit gap-x-1 gap-y-4 lg:gap-4'
                                                >
                                                    {product.info.modelDescription && product.info.modelDescription?.length > 0 &&
                                                        <>
                                                            <Text
                                                                fontSize={'md'}
                                                                fontWeight={'semibold'}
                                                                color={'black'}
                                                            >
                                                                Descrizione modello
                                                            </Text>
                                                            <Text
                                                                fontSize={'md'}
                                                                fontWeight={'normal'}
                                                                color={'#909090'}
                                                                className='col-span-2 lg:col-span-3'
                                                            >   {
                                                                    product.info.modelDescription
                                                                }
                                                            </Text>
                                                        </>
                                                    }
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
                                                        {product.info.materials?.length && product.info.materials?.length > 0 ? product.info.materials.join(', ') : 'non disponibile'}
                                                    </Text>
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
                                                        {product.info.fit ? product.info.fit : 'non disponibile'}
                                                    </Text>
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
                                                        {product.info.length ? product.info.length : 'non disponibile'}
                                                    </Text>
                                                    {product.info.description && product.info.description?.length > 0 &&
                                                        <>
                                                            <Text
                                                                fontSize={'md'}
                                                                fontWeight={'semibold'}
                                                                color={'black'}
                                                            >
                                                                Descrizione
                                                            </Text>
                                                            <Text
                                                                fontSize={'md'}
                                                                fontWeight={'normal'}
                                                                color={'#909090'}
                                                                className='col-span-2 lg:col-span-3'
                                                            >   {
                                                                    product.info.description
                                                                } lorem ipsum dolorem sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam
                                                            </Text>
                                                        </>
                                                    }
                                                </Box>

                                            </Disclosure.Panel>
                                        </Box>
                                    )}
                                </Disclosure>
                            </Box>}


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
                        {product.shopInfo.name}
                    </Box>
                    <Link
                        prefetch={false}
                        href={`/negozio/${product.shopInfo.id}/${createUrlSchema([product.shopInfo.name])}`}>
                        <Box
                            fontWeight='normal'
                            as='h1'
                            noOfLines={1}
                            mb={5}
                            className='text-xl md:text-2xl w-fit ml-2'
                            lineHeight={'normal'}
                        >
                            Altri prodotti di <span className='underline '>{product.shopInfo.name}</span>
                        </Box>
                    </Link>
                    <InView as="div" onChange={(inView, entry) => { handleVisibilityChange(inView) }} >
                        <div
                            className="overflow-x-scroll flex gap-4 pb-4 min-h-[300px] ml-2"
                        >
                            <AnimatePresence>

                                {productsLikeThis && productsLikeThis.map((product: Product, index: number) => {
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
                                                className={`lg:w-96 w-72 `}/*  aspect-[8.5/12] */
                                            >
                                                <motion.div
                                                    key={product.id}
                                                    variants={listItemVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="hidden"
                                                >

                                                    <Box_Dress
                                                        overflowCards={true}
                                                        productLink={`/prodotto/${product.id}/${createUrlSchema([product?.info?.brand, product.name])}`}
                                                        showStoreHeader={false} product={product} color={typeof colors === 'string' ? colors : undefined} />
                                                </motion.div>

                                            </Box>
                                        </div>
                                    )

                                })

                                }
                            </AnimatePresence>


                        </div>
                    </InView>

                </Box >

            }

            <ModalReausable
                marginTop={10}
                positionTopModal={true}
                title={`${toUpperCaseFirstLetter(product.info.macroCategory)} da ${product.info.gender === 'm' ? 'uomo' : 'donna'}`} isOpen={isOpenModalGuideSize}
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