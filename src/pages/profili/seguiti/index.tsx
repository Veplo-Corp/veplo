import React, { useEffect } from 'react'
import { Firebase_User } from '../../../interfaces/firebase_user.interface';
import { useSelector } from 'react-redux';
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout';
import { Box } from '@chakra-ui/react';
import { useLazyQuery } from '@apollo/client';
import GET_USER_FOLLOWINGS from '../../../lib/apollo/queries/getUserFollowings';
import Loading from '../../../../components/molecules/Loading';
import PostMeta from '../../../../components/organisms/PostMeta';
import NoIndexSeo from '../../../../components/organisms/NoIndexSeo';
import { LIST_ITEM_VARIANT } from '../../../../components/mook/transition';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Box_Shop from '../../../../components/molecules/Box_Shop';
import { ShopsQuery } from '../../../lib/apollo/generated/graphql';
import PageNotFound from '../../../../components/molecules/PageNotFound';

const index = () => {
    const user: Firebase_User = useSelector((state: any) => state.user.user);
    const [getUser, { data, loading, error }] = useLazyQuery(GET_USER_FOLLOWINGS);
    useEffect(() => {
        if (user.statusAuthentication === 'logged_in') {
            getUser({
                variables: {
                    limit: 10,
                    offset: 0,
                    onlyIds: false
                }
            })
        }
    }, [user])



    return (
        <>
            <NoIndexSeo />
            <PostMeta
                canonicalUrl={'https://www.veplo.it/profili/seguiti'}
                title={'Seguiti su Veplo'}
                subtitle={"Veplo è lo spazio dove trovare i migliori brand di abbigliamento e accessori made in Italy. Con Veplo sostieni la moda responsabile."}
                image={""}
                description={"Veplo è lo spazio dove trovare i migliori brand di abbigliamento e accessori made in Italy. Con Veplo sostieni la moda responsabile."}
            />

            <Box
                px={[2, 2, 2, 6, 0]}
                className='mt-2 md:mt-5 min-h-[100vh]  w-full xl:w-10/12 2xl:w-9/12 xl:m-auto justify-items-center'
            >
                {loading &&
                    <Box
                        mt={'30vh'}
                    >
                        <Loading />
                    </Box>
                }
                {data?.user?.following && data?.user?.following?.length > 0 &&
                    <Box className="grid md:pt-1 sm:grid-cols-1 md:grid-cols-2 sm:gap-10 md:gap-5 lg:gap-20 md:mt-4 mb-32"
                    >

                        {data?.user?.following.map(element => {
                            if (!element || !element.shop) {
                                return (<></>)
                            }
                            return (
                                <motion.div
                                    key={element.shopId}
                                    variants={LIST_ITEM_VARIANT}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                >
                                    <Link
                                        prefetch={false} href={`/@${element.shop?.name?.unique}`}>
                                        <Box_Shop scale={'scale(0.99)'} eventHandler={() => { }} shop={element.shop} />
                                    </Link>
                                </motion.div>
                            )
                        })
                        }
                    </Box>
                }
                {error && !loading && !data?.user?.following?.length &&
                    <PageNotFound
                        title='Nessun profilo seguito'
                        description='non segui ancora nessun profilo'
                    />
                }


            </Box>
        </>

    )
}

export default index