import { useLazyQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Desktop_Layout from '../../../../../../../components/atoms/Desktop_Layout';
import EditProductInputForm from '../../../../../../../components/molecules/EditProductInputForm';
import NoIndexSeo from '../../../../../../../components/organisms/NoIndexSeo';
import { Business } from '../../../../../../interfaces/business.interface';
import { Firebase_User } from '../../../../../../interfaces/firebase_user.interface';
import { Product } from '../../../../../../interfaces/product.interface';
import GET_BUSINESS from '../../../../../../lib/apollo/queries/business';
import GET_PRODUCTS_FROM_SHOP from '../../../../../../lib/apollo/queries/geetProductsShop';

interface Props {
    shop: {
        id: string
        products: Product[],
    }
}

export interface IFormInputProductEdit {
    name: string;
    price: {
        v1: number | string,
        discountPercentage: number,
        v2?: number | string
    }
    brand: string;
    macrocategory: string;
    microcategory: string;
    vestibilità: string
}

const index = () => {
    const user: Firebase_User = useSelector((state: any) => state.user.user);
    //const [getBusiness, { error, data }] = useLazyQuery<Props>(GET_BUSINESS);
    const router = useRouter();
    const [getShop, { error, data }] = useLazyQuery<Props>(GET_PRODUCTS_FROM_SHOP);
    const [product, setProduct] = useState<Product>();
    const [defaultValue, setdefaultValue] = useState<IFormInputProductEdit>();

    useEffect(() => {
        const { shopId, productId } = router.query;

        if (!user?.isBusiness || !shopId || typeof shopId !== 'string' || !user?.accountId) return
        getShop({
            variables: { id: shopId, limit: 100, offset: 0, see: "everything" },
            fetchPolicy: 'cache-first',
            // nextFetchPolicy: 'cache-first',
        }).then((shop) => {
            const product = shop.data?.shop.products.find(product => product.id === productId)
            setProduct(product)
            console.log(product);
            if (!product) return
            setdefaultValue({
                name: product?.name,
                price: {
                    v1: 100,
                    discountPercentage: 0
                },
                brand: "Lacoste",
                macrocategory: "vestiti",
                microcategory: "casual",
                vestibilità: "skinny"
            })
        })
        return () => {
        }
    }, [user])





    return (
        <Desktop_Layout>
            <NoIndexSeo title='Modifica prodotto | Veplo' />
            <div className='w-full md:w-8/12 lg:w-1/2 xl:w-5/12  m-auto'>
                <h1 className='italic text-xl lg:text-3xl font-extrabold mb-6'>
                    Aggiungi prodotto
                </h1>
            </div>
            {defaultValue && product?.variations && <EditProductInputForm variations={product?.variations} defaultValues={defaultValue} />}


        </Desktop_Layout>
    )
}

export default index