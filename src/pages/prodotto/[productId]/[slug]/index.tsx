import { useRouter } from 'next/router'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import Desktop_Layout from '../../../../../components/atoms/Desktop_Layout';
import { Box, Button, ButtonGroup, HStack, Image, Tag, Text, Tooltip } from '@chakra-ui/react';
import GET_SINGLE_PRODUCT from '../../../../lib/apollo/queries/getSingleProduct'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Product, Variation } from '../../../../interfaces/product.interface';
import { initApollo } from '../../../../lib/apollo';
import Circle_Color from '../../../../../components/atoms/Circle_Color';
import Size_Box from '../../../../../components/atoms/Size_Box';
import Horizontal_Line from '../../../../../components/atoms/Horizontal_Line';
import createUrlSchema from '../../../../../components/utils/create_url';
import { Color, COLORS } from '../../../../../components/mook/colors';
import { createTextCategory } from '../../../../../components/utils/createTextCategory';
import 'react-lazy-load-image-component/src/effects/blur.css';
import GET_PRODUCTS_FROM_SHOP from '../../../../lib/apollo/queries/geetProductsShop';
import { toProductPage } from '../../../../../components/utils/toProductPage';
import Image_Product from '../../../../../components/organisms/Image_Product';
import GET_SINGLE_SHOP from '../../../../lib/apollo/queries/getSingleShop';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { imageKitUrl } from '../../../../../components/utils/imageKitUrl';
import PostMeta from '../../../../../components/organisms/PostMeta';
import Link from 'next/link';
import CircleColorSelected from '../../../../../components/atoms/CircleColorSelected';
import toUpperCaseFirstLetter from '../../../../../components/utils/uppercase_First_Letter';
import BlackButton from '../../../../../components/atoms/BlackButton';
import ModalReausable from '../../../../../components/organisms/ModalReausable'
import CartDrawer from '../../../../../components/organisms/CartDrawer';
import EDIT_CART from '../../../../lib/apollo/mutations/editCart';
import { useDispatch, useSelector } from 'react-redux';
import { Cart, ProductVariation } from '../../../../interfaces/carts.interface';
import { editVariationFromCart } from '../../../../store/reducers/carts';
import { Firebase_User } from '../../../../interfaces/firebase_user.interface';
import { newTotalHandler } from '../../../../../components/utils/newTotalHandler';
import { setInLocalStorage } from '../../../../../components/utils/setInLocalStorage';
import { changeGenderSelected } from '../../../../store/reducers/user';
import { sortShopsInCart } from '../../../../../components/utils/sortShopsInCart';
import { handleErrorGraphQL } from '../../../../../components/utils/handleError_graphQL';
import expirationTimeTokenControll from '../../../../../components/utils/expirationTimeTokenControll';
import Box_Dress from '../../../../../components/molecules/Box_Dress';
import { ArrowRight, NavArrowDown } from 'iconoir-react';
import { sortAndFilterSizes } from '../../../../../components/utils/sortAndFilterSizes';
import { Disclosure, Transition } from '@headlessui/react';

export async function getStaticPaths() {
    return {
        paths: [],
        fallback: 'blocking', // can also be true or false
    }
}




export async function getStaticProps(ctx: any) {

    const sizes = [
        "xxs",
        "xs",
        "s",
        "m",
        "l",
        "xl",
        "xxl",
        "3xl",
        "4xl",
        "5xl",
    ]
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
                name: variation.color,
                cssColor: COLORS.find(color => color.name === variation.color)?.cssColor
            }
        })

        const totalSizeAvailable = sortAndFilterSizes(data.product.variations)



        return {
            props: {
                product: {
                    ...data.product,
                    colors,
                    totalSizeAvailable
                },
                //?understand cache in GraphQL
                initialApolloState: apolloClient.cache.extract(),
            },
            revalidate: 60, // In seconds
        }

    } catch (e: any) {
        console.log(e);


        return {
            props: {
                errorLog: e?.graphQLErrors[0].name || 'errore',
                //?understand cache in GraphQL
                initialApolloState: apolloClient.cache.extract(),
            },
            revalidate: 60, // In seconds
        }
    }

}






