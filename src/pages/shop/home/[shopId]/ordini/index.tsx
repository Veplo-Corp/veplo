import { useLazyQuery } from '@apollo/client';
import { Box, Tag, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import Desktop_Layout from '../../../../../../components/atoms/Desktop_Layout'
import NoIndexSeo from '../../../../../../components/organisms/NoIndexSeo';
import { Firebase_User } from '../../../../../interfaces/firebase_user.interface';
import GET_SHOP_ORDERS from '../../../../../lib/apollo/queries/shopOrders';

interface Props {

}

function index() {
    const router = useRouter()
    const [getOrders, { error, data }] = useLazyQuery(GET_SHOP_ORDERS);
    const user: Firebase_User = useSelector((state: any) => state.user.user);
    console.log(data);

    useEffect(() => {
        const { shopId } = router.query
        if (user?.isBusiness || shopId) {

            getOrders({
                variables: {
                    id: shopId,
                    statuses: null
                }
            })
        }
    }, [user, router])


    return (
        <Desktop_Layout>
            <NoIndexSeo title={`Ordini | Veplo Shop`} />
            {data?.shop &&
                <Box
                    mb={4}
                >
                    <Tag size={'md'} variant='solid'
                        colorScheme={data?.shop?.status === 'active' ? 'green' : 'red'}
                    >
                        {data?.shop?.status === 'active' ? 'attivo' : 'non attivo'}
                    </Tag>
                    <Text
                        mt={-1}
                        fontSize={'2xl'}
                        fontWeight={'extrabold'}
                        fontStyle={'italic'}
                    >{data?.shop?.name}</Text>
                    <Text
                        mt={-1}
                        fontSize={'sm'}
                        fontWeight={'semibold'}
                        color={'gray.500'}
                    >{data?.shop?.address?.city}, {data?.shop?.address?.street}</Text>
                </Box>
            }
            index
        </Desktop_Layout>
    )
}

export default index