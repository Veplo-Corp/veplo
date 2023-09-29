import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Box, Button, ButtonGroup, Center, CircularProgress, Divider, ListItem, Skeleton, Spinner, Stack, Text, UnorderedList, VStack, useBreakpointValue } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout'
import Loading from '../../../../components/molecules/Loading';
import NoIndexSeo from '../../../../components/organisms/NoIndexSeo'
import PriceAndShippingListingCost from '../../../../components/organisms/PriceAndShippingListingCost';
import createUrlSchema from '../../../../components/utils/create_url';
import { newTotalHandler } from '../../../../components/utils/newTotalHandler';
import CRATE_CHECKOUT_URL from '../../../lib/apollo/mutations/checkout';
import EDIT_CART from '../../../lib/apollo/mutations/editCart';
import { editVariationFromCart } from '../../../store/reducers/carts';
import GET_SHOP from '../../../lib/apollo/queries/getShop';
import ModalReausable from '../../../../components/organisms/ModalReausable';
import { Firebase_User } from '../../../interfaces/firebase_user.interface';
import LoginAndRegistrationForm from '../../../../components/organisms/LoginAndRegistrationForm';
import ProfilePhoto from '../../../../components/molecules/ProfilePhoto';
import CheckoutProduct from '../../../../components/molecules/CheckoutProduct';
import { formatNumberWithTwoDecimalsInString } from '../../../../components/utils/formatNumberWithTwoDecimalsInString';
import expirationTimeTokenControll from '../../../../components/utils/expirationTimeTokenControll';
import { Cart, CartProductVariation, CartQuery, GetSingleShopQuery, Shop } from '../../../lib/apollo/generated/graphql';
import { fbq, gtag } from '../../../lib/analytics/gtag';
import { GTMEventType, PixelEventType } from '../../../lib/analytics/eventTypes';
import { GtagVariationsToItemsFor } from '../../../../components/utils/GtagVariationsToItemsFor';
import { formatNumberWithTwoDecimalsInNumber } from '../../../../components/utils/formatNumberWithTwoDecimalsInNumber';
import { openModal } from '../../../store/reducers/globalModal';
import GET_CART from '../../../lib/apollo/queries/getCart';
import { CartDispatch } from '../../../interfaces/carts.interface';
import PageNotFound from '../../../../components/molecules/PageNotFound';