const index: React.FC<{ product: Product, errorLog?: string, initialApolloState: any }> = ({ product, errorLog, initialApolloState }) => {
    const colors = useRef<Color[]>(COLORS)
    const router = useRouter();
    const { slug } = router.query;
    const [variationSelected, setVariationSelected] = useState(product.variations[0])
    const [sizeSelected, setSizeSelected] = useState<string>('')
    const [colorSelected, setColorSelected] = useState<string>(product.variations[0].color)
    const [isOpenModalSize, setisOpenModalSize] = useState(false)
    const [getFilterProduct, shopProductsData] = useLazyQuery(GET_PRODUCTS_FROM_SHOP);
    const [openDrawerCart, setOpenDrawerCart] = useState(false)
    const [editCart, elementEditCart] = useMutation(EDIT_CART);
    const cartsDispatchProduct: Cart[] = useSelector((state: any) => state.carts.carts);
    const user: Firebase_User = useSelector((state: any) => state.user.user);

    const dispatch = useDispatch();
    console.log(product);




    useEffect(() => {
        console.log(elementEditCart.error?.graphQLErrors);
        console.log(elementEditCart.error?.graphQLErrors[0].name);
        if (!elementEditCart.error?.graphQLErrors[0].name || !elementEditCart.error?.graphQLErrors[0].path || typeof elementEditCart.error?.graphQLErrors[0].path !== 'string') return
        const error = handleErrorGraphQL({
            name: elementEditCart.error?.graphQLErrors[0].name,
            path: elementEditCart.error?.graphQLErrors[0].path
        })





    }, [elementEditCart.error])




    useEffect(() => {

        if (errorLog) {
            console.log(errorLog);

            router.push({
                pathname: '/404',
                query: { error: errorLog },
            })
        }
    }, [errorLog])

    useEffect(() => {

        const color = router.query.colore
        if (typeof color === 'string') {
            const variation = product.variations.find(variation => variation.color.toLowerCase() == color.toLowerCase())
            if (!variation) return
            setVariationSelected(variation)
            setColorSelected(variation.color)
            return
        }
    }, [router.query.colore])











    useEffect(() => {
        if (!product) return
        //const category = createTextCategory(product.info.macroCategory, product.info.microCategory)
        //setTextCategory(category)
        const url_slug_correct = createUrlSchema([product.info.brand, product.name])
        if (url_slug_correct !== slug) {
            router.push({
                pathname: `/prodotto/${router.query.productId}/${url_slug_correct}`,
            },
                undefined, { shallow: true }
            )
        }

        setInLocalStorage('genderSelected', product.info.gender)
        dispatch(
            changeGenderSelected(product.info.gender)
        );

        //! lista di prodotti del negozio
        const fetchData = async () => {
            await getFilterProduct({
                variables: {
                    id: product.shopInfo.id,
                    limit: 8,
                    offset: 0,
                },
                fetchPolicy: 'cache-first',
            })
        }

        setTimeout(() => {
            fetchData()
        }, 100);




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


    //console.log(imageKitUrl(product.photos[0], 171, 247));





    // return (
    //     <></>
    // )

    const changeDressColor = (color: string) => {
        const variation = product.variations.find(variation => variation.color.toLowerCase() == color.toLowerCase())
        if (!variation) return
        setVariationSelected(variation)
        setColorSelected(variation.color)
        setSizeSelected('')
        router.push({
            pathname: router.asPath.split('?')[0],
            query: { colore: color }
        },
            undefined, { shallow: true }
        )
    }

    const addToCart = async (product: Product) => {
        //qui si invita a fare login
        if (!user?.uid) {
            console.log(router.asPath);

            return router.push({
                pathname: '/user/login',
                query: {
                    type: 'login',
                    callbackUrl: router.asPath
                },

            })
        }

        const resolve = await expirationTimeTokenControll(user.expirationTime)
        if (!resolve) return


        if (!sizeSelected || !colorSelected) {
            setisOpenModalSize(true)
            setTimeout(() => {
                setisOpenModalSize(false)
            }, 3000);
        }
        else {
            console.log(cartsDispatchProduct);
            let productVariationQuantity = 0
            const Carts: Cart[] = cartsDispatchProduct
            const Cart = Carts.find(cart => cart.shopInfo.id === product.shopInfo.id);

            let NewCart: Cart;
            let NewCarts: Cart[] = [];

            //CART ESISTENTE
            if (Cart) {
                console.log(Cart.productVariations);

                const quantity = Cart.productVariations.find(variation => variation.size === sizeSelected && variation.variationId === variationSelected.id)?.quantity

                //caso in cui la Variation è già presente in cart
                if (quantity) {
                    productVariationQuantity = quantity
                    const index = Cart.productVariations.findIndex(variation => variation.size === sizeSelected)
                    const newProductVariation = {
                        ...Cart.productVariations[index],
                        quantity: quantity + 1
                    }

                    const productVariations = [
                        newProductVariation,
                        ...Cart.productVariations.filter(variation => variation.size !== sizeSelected || variation.variationId !== variationSelected.id),
                    ]


                    console.log(productVariations);

                    const newTotal = newTotalHandler(productVariations)

                    const NewCart = {
                        ...Cart,
                        total: newTotal,
                        productVariations: productVariations

                    }
                    NewCarts = [
                        ...Carts.filter(cart => cart.shopInfo.id !== product.shopInfo.id),
                        NewCart
                    ]
                }
                //caso in cui la Variation non esiste nel cart
                if (!quantity) {
                    const newProductVariation: ProductVariation = {
                        id: variationSelected.id,
                        variationId: variationSelected.id,
                        photo: variationSelected.photos[0],
                        name: product.name,
                        brand: product.info.brand,
                        quantity: 1,
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
                console.log('passa');

                const newProductVariation: ProductVariation = {
                    id: variationSelected.id,
                    variationId: variationSelected.id,
                    photo: variationSelected.photos[0],
                    name: product.name,
                    brand: product.info.brand,
                    quantity: 1,
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
                        status: product.shopInfo.status
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


            try {
                const edited = await editCart({
                    variables: {
                        productVariationId: variationSelected.id,
                        size: sizeSelected,
                        quantity: ++productVariationQuantity
                    }
                })
                // if (!edited.data?.editCart) return //mettere un errore qui
                dispatch(
                    editVariationFromCart({
                        //add new Carts
                        carts: NewCarts
                    })
                );
                setOpenDrawerCart(true)
            } catch (e: any) {
                console.log(e.message);

            }



        }
    }

    return (
        <>
            {product && <Desktop_Layout>

                <PostMeta
                    canonicalUrl={'https://www.veplo.it' + router.asPath}
                    //riverdere length description 150 to 160
                    title={`${product.name.toUpperCase()} ${product.info.brand} - ${product.info.macroCategory} - ${product.shopInfo.city} - Veplo.it`}
                    subtitle={`${product.name.toUpperCase()} ${product.info.brand} - ${product.info.macroCategory} a ${product.price.v2 ? product.price.v2 : product.price.v1}€ | vivi Veplo`}
                    image={imageKitUrl(variationSelected.photos[0], 171, 247)}
                    description={`${product.name.toUpperCase()} ${product.info.brand} - ${product.info.macroCategory} - Veplo.it`} />

                <div className='md:flex justify-between w-full mb-5 lg:mb-0 '>
                    <Image_Product variation={variationSelected} />
                    <Box className='md:block md:w-6/12 md:pl-4 xl:pr-24 lg:mt-2'>
                        <Text
                            fontWeight='medium'
                            as='h2'
                            noOfLines={1}
                            mt='0'
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
                            fontSize='3xl'
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
                                {product.price?.v2 && <span className=' text-red-700 font-bold'>{product.price?.v2.toFixed(2).replace('.', ',')} €<br /></span>}

                                <span
                                    className={`${product.price?.v2 ? 'text-slate-500 font-normal text-sm ' : ''} mr-2`}
                                >
                                    {product.price.v2 && <span>prima era: </span>}<span className={`${product.price?.v2 ? 'line-through' : ''}`}>{product.price?.v1.toFixed(2).replace('.', ',')} €</span>
                                    {product.price.discountPercentage &&
                                        <span className='ml-2 text-red-500'>
                                            -{product.price.discountPercentage.toString().replace('.', ',')}%
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
                            mt='6'
                            fontSize='md'
                        >
                            {product.colors.length || 0}
                            {product.colors.length === 1 && <span className='ml-1'>colorazione disponibile</span>}
                            {product.colors.length > 1 && <span className='ml-1'>colorazioni disponibili</span>}
                        </Box>}
                        {product.colors && <div className='mt-2'>
                            <CircleColorSelected
                                colorSelected={colorSelected}
                                colors={
                                    product.colors
                                }
                                handleSelectColor={(color: string) => changeDressColor(color)}
                                dimension={7} space={5} showTooltip={true}
                            />
                        </div>}
                        <Box
                            fontWeight='light'
                            as='h1'
                            noOfLines={1}
                            mt='6'
                            mb={3}
                            fontSize='md'
                        >
                            Taglie disponibili
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

                        <Button
                            mt={5}
                            onClick={() => addToCart(product)}
                            type={'button'}
                            borderRadius={'md'}
                            size={'xl'}
                            padding={5}
                            fontSize={['xl', 'lg']}
                            paddingInline={10}
                            width={'full'}
                            height={'fit-content'}
                            bg={'black.900'}
                            color={'white'}
                            _hover={{ bg: 'black.900' }}
                            _focus={{
                                bg: 'black.900'
                            }}
                            _active={{
                                transform: 'scale(0.98)',
                            }}
                        >aggiungi alla borsa</Button>

                        <Box
                            mt={5}
                            borderWidth={1}
                            borderRadius={10}
                            paddingY={[5, 5]}
                            paddingX={[2, 5]}
                        >
                            <Disclosure>
                                {({ open }) => (
                                    <Box>
                                        <Disclosure.Button className="flex text-center m-auto">
                                            <Text
                                                fontSize={'lg'}
                                                fontWeight={'bold'}
                                            >
                                                Caratteristiche
                                            </Text>
                                            <NavArrowDown
                                                strokeWidth={3}
                                                className={`${open ? 'rotate-180 transform' : ''
                                                    } h-6 w-6 my-auto ml-1`}
                                            />
                                        </Disclosure.Button>
                                        <Transition
                                            show={open}
                                            enter="transition ease-out duration-150 transform"
                                            enterFrom="opacity-0 scale-95"
                                            enterTo="opacity-100 scale-100"
                                            leave="transition ease-in duration-75 transform"
                                            leaveFrom="opacity-100 scale-100"
                                            leaveTo="opacity-0 scale-95"
                                        >
                                            <Disclosure.Panel className="pl-1 pt-4 pb-2 text-sm text-gray-500">

                                                <Box
                                                    className='grid grid-cols-3 lg:grid-cols-4 w-fit gap-x-1 gap-y-4 lg:gap-4'
                                                >
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
                                                        {product.info.materials?.length && product.info.materials?.length > 0 ? product.info.materials : 'non disponibile'}
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
                                                    >
                                                        Tshirt con maniche a giro, girocollo a costine, doppia impuntura larga a fondo manica e sul bordo inferioreTessuto Jersey 100% cotone biologico filato e pettinato, Fabric washed (Manca)
                                                    </Text>
                                                </Box>

                                            </Disclosure.Panel>


                                        </Transition>

                                    </Box>
                                )}
                            </Disclosure>
                        </Box>


                    </Box>
                </div>
                <Horizontal_Line />
                <Box

                    fontWeight='bold'
                    as='h1'
                    noOfLines={1}
                    className='text-2xl md:text-5xl mt-5 lg:mt-0'
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
                        className='text-xl md:text-2xl w-fit'
                        lineHeight={'normal'}
                    >
                        Altri prodotti di <span className='underline '>{product.shopInfo.name}</span>
                    </Box>
                </Link>

                <div
                    className="overflow-x-scroll flex gap-4 pb-4"
                >
                    {shopProductsData && shopProductsData?.data?.shop.products.products.map((product: Product) => {

                        return (
                            <div
                                key={product.id}
                                className={'flex gap-4 w-fit'} >
                                <Box
                                    overflow='hidden'
                                    mb={2}
                                    className={`lg:w-96 w-72 `}/*  aspect-[8.5/12] */
                                >
                                    <Box_Dress showStoreHeader={false} product={product} color={typeof colors === 'string' ? colors : undefined} />

                                </Box>
                            </div>


                        )
                    })
                    }

                </div>



            </Desktop_Layout>}
            <ModalReausable

                marginTop={0}
                title='Manca la taglia' isOpen={isOpenModalSize}
                closeModal={() => setisOpenModalSize(false)}
            >
                <Box
                    marginTop={3}
                    fontSize={'md'}
                    fontWeight={'normal'}
                    color={'gray.500'}
                >
                    Inserisci la taglia prima di aggiungere il prodotto alla borsa
                </Box>


            </ModalReausable>
            <CartDrawer isOpen={openDrawerCart} closeDrawer={() => setOpenDrawerCart(false)} />

        </>

    )
}

export default index







// <>
// <Link
//     prefetch={false}
//     href={`/negozio/${product.shopInfo.id}/${createUrlSchema([product.shopInfo.name])}`}>
//     <Box
//         fontWeight='light'
//         as='h1'
//         noOfLines={1}
//         mt='6'
//         mb={3}
//         fontSize='md'
//     >
//         Altri prodotti simili di <span className='underline underline-offset-2 cursor-pointer'>{product.shopInfo.name}</span>
//     </Box>
// </Link>


// <div className="overflow-x-scroll flex gap-4 pb-4">
//     {shopProductsData && shopProductsData?.data?.shop.products.products.map((element: Product) => {
//         let colorsCSS: string[] = [];
//         if (element.variations) {
//             element?.variations.map((variation) => {
//                 const ColorCCS = COLORS.find(color => color.name === variation.color)
//                 if (ColorCCS) {
//                     colorsCSS.push(ColorCCS.cssColor)
//                 }
//             })
//         }
//         console.log(colorsCSS);


//         return (
//             <Link
//                 prefetch={false}
//                 key={element.id} href={`/prodotto/${element.id}/${toProductPage(element)}`}>
//                 <div className={`${element.id === product.id ? 'hidden' : 'flex'} gap-4 w-fit`} >
//                     <Box borderRadius='xl' overflow='hidden'
//                         borderWidth={0.5}
//                         className={`w-36`}/*  aspect-[8.5/12] */
//                         _active={{
//                             transform: 'scale(0.98)',
//                         }}
//                     >
//                         <LazyLoadImage
//                             src={
//                                 imageKitUrl(element.variations[0].photos[0], 171, 247)
//                             }//placeholderSrc={'/static/grayScreen.png'}
//                             effect="blur"
//                             alt={element.name}


//                             className=' cursor-pointer hover:scale-105  object-cover'
//                         />
//                         <Box
//                             fontWeight={['light', 'normal']}
//                             as='h1'
//                             fontSize={['2xs', 'xs']}
//                             noOfLines={1}
//                             marginX={'2'}
//                             mt={'1'}
//                             mb={-1}
//                         >
//                             {element.info.brand}
//                         </Box>
//                         <Box
//                             fontWeight='semibold'
//                             as='h1'
//                             fontSize={['xs', 'xs']}
//                             noOfLines={1}
//                             marginX={'2'}
//                         >
//                             {element.name.toUpperCase()}
//                             {/* {height} - {width} */}
//                         </Box>
//                         <Box
//                             fontWeight={'bold'}
//                             as='h4'
//                             fontSize={'xs'}
//                             color={'green.600'}
//                             lineHeight='none'
//                             noOfLines={1}
//                             marginX={'2'}

//                         >
//                             <span
//                                 className={`${element.price?.v2 ? 'text-slate-500 font-normal line-through text-[11px]' : ''}`}
//                             >
//                                 {Number(element.price?.v1).toFixed(2).replace('.', ',')} €
//                             </span>
//                             {element.price?.v2 && <span className=' text-red-700 font-bold ml-1'>{element.price?.v2.toFixed(2).replace('.', ',')} €</span>}
//                         </Box>
//                         <div className='text-right flex float-right mb-2 mx-2'>
//                             <Circle_Color colors={colorsCSS} dimension={4} space={1} />
//                         </div>
//                     </Box>

//                 </div>
//             </Link>
//         )
//     })}
//     <Link
//         prefetch={false}
//         href={`/negozio/${product.shopInfo.id}/${createUrlSchema([product.shopInfo.name])}`}
//         className={`flex gap-4 w-36 max-h-max justify-center`}
//     >
//         <div className='my-auto'>
//             <Box borderRadius='lg' overflow='hidden'
//                 borderWidth={0.5}
//                 paddingY={'10'}
//                 className={`w-36 h-full flex cursor-pointer bg-gray-50`}
//                 // onClick={() => {
//                 //     const slug = createUrlSchema([product.shopOptions.city, product.shopOptions.name])
//                 //     router.push(`/negozio/${product.shopId}/${slug}`)
//                 // }}
//                 _active={{
//                     transform: 'scale(0.98)',
//                 }}
//             >
//                 <div className='m-auto text-center'>
//                     <p className='mb-4'>
//                         vai al<br /> negozio
//                     </p>
//                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 m-auto">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
//                     </svg>

//                 </div>


//             </Box>
//         </div>
//     </Link>


// </div>
// </>