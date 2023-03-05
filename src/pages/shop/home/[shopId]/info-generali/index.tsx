import React, { FC, useState } from 'react'
import PropTypes from 'prop-types'
import Desktop_Layout from '../../../../../../components/atoms/Desktop_Layout'
import Div_input_creation from '../../../../../../components/atoms/Div_input_creation'
import { Input, InputGroup } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import GET_SHOP_BY_FIREBASE_ID from '../../../../../lib/apollo/queries/getShopByFirebaseId'
import { useQuery } from '@apollo/client'
import { useSelector } from 'react-redux'
import { Shop } from '../../../../../interfaces/shop.interface'
import Shop_Form from '../../../../../../components/organisms/Shop_Form'
import Customer_Care_Contacts from '../../../../../../components/organisms/Customer_Care_Contacts'
import PostMeta from '../../../../../../components/organisms/PostMeta'
import NoIndexSeo from '../../../../../../components/organisms/NoIndexSeo'
import BlackButton from '../../../../../../components/atoms/BlackButton'
import Modal_Help_Customer_Care from '../../../../../../components/organisms/Modal_Help_Customer_Care'


const index: FC<{}> = () => {
  const user = useSelector((state: any) => state.user.user);
  const [isOpen, setIsOpen] = useState(false)

  const Shop: any = useQuery(GET_SHOP_BY_FIREBASE_ID, {
    variables: { firebaseId: user?.uid },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-first',
  }).data?.shopByFirebaseId;

  console.log(Shop);




  return (
    <Desktop_Layout>
      <NoIndexSeo title={`Il tuo Negozio | Veplo Shop`} />
      {Shop &&
        <form className="w-full flex" onSubmit={() => { }}>
          <div className='p-3 w-full sm:w-7/12 lg:w-5/12 m-auto'>
            <Shop_Form shop={Shop} />
            <div className='mt-5 text-end'>
              <BlackButton
                element={'Vuoi modificare qualcosa?'}
                onClick={() => setIsOpen(true)}
                borderRadius={5}
                width={200}
                heigth={12}
                size={'sm'}
                typeButton={'button'}
                disabled={false}
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