const index = () => {
    const cartsDispatch: CartDispatch[] = useSelector((state: any) => state.carts.carts);
    const user: Firebase_User = useSelector((state: any) => state.user.user);

    const [cart, setCart] = useState<Cart>()
    const router = useRouter()
    const [checkoutUrlMutation, { error }] = useMutation(CRATE_CHECKOUT_URL);
    const dispatch = useDispatch();
    const [editCart] = useMutation(EDIT_CART, {
        awaitRefetchQueries: true,
        refetchQueries: [{
            query: GET_CART,
            variables: {
                //mongoId Shop
                id: router.query.cartId
            }
        }],
    });
    const [isDisabled, setIsDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // const shopQuery = useQuery(GET_SHOP, {
    //     variables: {
    //         id: typeof router?.query?.shopId === 'string' ? router?.query?.shopId : ''
    //     }
    // });
    // const [shop, setShop] = useState<GetSingleShopQuery["shop"]>();
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
    const [isOpenLoginModal, setIsOpenLoginModal] = useState(false)
    const [typeLogin, setTypeLogin] = useState<'login' | 'registration' | 'reset_password'>('login')
    const [IsOpenDeleteVariation, setIsOpenDeleteVariation] = useState<CartProductVariation>()
    const isSmallView = useBreakpointValue({ base: true, md: false });
    const [getCart, cartResponse] = useLazyQuery(GET_CART);


    useEffect(() => {

        if (!cartResponse?.data?.cart.carts?.[0]) return
        setCart(cartResponse.data?.cart.carts?.[0])
    }, [cartResponse])


    useEffect(() => {
        const { cartId } = router.query;
        if (!router.isReady || typeof cartId !== 'string' || user.statusAuthentication === 'not_yet_authenticated') return
        //setCart(undefined)
        if (user.statusAuthentication === 'logged_out') {

            //uso lo shopId da non loggato come cartId
            const cart = cartsDispatch.filter(cart => cart.shopInfo.id === cartId)?.[0]
            if (cart) {
                setCart(cart)
            }
        }
        if (user.statusAuthentication === 'logged_in') {
            if (cart?.id !== cartId) {
                getCart({
                    variables: {
                        id: cartId
                    },
                })
            }
        }
    }, [user, router.query])




    // useEffect(() => {
    //     if (!shopQuery.data?.shop) return
    //     setShop(shopQuery?.data?.shop)
    // }, [shopQuery])




    const checkoutUrl = async () => {
        if (user.isBusiness) return

        if (!user.uid) {
            return setIsOpenLoginModal(true)
        }
        const resolve = await expirationTimeTokenControll(user.expirationTime)
        if (!resolve || !cart) return
        setIsDisabled(true)
        try {
            const create = await checkoutUrlMutation({
                variables: {
                    shopId: cart?.shopInfo?.id
                }
            })
            fbq({
                command: PixelEventType.initiateCheckout
            })
            if (!cart?.productVariations) return
            const items = GtagVariationsToItemsFor(cart?.productVariations)
            gtag({
                command: GTMEventType.begin_checkout,
                args: {
                    email: user.email,
                    ecommerce: {
                        currency: 'EUR',
                        value: formatNumberWithTwoDecimalsInNumber(typeof cart?.total === 'number' ? cart?.total : 0),
                        items: [
                            ...items
                        ]
                    }
                }
            })
            router.push(create.data.checkout)
            setIsDisabled(false)
        }
        catch (e) {
            gtag({
                command: GTMEventType.exception,
                args: {
                    description: 'errore durante checkout',
                    email: user.email
                }
            })
            dispatch(openModal({
                title: 'Errore imprevisto',
                description: "abbiamo riscontrato un errore imprevisto durante la creazione del tuo ordine. Se l'errore persiste contatta l'assistenza."
            }))
            //router.reload()

            setIsDisabled(false)
        }
    }

    const handleEditVariation = async (variationSelected: CartProductVariation, quantity: number) => {
        const resolve = await expirationTimeTokenControll(user.expirationTime)
        if (!resolve || !cart || !cart.productVariations) return
        let NewCarts: CartQuery["cart"][] = [];
        setIsDisabled(true)
        setIsLoading(true)
        //caso in cui la Variation è già presente in cart
        const index = cart.productVariations.findIndex(variation => variation?.size === variationSelected.size && variation?.id === variationSelected.id)
        const newProductVariation = {
            ...cart.productVariations[index],
            quantity: quantity
        }

        const productVariations = cart.productVariations.map(variation => {
            if (variation?.size === variationSelected.size && variation?.id === variationSelected.id) {
                // Sostituisci l'oggetto corrente con il nuovo oggetto quando le condizioni sono soddisfatte
                return newProductVariation;
            } else {
                // Mantieni l'oggetto corrente senza modifiche
                return variation;
            }
        });


        if (!productVariations || productVariations.length <= 0) return




        const newTotal: number = newTotalHandler(productVariations)

        let NewCart: any = {
            ...cart,
            total: newTotal,
            productVariations: productVariations
        }



        NewCarts = [
            ...cartsDispatch.filter(cart => cart?.id !== router?.query?.cartId),
            NewCart
        ]





        //aggiungi al carrello

        dispatch(
            editVariationFromCart({
                //add new Carts
                carts: NewCarts
            })
        );

        setCart(NewCart)

        try {
            if (user.uid) {
                await editCart({
                    variables: {
                        productVariationId: variationSelected.id,
                        size: variationSelected.size,
                        quantity: quantity
                    }
                })
            } else if (!user.uid) {
                localStorage.setItem('carts', JSON.stringify(NewCarts))
            }
            setIsDisabled(false)
            setIsLoading(false)

            // if (!edited.data?.editCart) return //mettere un errore qui

        } catch (e: any) {
            setIsDisabled(false)
            setIsLoading(false)
            dispatch(openModal({
                title: 'Errore imprevisto',
                description: 'Ci dispiace, ma non siamo riusciti ad aggiornare il carrello. Riprova tra poco.'
            }))

        }
    }

    const deleteVariation = async (variation: CartProductVariation) => {
        setIsDisabled(true)
        setIsLoading(true)
        try {
            if (user.uid) {
                await editCart({
                    variables: {
                        productVariationId: variation?.id,
                        size: variation?.size,
                        quantity: 0
                    }
                })
            }
            setIsDisabled(false)
            setIsLoading(false)

        } catch (e: any) {
            //TODO gestire errore in edit card
            setIsDisabled(false)
            setIsLoading(false)
            if (e.message.includes('mongo: no documents in result')) {
                let NewCarts: Cart[] = [];
                NewCarts = [
                    ...cartsDispatch.filter(element => element?.shopInfo?.id !== cart?.shopInfo?.id)]
                dispatch(
                    editVariationFromCart({
                        //add new Carts
                        carts: NewCarts
                    })
                );
                dispatch(
                    editVariationFromCart({
                        //add new Carts
                        carts: NewCarts
                    })
                );
                return router.push(`/@${cart?.shopInfo?.name?.unique}`)
            }
            dispatch(openModal({
                title: 'Errore imprevisto',
                description: 'Ci dispiace, ma non siamo riusciti ad aggiornare il carrello. Riprova tra poco.'
            }))
        }


        let editedCart: Cart | undefined = undefined;
        for await (const cart of cartsDispatch) {
            for await (const element of cart.productVariations) {
                if (element.productId === variation?.productId) {
                    const newVariations = cart.productVariations.filter(variationElement => variationElement.id !== variation?.id || variationElement.size !== variation?.size)
                    const newCart = {
                        ...cart,
                        productVariations: newVariations,
                        total: newTotalHandler(newVariations)
                    }
                    editedCart = newCart
                    break;
                }
            }
        }


        if (editedCart) {
            let NewCarts: Cart[] = [];
            setCart(editedCart)

            if (editedCart?.total && editedCart?.total > 0 && editedCart?.shopInfo?.id) {
                NewCarts = [
                    ...cartsDispatch.filter(cart => cart?.shopInfo?.id !== editedCart?.shopInfo?.id),
                    editedCart
                ]
                dispatch(
                    editVariationFromCart({
                        //add new Carts
                        carts: NewCarts
                    })
                );

            } else {
                NewCarts = [
                    ...cartsDispatch.filter(cart => cart?.shopInfo?.id !== editedCart?.shopInfo?.id)]
                dispatch(
                    editVariationFromCart({
                        //add new Carts
                        carts: NewCarts
                    })
                );
                if (!user.uid) {
                    localStorage.setItem('carts', JSON.stringify(NewCarts))
                }
                return router.push(`/@${cart?.shopInfo?.name?.unique}`)
            }

            //if (editedCart?.productVariations?.length < 1) return router.back()
        }
    }



    function findShippingDate(): string {
        const oggi: Date = new Date();
        const cinqueGiorniDopo: Date = new Date();
        cinqueGiorniDopo.setDate(oggi.getDate() + 5);
        const setteGiorniDopo: Date = new Date();
        setteGiorniDopo.setDate(oggi.getDate() + 7);

        const opzioniData: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'long',
        };
        const dataItalianoCinqueGiorniDopo: string = cinqueGiorniDopo.toLocaleDateString('it-IT', opzioniData);
        const dataItalianoSetteGiorniDopo: string = setteGiorniDopo.toLocaleDateString('it-IT', opzioniData);

        return `Tra il ${dataItalianoCinqueGiorniDopo} e il ${dataItalianoSetteGiorniDopo}`;
    }

    const pushToProduct = (variation: CartProductVariation) => {
        if (!variation) return
        router.push('/@' + cart?.shopInfo?.name?.unique + '/prodotto/' + variation?.productId + '/' + createUrlSchema([variation?.brand, variation?.name]) + '?colore=' + variation?.color)
    }

    const handleDeleteVariations = async () => {
        const errorVariations = error?.graphQLErrors;
        if (!errorVariations) return
        if (!user.uid) {
            return
        }
        try {
            for await (const errorVariation of errorVariations) {
                if (typeof errorVariation?.path !== 'string') return
                let id: string = errorVariation?.path
                id = id.trim()
                if (!cart?.productVariations) return
                const variations = cart?.productVariations.filter(element => element?.id === id)
                for await (const variation of variations) {
                    await editCart({
                        variables: {
                            productVariationId: variation?.id,
                            size: variation?.size,
                            quantity: 0
                        }
                    })
                }
            }
        } catch {

        }

        return router.reload();


    }



    return (
        <>
            <NoIndexSeo title='Checkout | Veplo'></NoIndexSeo>
            <Box
                className='min-h-[100vh]'
            >
                {cart ? (
                    <>

                        <Box
                            position="fixed"
                            bottom="0"
                            left="0"
                            right="0"
                            zIndex={1}
                            className='flex md:hidden'
                        >
                            <Box

                                bg={'#FFFFFF'}
                                width={'full'}
                                height={'fit-content'}
                                paddingX={3}
                                paddingY={3}
                            >
                                <Button
                                    position={'sticky'}
                                    onClick={checkoutUrl}
                                    type={'button'}
                                    borderRadius={'10px'}
                                    fontWeight={'black'}
                                    paddingInline={16}
                                    width={'full'}
                                    height={'60px'}
                                    variant={'primary'}
                                    _disabled={{
                                        bg: '#FF5A78'
                                    }}
                                    _hover={{
                                        color: 'primary.text'
                                    }}
                                    fontSize={'xl'}
                                    isDisabled={isDisabled}
                                    style={{
                                        boxShadow: '0px 0px 20px rgba(255, 90, 120, 0.25)',
                                    }}
                                >
                                    {!isDisabled ?
                                        `Procedi ${(typeof cart?.shopInfo?.minimumAmountForFreeShipping !== 'number' || typeof cart.total !== 'number' || cart?.shopInfo?.minimumAmountForFreeShipping > cart.total) ?
                                            formatNumberWithTwoDecimalsInString(cart?.total ? cart?.total + 499 : null) :

                                            formatNumberWithTwoDecimalsInString(cart.total)
                                        }€` :
                                        <Spinner
                                            thickness='4px'
                                            speed='0.65s'
                                            emptyColor='primary.bg'
                                            color='white'
                                            size='lg'
                                        />
                                    }

                                </Button>
                            </Box>

                        </Box>
                        <Desktop_Layout>

                            <div className='w-full m-auto lg:w-10/12 xl:w-8/12 mt-2'>
                                <Box
                                    width={'fit-content'}
                                >
                                    <Link
                                        href={`/@${cart?.shopInfo?.name?.unique}`}
                                    >
                                        <ProfilePhoto
                                            imgName={cart?.shopInfo?.name?.visualized}
                                            scr={cart?.shopInfo?.profilePhoto}
                                            primaryText={cart?.shopInfo?.name?.visualized}
                                            secondaryText={'@' + cart?.shopInfo?.name?.unique}
                                        />
                                    </Link>
                                </Box>

                                <Box
                                    className='md:flex'
                                    width={'full'}
                                    mx={'auto'}
                                    mt={3}
                                >
                                    <Box
                                        className='w-full lg:w-7/12 mr-5'
                                    >
                                        <Box
                                            borderWidth={1}
                                            borderColor={'#F3F3F3'}
                                            padding={5}
                                            borderRadius={'15px'}
                                        >
                                            <VStack
                                                gap={5}
                                            >
                                                {cart?.productVariations?.map(variation => {
                                                    if (!variation) {
                                                        return (
                                                            <></>
                                                        )
                                                    }
                                                    return (
                                                        <div
                                                            key={variation?.id && variation?.size ? variation?.id + variation?.size : Math.random()}
                                                            className='w-full'
                                                        >
                                                            <CheckoutProduct
                                                                shopUniqueName={cart?.shopInfo?.name?.unique ? cart?.shopInfo?.name?.unique : ''}
                                                                variation={variation}
                                                                toProduct={() => pushToProduct(variation)}
                                                                deleteVariation={() => {
                                                                    if (!variation) return
                                                                    setIsOpenDeleteVariation(variation)
                                                                }}
                                                                editVariation={(variation: CartProductVariation, quantity: number) => handleEditVariation(variation, quantity)}
                                                            />
                                                        </div>
                                                    )
                                                })}

                                            </VStack>
                                        </Box>
                                        <Box
                                            mt={5}
                                            borderWidth={1}
                                            borderColor={'#F3F3F3'}
                                            paddingX={[3, 5]}
                                            paddingY={[5, 6]}
                                            borderRadius={'15px'}
                                            textAlign={'center'}
                                            className='mb-5 lg:mb-0'
                                        >
                                            <Text
                                                fontSize={'20px'}
                                                color={'secondaryBlack.text'}
                                                fontWeight={'extrabold'}
                                            >
                                                Consegna prevista
                                            </Text>
                                            <Text
                                                fontSize={'15px'}
                                                color={'#909090'}
                                                fontWeight={'medium'}
                                            >
                                                {findShippingDate()}
                                            </Text>
                                        </Box>

                                    </Box>
                                    <Box
                                        className='w-full lg:w-5/12'
                                    >
                                        <Box

                                            borderWidth={1}
                                            borderColor={'#F3F3F3'}
                                            padding={5}
                                            borderRadius={'15px'}
                                        >
                                            <VStack
                                                gap={6}
                                                width={'full'}
                                            >
                                                <Box
                                                    display={'flex'}
                                                    width={'full'}
                                                    justifyContent={'space-between'}
                                                >
                                                    <Text
                                                        fontSize={'18px'}
                                                        fontWeight={'medium'}
                                                        color={'#909090'}
                                                    >
                                                        Subtotale
                                                    </Text>
                                                    {!isLoading ? (
                                                        <Text
                                                            fontSize={'18px'}
                                                            fontWeight={'semibold'}
                                                            color={'secondaryBlack.text'}
                                                        >
                                                            {formatNumberWithTwoDecimalsInString(cart.total)}€
                                                        </Text>
                                                    ) : (
                                                        <Stack
                                                            marginY={'auto'}
                                                        >
                                                            <Skeleton

                                                                height='20px' width={'60px'} />
                                                        </Stack>
                                                    )
                                                    }

                                                </Box>
                                                <Box
                                                    display={'flex'}
                                                    width={'full'}
                                                    justifyContent={'space-between'}
                                                >
                                                    <Box>
                                                        <Text
                                                            fontSize={'18px'}
                                                            fontWeight={'medium'}
                                                            color={'#909090'}
                                                            lineHeight={'18px'}
                                                        >
                                                            Spedizione
                                                        </Text>

                                                        {(typeof cart?.shopInfo?.minimumAmountForFreeShipping === 'number' && typeof cart.total === 'number' && cart?.shopInfo?.minimumAmountForFreeShipping > cart.total) && <Text
                                                            fontSize={'12px'}
                                                            fontWeight={'medium'}
                                                            color={'primary.bg'}
                                                        >
                                                            * gratis dai {cart?.shopInfo?.minimumAmountForFreeShipping && cart?.shopInfo?.minimumAmountForFreeShipping / 100} euro di carrello
                                                        </Text>}
                                                    </Box>


                                                    {!isLoading ? (
                                                        <Text
                                                            fontSize={'18px'}
                                                            fontWeight={'semibold'}
                                                            color={'secondaryBlack.text'}
                                                        >
                                                            {typeof cart?.shopInfo?.minimumAmountForFreeShipping === 'number' && typeof cart.total === 'number' && cart?.shopInfo?.minimumAmountForFreeShipping > cart.total ? '4,99€' :
                                                                !cart?.shopInfo?.minimumAmountForFreeShipping ? '4,99€' :
                                                                    'gratis'}
                                                        </Text>
                                                    ) : (
                                                        <Stack
                                                            marginY={'auto'}
                                                        >
                                                            <Skeleton

                                                                height='20px' width={'55px'} />
                                                        </Stack>
                                                    )
                                                    }
                                                </Box>
                                            </VStack>
                                            <Divider
                                                mt={4}
                                                mb={5}
                                                bg={'#F3F3F3'}
                                            />
                                            <Box
                                                display={'flex'}
                                                width={'full'}
                                                justifyContent={'space-between'}
                                                className='md:mb-5'
                                            >
                                                <Text
                                                    fontSize={'18px'}
                                                    fontWeight={'medium'}
                                                    color={'#909090'}
                                                >
                                                    Totale
                                                </Text>
                                                {!isLoading ? (
                                                    <Text
                                                        fontSize={'18px'}
                                                        fontWeight={'semibold'}
                                                        color={'secondaryBlack.text'}
                                                    >
                                                        {
                                                            (typeof cart?.shopInfo?.minimumAmountForFreeShipping !== 'number' || typeof cart.total !== 'number' || cart?.shopInfo?.minimumAmountForFreeShipping > cart.total) ?
                                                                formatNumberWithTwoDecimalsInString(cart.total ? cart.total + 499 : null) :
                                                                formatNumberWithTwoDecimalsInString(cart.total)
                                                        }€
                                                    </Text>
                                                ) : (
                                                    <Stack
                                                        marginY={'auto'}
                                                    >
                                                        <Skeleton

                                                            height='20px' width={'70px'} />
                                                    </Stack>
                                                )
                                                }

                                            </Box>
                                            <Box
                                                className='hidden md:flex'
                                            >
                                                <Button
                                                    onClick={checkoutUrl}
                                                    type={'button'}
                                                    borderRadius={'10px'}
                                                    size={'20px'}
                                                    fontWeight={'black'}
                                                    paddingInline={16}
                                                    width={'full'}
                                                    height={'55px'}
                                                    variant={'primary'}
                                                    _disabled={{
                                                        bg: '#FF5A78'
                                                    }}
                                                    _hover={{
                                                        color: 'primary.text'
                                                    }}
                                                    isDisabled={isDisabled}
                                                    style={{
                                                        boxShadow: '0px 0px 20px rgba(255, 90, 120, 0.25)',
                                                    }}

                                                > {!isDisabled ?

                                                    `Procedi` :
                                                    <Spinner
                                                        thickness='4px'
                                                        speed='0.65s'
                                                        emptyColor='primary.bg'
                                                        color='white'
                                                        size='lg'
                                                    />
                                                    }

                                                </Button>
                                            </Box>

                                        </Box>
                                        <Box
                                            mt={5}
                                            borderWidth={1}
                                            borderColor={'#F3F3F3'}
                                            paddingX={5}
                                            paddingY={8}

                                            borderRadius={'15px'}
                                            textAlign={'center'}
                                        >

                                            <Text
                                                fontSize={'12px'}
                                                color={'#909090'}
                                                fontWeight={'normal'}
                                            >
                                                Se hai un coupon inseriscilo nel passaggio successivo
                                            </Text>
                                        </Box>
                                    </Box>


                                </Box>

                            </div>
                            <ModalReausable title='Carrello ingombrante' isOpen={isErrorModalOpen} closeModal={() => setIsErrorModalOpen(false)} >
                                <Text mt={2}
                                    mb={3}
                                    fontSize={'md'}
                                    fontWeight={'medium'}
                                >
                                    Dobbiamo eliminare dal carrello questi prodotti perchè non sono più disponibili o la quantità selezionata è terminata:
                                </Text>
                                <UnorderedList
                                    fontSize={'md'}
                                    fontWeight={'bold'}
                                >
                                    {error?.graphQLErrors.map((error, index) => {
                                        if (typeof error.path !== 'string') return (<></>)
                                        let id: string = error.path
                                        id = id.trim()
                                        const variations = cart?.productVariations?.filter(element => element?.id === id)
                                        if (!variations) return (<></>)
                                        return (
                                            <div key={index}>
                                                {
                                                    variations.map((variation, index) => {
                                                        return (
                                                            <ListItem
                                                                key={index}
                                                            >
                                                                {variation?.name}
                                                            </ListItem>)
                                                    })
                                                }
                                            </div>
                                        )


                                    })}
                                </UnorderedList>
                                <ButtonGroup gap='2'
                                    display={'flex'}
                                    justifyContent={'right'}
                                    mt={5}
                                >

                                    <Button colorScheme='orange'
                                        borderRadius={'full'}
                                        paddingX={6}
                                        paddingY={5}
                                        size={'sm'}
                                        isDisabled={false}
                                        //disabled={images.length < 2 || color === '' || productSizeSelected[0]?.quantity === undefined || productSizeSelected[0]?.quantity < 1 || productSizeSelected[0]?.size === undefined || productSizeSelected[0]?.size === ''}
                                        onClick={handleDeleteVariations}
                                    >Conferma
                                    </Button>
                                </ButtonGroup>

                            </ModalReausable>
                        </Desktop_Layout>
                    </>
                ) : cartResponse.loading ?
                    (
                        <Box
                            mt={48}
                        >
                            <Loading />
                        </Box>
                    ) : cartResponse.error ? (
                        <PageNotFound
                            title='Errore imprevisto'
                            description='Ci dispiace, non siamo riusciti a trovare il carrello'
                            imageSrc='https://www.datocms-assets.com/102220/1686599080-undraw_cancel_re_pkdm.png'
                        />
                    ) : (
                        <></>
                    )
                }
            </Box>

            <ModalReausable
                marginTop={0}
                title='' isOpen={isOpenLoginModal}
                closeModal={() => setIsOpenLoginModal(false)}
            >
                <LoginAndRegistrationForm
                    open='modal'
                    type={typeLogin}
                    person='user'
                    shopId={cart?.shopInfo?.id ? cart?.shopInfo?.id : ''}
                    handleChangeTypeOrPerson={(type, person) => {
                        if (person === 'business') return
                        setTypeLogin(type)
                    }}
                    closeModal={() => setIsOpenLoginModal(false)}
                />
            </ModalReausable>

            <ModalReausable
                marginTop={0}
                title='Elimina prodotto' isOpen={IsOpenDeleteVariation ? true : false}
                closeModal={() => setIsOpenDeleteVariation(undefined)}
            >
                <Text
                    mr={5}
                    mt={5}
                    fontSize={'18px'}
                    fontWeight={'normal'}
                    color={'secondaryBlack.text'}
                >
                    Vuoi veramente rimuovere il prodotto dal carrello?
                </Text>
                <ButtonGroup
                    float={'right'}
                    mt={5}
                >
                    <Button
                        variant={'grayPrimary'}
                        borderRadius={'15px'}
                        onClick={() => {
                            if (!IsOpenDeleteVariation) return
                            deleteVariation(IsOpenDeleteVariation)
                            setIsOpenDeleteVariation(undefined)
                        }}
                    >
                        rimuovi prodotto
                    </Button>
                </ButtonGroup>
            </ModalReausable>
        </>

    )
}

export default index