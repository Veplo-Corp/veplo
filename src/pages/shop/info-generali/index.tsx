import React, { FC } from 'react'
import PropTypes from 'prop-types'
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout'
import Div_input_creation from '../../../../components/atoms/Div_input_creation'
import { Input, InputGroup } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import GET_SHOP_BY_FIREBASE_ID from '../../../lib/apollo/queries/getShopByFirebaseId'
import { useQuery } from '@apollo/client'
import { useSelector } from 'react-redux'
import { Shop } from '../../../interfaces/shop.interface'
import Shop_Form from '../../../../components/organisms/Shop_Form'
import Customer_Care_Contacts from '../../../../components/organisms/Customer_Care_Contacts'
import PostMeta from '../../../../components/organisms/PostMeta'
import NoIndexSeo from '../../../../components/organisms/NoIndexSeo'


const index: FC<{}> = () => {
  const user = useSelector((state: any) => state.user.user);


  const Shop: any = useQuery(GET_SHOP_BY_FIREBASE_ID, {
    variables: { firebaseId: user?.uid },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-first',
  }).data?.shopByFirebaseId;

  console.log(Shop);




  return (
    <Desktop_Layout>
      <NoIndexSeo title={`Il tuo Negozio | Veplo Shop`} />
        {Shop && <Shop_Form shop={Shop} />}
        {/* <Customer_Care_Contacts /> */}
    </Desktop_Layout>
  )
}


export default index