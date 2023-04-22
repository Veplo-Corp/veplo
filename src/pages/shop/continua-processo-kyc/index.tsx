import React from 'react'
import BlackButton from '../../../../components/atoms/BlackButton'
import BoxExplenationStripe from '../../../../components/atoms/BoxExplenationStripe'
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout'
import { useRouter } from 'next/router';
import { Firebase_User } from '../../../interfaces/firebase_user.interface';
import { useSelector } from 'react-redux';

import { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import GET_BUSINESS from '../../../lib/apollo/queries/business';

const index = () => {


    const user: Firebase_User = useSelector((state: any) => state.user.user);
    const router = useRouter();


    const [getBusiness, { error, data }] = useLazyQuery(GET_BUSINESS);



    useEffect(() => {
        console.log(user);

        const abortController = new AbortController();
        if (user && user.statusAuthentication === 'not_yet_authenticated') return
        if (!user || !user.isBusiness) {
            router.push('/shop/login?type=login')
            return
        }
        getBusiness({
            variables: {
                id: user.accountId
            }
        })
        return () => {
            abortController.abort();
        };
    }, [user])


    return (
        <Desktop_Layout>
            {user?.isBusiness &&
                <form action={`/api/stripe/resume-kyc-process?stripeId=${data?.business.stripe.id}`}
                    className='m-auto w-11/12 md:w-7/12 lg:w-6/12 xl:w-1/3'
                    method="POST"
                >
                    <h1 className="mt-20 font-black text-2xl md:text-3xl italic text-black-900 mb-4 max-w-xs md:max-w-md">Processo interrotto</h1>
                    <BoxExplenationStripe textBold='Continua il processo' />
                    {/* <section>
                    <button type="submit" role="link">

                    </button>
                </section> */}
                    <BlackButton
                        disabled={false}
                        typeButton='submit'
                        element='Continua il processo'
                        borderRadius={10}
                        size={'lg'}
                        width={'full'}
                        heigth={14}
                    ></BlackButton>

                </form>}
        </Desktop_Layout>
    )
}

export default index