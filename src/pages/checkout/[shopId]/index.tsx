import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Box, Button, ButtonGroup, Divider, ListItem, Text, UnorderedList, VStack, useBreakpointValue } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout'
import Loading from '../../../../components/molecules/Loading';
import VariationBoxList from '../../../../components/molecules/VariationBoxList';
import NoIndexSeo from '../../../../components/organisms/NoIndexSeo'
import PriceAndShippingListingCost from '../../../../components/organisms/PriceAndShippingListingCost';
import createUrlSchema from '../../../../components/utils/create_url';
import { newTotalHandler } from '../../../../components/utils/newTotalHandler';
import { Cart, ProductVariation } from '../../../interfaces/carts.interface';
import CRATE_CHECKOUT_URL from '../../../lib/apollo/mutations/checkout';
import EDIT_CART from '../../../lib/apollo/mutations/editCart';
import { editVariationFromCart } from '../../../store/reducers/carts';
import GET_SHOP from '../../../lib/apollo/queries/getShop';
import { Shop } from '../../../interfaces/shop.interface';
import ModalReausable from '../../../../components/organisms/ModalReausable';
import { Firebase_User } from '../../../interfaces/firebase_user.interface';
import LoginAndRegistrationForm from '../../../../components/organisms/LoginAndRegistrationForm';
import ProfilePhoto from '../../../../components/molecules/ProfilePhoto';
import CheckoutProduct from '../../../../components/molecules/CheckoutProduct';
import { formatNumberWithTwoDecimalsInString } from '../../../../components/utils/formatNumberWithTwoDecimalsInString';
import expirationTimeTokenControll from '../../../../components/utils/expirationTimeTokenControll';
import { CartProductVariation } from '../../../lib/apollo/generated/graphql';
import { fbq, gtag } from '../../../lib/analytics/gtag';
import { GTMEventType, PixelEventType } from '../../../lib/analytics/eventTypes';
import { GtagVariationsToItemsFor } from '../../../../components/utils/GtagVariationsToItemsFor';
import { formatNumberWithTwoDecimalsInNumber } from '../../../../components/utils/formatNumberWithTwoDecimalsInNumber';

const SHIPPING_COST = 499;

