import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import Desktop_Layout from '../../../../../../components/atoms/Desktop_Layout';
import { Color, COLORS } from '../../../../../../components/mook/colors';
import Product_Form from '../../../../../../components/organisms/Product_Form';
import { ToastOpen } from '../../../../../../components/utils/Toast';
import { Product } from '../../../../../interfaces/product.interface';
import { initApollo } from '../../../../../lib/apollo';
import GET_PRODUCTS_FROM_SHOP from '../../../../../lib/apollo/queries/geetProductsShop';

const index = () => {
    const { addToast } = ToastOpen();

    const router = useRouter();
    const apolloClient = initApollo();
    const [product, setProduct] = useState<Product>(undefined)

    const { productId } = router.query

    const { loading, error, data, refetch } = useQuery(GET_PRODUCTS_FROM_SHOP, {
        fetchPolicy: 'cache-only',
        nextFetchPolicy: 'cache-first',
        variables: { id: '6373bb3c0742ade8758b1a97' },
        // pollInterval: 500,
        // notifyOnNetworkStatusChange: true,
    });


    const onClick = () => {

    }

    useEffect(() => {
        if (!data) {
            //router.push('/shop/prodotti/')
            return
        }
        const product = data.shop.products.filter((product: Product) => product.id === productId)[0]
        
        setProduct(product)


    }, [data])



    const submitData = async (values /* { name, price, brand, colors, macrocategory, microcategory, sizes, photos, gender }: IFormInput */) => {

        // console.log(name, price, brand, colors, macrocategory, microcategory, sizes, photos);
        console.log(values);
        
    
    
        // if (!brand || !colors || !macrocategory || !microcategory || !sizes || !photos[2] || !gender) {
        //   return setOpenModalMath(Math.random())
        // }
        
    
    
    
      }


    return (
        <Desktop_Layout>
            {product && <Product_Form handleSubmitEvent={submitData} defaultValues={{
                name: product.name,
                price: product.price,
                brand: product.brand,
                colors: product.colors,
                macrocategory: product.macroCategory,
                microcategory: product.microCategory,
                sizes: product.sizes,
                photos: product.photos
            }} type={'edit'}  disabled={true}/>}
        </Desktop_Layout>
    )
}

export default index