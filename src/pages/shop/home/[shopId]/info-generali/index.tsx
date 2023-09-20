import React, { FC, useEffect, useState } from 'react'
import Desktop_Layout from '../../../../../../components/atoms/Desktop_Layout'

import { useLazyQuery, useQuery } from '@apollo/client'
import { useSelector } from 'react-redux'
import Shop_Form from '../../../../../../components/organisms/Shop_Form'

import NoIndexSeo from '../../../../../../components/organisms/NoIndexSeo'
import { useRouter } from 'next/router'
import GET_BUSINESS from '../../../../../lib/apollo/queries/business'
import { Business } from '../../../../../interfaces/business.interface'


const index: FC<{}> = () => {
  const user = useSelector((state: any) => state.user.user);
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
          <div className='p-3 w-full sm:w-10/12 md:w-10/12 lg:w-5/12 m-auto'>
            <Shop_Form shop={shop} />

          </div>
        </form>
      }
      {/* <Customer_Care_Contacts /> */}
    </Desktop_Layout>
  )
}


export default index