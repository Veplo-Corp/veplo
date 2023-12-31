import { Box, Button, Center, Divider, Tag, Text, VStack, useBreakpointValue } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useDispatch, useSelector } from 'react-redux';
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout';
import Loading from '../../../../components/molecules/Loading';
import ProductVariationInOrder from '../../../../components/molecules/ProductVariationInOrder';
import { OrderStatus, STATUS } from '../../../../components/mook/statusOrderUser';
import PriceAndShippingListingCost from '../../../../components/organisms/PriceAndShippingListingCost';
import createUrlSchema from '../../../../components/utils/create_url';
import { imageKitUrl } from '../../../../components/utils/imageKitUrl';
import toUpperCaseFirstLetter from '../../../../components/utils/uppercase_First_Letter';
import { DateFormat, getDateFromMongoDBDate } from '../../../../components/utils/getDateFromMongoDBDate';
import ModalReausable from '../../../../components/organisms/ModalReausable';
import FormReturn from '../../../../components/molecules/FormReturn';
import { ToastOpen } from '../../../../components/utils/Toast';
import { useMutation, useQuery } from '@apollo/client';
import RETURN_ORDER from '../../../lib/apollo/mutations/returnOrder';
import { setOrders } from '../../../store/reducers/orders';
import GrayBox from '../../../../components/atoms/GrayBox';
import Modal_Help_Customer_Care from '../../../../components/organisms/Modal_Help_Customer_Care';
import GET_ORDER from '../../../lib/apollo/queries/getOrder';
import { Order } from '../../../lib/apollo/generated/graphql';
import { Firebase_User } from '../../../interfaces/firebase_user.interface';
import ProfilePhoto from '../../../../components/molecules/ProfilePhoto';
import { formatNumberWithTwoDecimalsInString } from '../../../../components/utils/formatNumberWithTwoDecimalsInString';
import OrderComponent from '../../../../components/molecules/OrderComponent';
import { GTMEventType } from '../../../lib/analytics/eventTypes';
import { gtag } from '../../../lib/analytics/gtag';
import expirationTimeTokenControll from '../../../../components/utils/expirationTimeTokenControll';
import { openModal } from '../../../store/reducers/globalModal';
import PostMeta from '../../../../components/organisms/PostMeta';
import NoIndexSeo from '../../../../components/organisms/NoIndexSeo';





