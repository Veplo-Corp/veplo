import { useLazyQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import BlackButton from '../../../../../components/atoms/BlackButton'
import Desktop_Layout from '../../../../../components/atoms/Desktop_Layout'
import Business_Form from '../../../../../components/organisms/Business_Form'
import Modal_Help_Customer_Care from '../../../../../components/organisms/Modal_Help_Customer_Care'
import NoIndexSeo from '../../../../../components/organisms/NoIndexSeo'
import { Business } from '../../../../interfaces/business.interface'
import { Firebase_User } from '../../../../interfaces/firebase_user.interface'
import GET_BUSINESS from '../../../../lib/apollo/queries/business'


interface Props {
    business: Business
}

const index = () => {


    const user: Firebase_User = useSelector((state: any) => state.user.user);

    const [isOpen, setIsOpen] = useState(false)
    const [getBusiness, { error, data }] = useLazyQuery<Props>(GET_BUSINESS);



    useEffect(() => {
        if (!user?.accountId) return

        getBusiness({
            variables: {
                id: user.accountId
            }
        })

        return () => {

        }
    }, [user])


    return (
        <Desktop_Layout>
            <NoIndexSeo title={`Il tuo Negozio | Veplo Shop`} />
            {data?.business &&
                <form className="w-full flex" onSubmit={() => { }}>
                    <div className='p-3 w-full sm:w-7/12 lg:w-5/12 m-auto'>
                        <Business_Form business={data.business} />
                        <div className='mt-5 text-end'>
                            <BlackButton
                                element={'Vuoi modificare qualcosa?'}
                                onClick={() => setIsOpen(true)}
                                borderRadius={5}
                                width={200}
                                heigth={12}
                                size={'sm'}
                                typeButton={'button'}
                                isDisabled={false}
                            />
                        </div>

                    </div>
                </form>

            }
            {/* <Customer_Care_Contacts /> */}
            <Modal_Help_Customer_Care isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </Desktop_Layout>
    )
}

export default index