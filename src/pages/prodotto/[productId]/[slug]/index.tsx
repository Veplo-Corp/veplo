import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import Desktop_Layout from '../../../../../components/atoms/Desktop_Layout';
import { Box, Button, ButtonGroup, Image, Tooltip } from '@chakra-ui/react';
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

        const totalSize = data.product.variations.map((variation: Variation) => {
            return variation.lots.map((lot: any) => {
                return lot.size
            })

        }).flat()
        const totalSizeAvailable = totalSize.filter((item: any,
            index: any) => totalSize.indexOf(item) === index)
            .sort(function (a: string, b: string) {
                return sizes.indexOf(a) - sizes.indexOf(b)
            });



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



    useEffect(() => {
        console.log(elementEditCart.error?.graphQLErrors);
        console.log(elementEditCart.error?.graphQLErrors[0].name);
        if (!elementEditCart.error?.graphQLErrors[0].name || !elementEditCart.error?.graphQLErrors[0].path || typeof elementEditCart.error?.graphQLErrors[0].path !== 'string') return
        const error = handleErrorGraphQL({
            name: elementEditCart.error?.graphQLErrors[0].name,
            path: elementEditCart.error?.graphQLErrors[0].path
        })





    }, [elementEditCart.error])



    const [textCategory, setTextCategory] = useState('vestito')

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
                    limit: 5,
                    offset: 0,
                    see: null
                },
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
        if (!user?.uid) { return }


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

                <div className='md:flex justify-between w-full '>
                    <Image_Product variation={variationSelected} />
                    <Box className='md:block md:w-6/12 md:pl-4 xl:pr-24'>
                        <Box
                            fontWeight='normal'
                            as='h2'
                            lineHeight='tall'
                            noOfLines={1}
                            fontSize='sm'
                        >
                            {product.info.macroCategory} - {product.info.microCategory}
                            {product.info.gender === 'F' && <span className='ml-1'>per donna</span>}
                            {product.info.gender === 'M' && <span className='ml-1'>per uomo</span>}
                        </Box>
                        <Box
                            fontWeight='normal'
                            as='h2'
                            noOfLines={1}
                            mt='0'
                            fontSize='xl'
                            className='italic'
                        >
                            {product.info.brand}
                        </Box>
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
                            <span className='font-light text-lg'>{` - ${textCategory}`} ({colorSelected})</span>
                        </Box>
                        <Box
                            fontWeight='medium'
                            as='h1'
                            noOfLines={2}
                            fontSize={['lg', 'xl']}
                            lineHeight={['4']}
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
                            fontWeight={'medium'}
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
                        >Aggiungi al Carrello</Button>

                        <Box
                            fontWeight='light'
                            as='h1'
                            noOfLines={2}
                            mt='6'
                            mb={3}
                            fontSize='md'
                            onClick={() => {

                            }}
                        >
                            Hai bisogno di più informazioni sul prodotto? <span className='underline underline-offset-2 cursor-pointer'
                                onClick={chatWithStore}
                            >contatta il titolare del negozio</span>
                        </Box>


                        <>
                            <Link href={`/negozio/${product.shopInfo.id}/${createUrlSchema([product.shopInfo.city, product.shopInfo.name])}`}>
                                <Box
                                    fontWeight='light'
                                    as='h1'
                                    noOfLines={1}
                                    mt='6'
                                    mb={3}
                                    fontSize='md'
                                >
                                    Altri prodotti di <span className='underline underline-offset-2 cursor-pointer'>{product.shopInfo.name}</span>
                                </Box>
                            </Link>


                            <div className="overflow-x-scroll flex gap-4 ">
                                {shopProductsData && shopProductsData?.data?.shop.products.map((element: Product) => {

                                    return (
                                        <Link key={element.id} href={`/prodotto/${element.id}/${toProductPage(element)}`}>
                                            <div className={`${element.id === product.id ? 'hidden' : 'flex'} gap-4 w-fit`} >
                                                <Box borderRadius='lg' overflow='hidden'
                                                    borderWidth={0.5}
                                                    className={`w-36`}/*  aspect-[8.5/12] */
                                                    _active={{
                                                        transform: 'scale(0.98)',
                                                    }}
                                                >
                                                    <LazyLoadImage
                                                        src={
                                                            imageKitUrl(element.variations[0].photos[0], 171, 247)
                                                        }//placeholderSrc={'/static/grayScreen.png'}
                                                        effect="blur"
                                                        alt={element.name}


                                                        className=' cursor-pointer hover:scale-105  object-cover'
                                                    />
                                                    <Box
                                                        fontWeight={['light', 'normal']}
                                                        as='h1'
                                                        fontSize={['2xs', 'xs']}
                                                        noOfLines={1}
                                                        marginX={'2'}
                                                        mt={'1'}
                                                        mb={-1}
                                                    >
                                                        {element.info.brand}
                                                    </Box>
                                                    <Box
                                                        fontWeight='semibold'
                                                        as='h1'
                                                        fontSize={['xs', 'xs']}
                                                        noOfLines={1}
                                                        marginX={'2'}
                                                    >
                                                        {element.name.toUpperCase()}
                                                        {/* {height} - {width} */}
                                                    </Box>
                                                    <Box
                                                        fontWeight={'bold'}
                                                        as='h4'
                                                        fontSize={'xs'}
                                                        color={'green.600'}
                                                        lineHeight='none'
                                                        noOfLines={1}
                                                        marginX={'2'}

                                                    >
                                                        <span
                                                            className={`${element.price?.v2 ? 'text-slate-500 font-normal line-through text-[11px]' : ''}`}
                                                        >
                                                            {Number(element.price?.v1).toFixed(2).replace('.', ',')} €
                                                        </span>
                                                        {element.price?.v2 && <span className=' text-red-700 font-bold ml-1'>{element.price?.v2.toFixed(2).replace('.', ',')} €</span>}
                                                    </Box>
                                                    {/* <div className='text-right flex float-right my-2 mx-2'>
                                                        <Circle_Color colors={getColorsCSS(element)} dimension={4} space={1} />
                                                    </div> */}
                                                </Box>

                                            </div>
                                        </Link>
                                    )
                                })}
                                <Link href={`/negozio/${product.shopInfo.id}/${createUrlSchema([product.shopInfo.city, product.shopInfo.name])}`}
                                    className={`flex gap-4 w-36 max-h-max justify-center`}
                                >
                                    <div className='my-auto'>
                                        <Box borderRadius='lg' overflow='hidden'
                                            borderWidth={0.5}
                                            paddingY={'10'}
                                            className={`w-36 h-full flex cursor-pointer bg-gray-50`}
                                            // onClick={() => {
                                            //     const slug = createUrlSchema([product.shopOptions.city, product.shopOptions.name])
                                            //     router.push(`/negozio/${product.shopId}/${slug}`)
                                            // }}
                                            _active={{
                                                transform: 'scale(0.98)',
                                            }}
                                        >
                                            <div className='m-auto text-center'>
                                                <p className='mb-4'>
                                                    vai al<br /> negozio
                                                </p>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 m-auto">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                                                </svg>

                                            </div>


                                        </Box>
                                    </div>
                                </Link>


                            </div>
                        </>
                    </Box>
                </div>
                {/* <Horizontal_Line />
                <Box
                    fontWeight='medium'
                    as='h1'
                    noOfLines={1}
                    className='text-2xl md:text-5xl'
                    lineHeight={'normal'}
                >
                    Prodotti simili
                </Box>
                <Box
                    fontWeight='normal'
                    as='h1'
                    noOfLines={1}
                    mb={3}
                    className='text-xl md:text-4xl'
                    lineHeight={'normal'}
                >
                    scopri altri negozi con prodotti simili
                </Box> */}
            </Desktop_Layout>}
            <ModalReausable title='Manca la taglia' isOpen={isOpenModalSize}
                closeModal={() => setisOpenModalSize(false)}
            >
                <Box
                    marginTop={3}
                    fontSize={'md'}
                    fontWeight={'normal'}
                    color={'gray.500'}
                >
                    Inserisci la taglia prima di aggiungere il prodotto al carrello
                </Box>

                {/* <ButtonGroup gap='4'
                    marginTop={5}
                    display={'flex'}
                    justifyContent={'end'}
                >
                    <Button
                        onClick={() => setisOpenModalSize(false)}
                        variant={'ghost'}
                        colorScheme='teal'>Chiudi</Button>
                </ButtonGroup> */}
            </ModalReausable>
            <CartDrawer isOpen={openDrawerCart} closeDrawer={() => setOpenDrawerCart(false)} />

        </>

    )
}

export default index