const index = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const orders: Order[] = useSelector((state: any) => state.orders.orders);
    const { data } = useQuery<{ order: Order }>(GET_ORDER, {
        variables: {
            id: router.query.orderId
        }
    })

    const user: Firebase_User = useSelector((state: any) => state.user.user);

    const [order, setOrder] = useState<Order>();
    const [orderStatus, setOrderStatus] = useState<OrderStatus>();
    const [isOpenModalReturn, setIsOpenModalReturn] = useState(false)
    const { addToast } = ToastOpen();
    const [isModalHelpOpen, setIsModalHelpOpen] = useState(false)
    const [returnOrder] = useMutation(RETURN_ORDER, {
        update(cache, el, query) {

            const OrderCacheId = cache.identify({ id: query.variables?.returnOrderId, __typename: 'Order' })
            cache.modify({
                id: OrderCacheId, //productId
                fields: {
                    status(/* cachedvalue */) {
                        return "RET01"
                    },
                },
                broadcast: false // Include this to prevent automatic query refresh
            });
        }
    })
    const isSmallView = useBreakpointValue({ base: true, md: false });


    useEffect(() => {
        const { orderId } = router.query
        if (!data) return
        setOrder(data?.order)
        handleStatus(data?.order?.status)
    }, [data])



    const handleStatus = (orderStatus: string | undefined | null) => {
        if (!orderStatus) return
        const status = STATUS.find(status => status.code === orderStatus);
        if (!status) return
        setOrderStatus({
            text: status.text,
            color: status.color,
            background: status.background
        })
    }

    const handleSubmitButton = async (form: {
        orderCode: string,
        phone: string,
        email: string,
    }) => {
        //effettuare richiesta reso qui
        //mettere in RET01
        //creare collection per richiesta reso
        const resolve = await expirationTimeTokenControll(user.expirationTime)
        if (!resolve) return
        try {
            await returnOrder({
                variables: {
                    returnOrderId: order?.id
                }
            })
            setIsOpenModalReturn(false)
            setOrder(prevState => {
                if (!prevState) return
                return {
                    ...prevState,
                    status: "RET01"
                }
            })
            handleStatus("RET01")
            if (!user.uid) return
            //cambia l'order status in Redux
            const newOrders = orders.map(order => {
                if (order?.code === form.orderCode) {
                    return { ...order, ["status"]: "RET01" }
                }
                return order
            })
            dispatch(
                setOrders(newOrders)
            )
        } catch {
            //aggiungere errore chiamat
            // se superati più di 15 giorni
            dispatch(openModal({
                title: 'Errore',
                description: "Non siamo riusciti a procedere con la richiesta di reso. Contatta l'assistenza se il problema persiste",
            }))
        }


    }

    const canUserRequestReturnOrder = (): boolean => {
        if (!order) return false
        const historyDelivery = order?.history?.find(history => history?.status === "SHIP03")
        if (typeof historyDelivery?.date !== 'string') return false
        const inputDate = new Date(historyDelivery.date);
        const currentDate = new Date();
        const differenceInMilliseconds = currentDate.getTime() - inputDate.getTime();
        const millisecondsIn15Days = 15 * 24 * 60 * 60 * 1000; // 15 giorni in millisecondi
        return differenceInMilliseconds < millisecondsIn15Days;

    }


    return (
        <Desktop_Layout>
            <NoIndexSeo />

            <PostMeta
                canonicalUrl={'https://www.veplo.it' + router.asPath}
                title={"Ordine | Veplo"}
                subtitle={"Veplo è lo spazio dove trovare i migliori brand emergenti italiani di abbigliamento. Con Veplo sostieni la vera moda."}
                image={""}
                description={"Veplo è lo spazio dove trovare i migliori brand emergenti italiani di abbigliamento. Con Veplo sostieni la vera moda."}
            />
            <div
                className='w-[95%] sm:w-11/12 md:w-11/12 lg:w-9/12 xl:w-7/12 2xl:w-6/12 m-auto mt-4 md:mt-8 mb-12 min-h-screen '
            >
                {order ? (
                    <>
                        {order?.status === 'RET01' &&
                            <div className='my-4'>
                                <GrayBox>
                                    <Text
                                        fontSize={'2xl'}
                                        fontWeight={'semibold'}
                                        mb={2}
                                    >
                                        Come inviare il reso?
                                    </Text>
                                    <Text
                                        fontSize={'md'}
                                        fontWeight={'normal'}
                                        mb={0}
                                    >
                                        1. Inscatola i prodotti nelle condizioni originali e nello stesso imballaggio in cui è stato inviato.

                                    </Text>
                                    <Text
                                        fontSize={'md'}
                                        fontWeight={'normal'}
                                        mb={0}
                                    >
                                        2. Compila la <Link
                                            className='underline'
                                            target="_blank" href="https://www.datocms-assets.com/102220/1686655555-modulo-reso.pdf"
                                        >nota reso</Link> e inseriscila nel pacco
                                    </Text>
                                    <Text
                                        fontSize={'md'}
                                        fontWeight={'normal'}
                                        mb={0}
                                    >
                                        3. Inserisci l'indirizzo di spedizione: <strong>{order?.shop?.address?.postcode} {order?.shop?.address?.city}, {order?.shop?.address?.street}</strong>
                                    </Text>
                                    <Text
                                        fontSize={'md'}
                                        fontWeight={'normal'}
                                        mb={0}
                                    >
                                        4. Invia il reso a: <strong>{order?.shop?.businessName}, {order?.shop?.name?.visualized}</strong>
                                    </Text>

                                    <Text
                                        fontSize={'sm'}
                                        fontWeight={'normal'}
                                        mt={4}
                                    >
                                        Per qualunque dubbio domanda consulta la <Link
                                            target="_blank"
                                            href={'/informative/reso-e-rimborsi'}
                                            className='underline cursor-pointer'
                                        >politica di reso</Link> o <span
                                            className='underline cursor-pointer'
                                            onClick={() => setIsModalHelpOpen(true)}
                                        >contattaci</span>
                                    </Text>

                                </GrayBox>
                            </div>
                        }
                        <Box
                            display={'flex'}
                            justifyContent={'space-between'}
                            mb={3}
                        >
                            <Link
                                href={`/@${order.shop?.name?.unique}`}
                            >
                                <ProfilePhoto
                                    imgName={order?.shop?.name?.visualized}
                                    scr={order?.shop?.photo}
                                    primaryText={order?.shop?.name?.visualized}
                                    secondaryText={'#' + order.code}
                                />
                            </Link>


                            <Text
                                my={'auto'}
                                fontWeight={['semibold', 'medium']}
                                fontSize={['13px', '15px']}

                                color={'#909090'}
                            >
                                {getDateFromMongoDBDate(order.createdAt, DateFormat.onlyDate)}
                            </Text>
                        </Box>
                        <OrderComponent
                            order={order}
                            orderStatus={orderStatus}
                        />
                        {
                            order?.status === 'SHIP03' && canUserRequestReturnOrder() && user.uid === order?.user?.firebaseId &&
                            <Box
                                display={'flex'}
                                gap={2}
                                mt={5}
                            >
                                <Text
                                    my={'auto'}
                                    fontSize={'md'}
                                    fontWeight={'medium'}

                                >
                                    Vuoi effettuare il reso?
                                </Text>
                                <Button
                                    my={'auto'}
                                    onClick={() => { setIsOpenModalReturn(true) }}
                                    borderRadius={'md'}
                                    size={'md'}

                                    variant='link'
                                    type={'submit'}
                                    colorScheme='black'
                                >Invia richiesta</Button>
                            </Box>
                        }


                    </>
                ) :
                    (
                        <Box className='h-[60vh] md:h-[50vh] lg:h-[70vh] xl:h-[75vh]'
                            display={'flex'}
                            justifyContent={'center'}>
                            <Loading />
                        </Box>
                    )
                }
            </div>

            {
                user.uid === order?.user?.firebaseId &&
                order?.code
                &&
                order?.user?.email &&
                order?.recipient?.phone &&
                <ModalReausable title='' closeModal={() => setIsOpenModalReturn(false)} isOpen={isOpenModalReturn}>

                    < FormReturn
                        handleSubmitButton={handleSubmitButton}

                        email={order?.user?.email} orderCode={order?.code} phone={order?.recipient?.phone} />
                </ModalReausable>
            }
            <Modal_Help_Customer_Care
                isOpen={isModalHelpOpen}
                onClose={() => setIsModalHelpOpen(false)}
            />
        </Desktop_Layout>

    )
}

export default index