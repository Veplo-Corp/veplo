import React, { FC, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Desktop_Layout from '../../../../../../components/atoms/Desktop_Layout'
import Div_input_creation from '../../../../../../components/atoms/Div_input_creation'
import { Input, InputGroup } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useLazyQuery, useQuery } from '@apollo/client'
import { useSelector } from 'react-redux'
import { Shop } from '../../../../../interfaces/shop.interface'
import Shop_Form from '../../../../../../components/organisms/Shop_Form'
import Customer_Care_Contacts from '../../../../../../components/organisms/Customer_Care_Contacts'
import PostMeta from '../../../../../../components/organisms/PostMeta'
import NoIndexSeo from '../../../../../../components/organisms/NoIndexSeo'
import BlackButton from '../../../../../../components/atoms/BlackButton'
import Modal_Help_Customer_Care from '../../../../../../components/organisms/Modal_Help_Customer_Care'
import { useRouter } from 'next/router'
import GET_BUSINESS from '../../../../../lib/apollo/queries/business'
import { Business } from '../../../../../interfaces/business.interface'


const index: FC<{}> = () => {
  const user = useSelector((state: any) => state.user.user);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter()

  const [getBusiness, { error, data }] = useLazyQuery(GET_BUSINESS);
  const [shop, setShop] = useState<any>()

  useEffect(() => {
    const { shopId } = router.query

    if (!user?.isBusiness || !shopId) return

    getBusiness({
      variables: {
        id: user.accountId
      }
    }).then((value) => {
      const business: Business = value.data?.business;
      const shop = business?.shops?.find(shop => shop.id === shopId);
      setShop(shop)
    })


  }, [user, router])




  return (
    <Desktop_Layout>
      <NoIndexSeo title={`Il tuo Negozio | Veplo Shop`} />
      {shop &&
        <form className="w-full flex" onSubmit={() => { }}>
          <div className='p-3 w-full sm:w-7/12 lg:w-5/12 m-auto'>
            <Shop_Form shop={shop} />
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