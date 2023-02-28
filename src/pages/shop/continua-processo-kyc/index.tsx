import React from 'react'
import BlackButton from '../../../../components/atoms/BlackButton'
import BoxExplenationStripe from '../../../../components/atoms/BoxExplenationStripe'
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout'

const index = () => {

    const stripeId = 'acct_1MgFTuECL5DJ3pkk'

    return (
        <Desktop_Layout>
            <form action={`/api/stripe/resume-kyc-process?stripeId=${stripeId}`}
                className='m-auto w-11/12 md:w-8/12 lg:w-6/12 xl:w-1/3'
                method="POST">
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

            </form>
        </Desktop_Layout>
    )
}

export default index