const index = () => {
    const cartsDispatch: Cart[] = useSelector((state: any) => state.carts.carts);
    const user: Firebase_User = useSelector((state: any) => state.user.user);

    const [cart, setCart] = useState<Cart>()
    const router = useRouter()
    const [checkoutUrlMutation, { error }] = useMutation(CRATE_CHECKOUT_URL);
    const dispatch = useDispatch();
    const [editCart] = useMutation(EDIT_CART);
    const [isDisabled, setIsDisabled] = useState(false);
    const shopQuery = useQuery(GET_SHOP, {
        variables: {
            id: router.query.shopId
        }
    });
    const [shop, setShop] = useState<Shop>();
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
    const [isOpenLoginModal, setIsOpenLoginModal] = useState(false)
    const [typeLogin, setTypeLogin] = useState<'login' | 'registration' | 'reset_password'>('login')
    const [IsOpenDeleteVariation, setIsOpenDeleteVariation] = useState<CartProductVariation>()
    const isSmallView = useBreakpointValue({ base: true, md: false });



    console.log(cart);

    useEffect(() => {
        const { shopId } = router.query;
        if (!router.isReady || !shopId || user.statusAuthentication === 'not_yet_authenticated' || !cartsDispatch) return
        const cart = cartsDispatch.filter(cart => cart.shopInfo.id === shopId)[0]
        console.log(cartsDispatch);
        let timeoutId: any;
        if (cart) {
            console.log(cart);
            setCart(cart)
        }
        if (!cart) {
            //in futuro mettiamo carrello non trovato e non reindiriziamo a negozi
            timeoutId = setTimeout(() => {
                if (shop) {
                    router.replace(`/negozio/${shop?.id}/${createUrlSchema([shop?.name])}`)
                } else {
                    router.replace(`/negozi`)
                }
            }, 3000); // Timeout di 4 secondi
            setCart(undefined)

        }
        return () => {
            clearTimeout(timeoutId);
        };
    }, [user, cartsDispatch, router.query])


    useEffect(() => {
        if (!shopQuery.data) return
        setShop(shopQuery.data.shop)
    }, [shopQuery])

    useEffect(() => {
        if (!error) return
        setIsErrorModalOpen(true)
    }, [error])


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
                    shopId: cart?.shopInfo.id
                }
            })
            fbq({
                command: PixelEventType.initiateCheckout
            })
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
            console.log(e);
            setIsDisabled(false)
        }
    }

    const handleEditVariation = async (variationSelected: CartProductVariation, quantity: number) => {
        const resolve = await expirationTimeTokenControll(user.expirationTime)
        if (!resolve || !cart) return


        let NewCarts: Cart[] = [];


        //caso in cui la Variation è già presente in cart
        const index = cart.productVariations.findIndex(variation => variation.size === variationSelected.size && variation.id === variationSelected.id)
        console.log(variationSelected);
        console.log(cart);
        console.log(index);


        const newProductVariation = {
            ...cart.productVariations[index],
            quantity: quantity
        }

        const productVariations = cart.productVariations.map(variation => {
            if (variation.size === variationSelected.size && variation.id === variationSelected.id) {
                // Sostituisci l'oggetto corrente con il nuovo oggetto quando le condizioni sono soddisfatte
                return newProductVariation;
            } else {
                // Mantieni l'oggetto corrente senza modifiche
                return variation;
            }
        });



        console.log(productVariations);

        const newTotal = newTotalHandler(productVariations)

        let NewCart: Cart = {
            ...cart,
            total: newTotal,
            productVariations: productVariations
        }



        NewCarts = [
            ...cartsDispatch.filter(cart => cart.shopInfo.id !== router.query.shopId),
            NewCart
        ]




        console.log(NewCarts);

        //aggiungi al carrello

        dispatch(
            editVariationFromCart({
                //add new Carts
                carts: NewCarts
            })
        );

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

            // if (!edited.data?.editCart) return //mettere un errore qui

        } catch (e: any) {
            console.log(e.message);
        }
    }

    const deleteVariation = async (variation: CartProductVariation) => {
        try {
            if (user.uid) {
                await editCart({
                    variables: {
                        productVariationId: variation.id,
                        size: variation.size,
                        quantity: 0
                    }
                })
            }

        } catch {
            //TODO gestire errore in edit card
        }


        let editedCart: Cart | undefined = undefined;


        for await (const cart of cartsDispatch) {
            for await (const element of cart.productVariations) {
                if (element.productId === variation.productId) {
                    const newVariations = cart.productVariations.filter(variationElement => variationElement.id !== variation.id || variationElement.size !== variation.size)
                    console.log(cart.productVariations, newVariations);
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



        if (!editedCart) return router.back()



        let NewCarts: Cart[] = [];

        if (editedCart.total > 0) {
            NewCarts = [
                ...cartsDispatch.filter(cart => cart.shopInfo.id !== editedCart?.shopInfo.id),
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
                ...cartsDispatch.filter(cart => cart.shopInfo.id !== editedCart?.shopInfo.id)]
            dispatch(
                editVariationFromCart({
                    //add new Carts
                    carts: NewCarts
                })
            );
        }
        if (!user.uid) {
            localStorage.setItem('carts', JSON.stringify(NewCarts))
        }
        if (editedCart?.productVariations?.length < 1) return router.back()

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
        router.push('/prodotto/' + variation.productId + '/' + createUrlSchema([variation.brand, variation.name]) + '?colore=' + variation.color)
    }

    const handleDeleteVariations = async () => {
        const errorVariations = error?.graphQLErrors;
        if (!errorVariations) return
        console.log(errorVariations);
        if (!user.uid) {
            return
        }
        try {
            for await (const errorVariation of errorVariations) {
                if (typeof errorVariation.path !== 'string') return
                let id: string = errorVariation.path
                id = id.trim()
                console.log(id);
                if (!cart) return
                const variations = cart.productVariations.filter(element => element.id === id)
                console.log(variations);
                for await (const variation of variations) {
                    await editCart({
                        variables: {
                            productVariationId: variation.id,
                            size: variation.size,
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
            {cart && shop ? (
                <>
                    <NoIndexSeo title='Veplo'></NoIndexSeo>
                    {isSmallView && <Box
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
                                position={'sticky'}
                                onClick={checkoutUrl}
                                type={'button'}
                                borderRadius={'10px'}
                                fontWeight={'black'}
                                padding={5}
                                paddingInline={16}
                                width={'full'}
                                height={'fit-content'}
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
                            >Procedi {
                                    (typeof cart.shopInfo.minimumAmountForFreeShipping !== 'number' || cart.shopInfo.minimumAmountForFreeShipping > cart.total) ?
                                        formatNumberWithTwoDecimalsInString(cart.total + 499) :
                                        formatNumberWithTwoDecimalsInString(cart.total)
                                }€

                            </Button>
                        </Box>

                    </Box>}
                    <Desktop_Layout>

                        <div className='w-full m-auto lg:w-8/12 mt-2'>
                            <Box
                                width={'fit-content'}
                            >
                                <Link
                                    href={'/negozio/' + shop.id + '/' + createUrlSchema([shop.name])}
                                >
                                    <ProfilePhoto
                                        imgName={shop.name}
                                        scr={shop.profilePhoto}
                                        primaryText={shop.name}
                                        secondaryText={shop.name}
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
                                                return (
                                                    <div
                                                        key={variation?.id && variation?.size ? variation?.id + variation?.size : Math.random()}
                                                        className='w-full'
                                                    >
                                                        <CheckoutProduct
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
                                        paddingY={[5, 8]}
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
                                                <Text
                                                    fontSize={'18px'}
                                                    fontWeight={'semibold'}
                                                    color={'secondaryBlack.text'}
                                                >
                                                    {formatNumberWithTwoDecimalsInString(cart.total)}€
                                                </Text>
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
                                                    {(typeof cart.shopInfo.minimumAmountForFreeShipping !== 'number' || cart.shopInfo.minimumAmountForFreeShipping > cart.total) && <Text
                                                        fontSize={'12px'}
                                                        fontWeight={'medium'}
                                                        color={'primary.bg'}
                                                    >
                                                        * gratis dai {cart?.shopInfo?.minimumAmountForFreeShipping && cart?.shopInfo?.minimumAmountForFreeShipping / 100} euro di carrello
                                                    </Text>}
                                                </Box>

                                                <Text
                                                    fontSize={'18px'}
                                                    fontWeight={'semibold'}
                                                    color={'secondaryBlack.text'}
                                                >
                                                    {(typeof cart.shopInfo.minimumAmountForFreeShipping !== 'number' || cart.shopInfo.minimumAmountForFreeShipping > cart.total) ? '4,99€' : 'gratis'}
                                                </Text>
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
                                            <Text
                                                fontSize={'18px'}
                                                fontWeight={'semibold'}
                                                color={'secondaryBlack.text'}
                                            >
                                                {
                                                    (typeof cart.shopInfo.minimumAmountForFreeShipping !== 'number' || cart.shopInfo.minimumAmountForFreeShipping > cart.total) ?
                                                        formatNumberWithTwoDecimalsInString(cart.total + 499) :
                                                        formatNumberWithTwoDecimalsInString(cart.total)
                                                }€
                                            </Text>
                                        </Box>
                                        {!isSmallView && <Button
                                            onClick={checkoutUrl}
                                            type={'button'}
                                            borderRadius={'10px'}
                                            size={'20px'}
                                            fontWeight={'black'}
                                            padding={5}
                                            paddingInline={16}
                                            width={'full'}
                                            height={'fit-content'}
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
                                        >Procedi
                                        </Button>}
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
                                    console.log(id);
                                    console.log(cart.productVariations);
                                    const variations = cart.productVariations.filter(element => element.id === id)
                                    console.log(variations);
                                    return (
                                        <div key={index}>
                                            {
                                                variations.map((variation, index) => {
                                                    return (
                                                        <ListItem
                                                            key={index}
                                                        >
                                                            {variation.name}
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
            ) :
                (
                    <Box
                        minHeight={'100vh'}
                    >
                        <Loading />
                    </Box>
                )
            }
            <ModalReausable
                marginTop={0}
                title='' isOpen={isOpenLoginModal}
                closeModal={() => setIsOpenLoginModal(false)}
            >
                <LoginAndRegistrationForm
                    open='modal'
                    type={typeLogin}
                    person='user'
                    handleChangeTypeOrPerson={(type, person) => {
                        if (person === 'business') return
                        setTypeLogin(type)
                    }}
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