import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Desktop_Layout from '../../../../../../components/atoms/Desktop_Layout';
import { Product } from '../../../../../interfaces/product.interface';
import { initApollo } from '../../../../../lib/apollo';
import GET_PRODUCTS_FROM_SHOP from '../../../../../lib/apollo/queries/geetProductsShop';

const index = () => {
    const router = useRouter();
    const apolloClient = initApollo();
    const [product, setProduct] = useState<Product>({})

    const { productId } = router.query

    const { loading, error, data, refetch } = useQuery(GET_PRODUCTS_FROM_SHOP, {
        fetchPolicy: 'cache-only',
        nextFetchPolicy: 'cache-first',
        variables: { id: '6373bb3c0742ade8758b1a97' },
        // pollInterval: 500,
        // notifyOnNetworkStatusChange: true,
    });

    console.log(data);

    const onClick = () => {
        
    }

    useEffect(() => {
        if(!data){
            router.push('/shop/prodotti/')
            return
        }
        const product = data.shop.products.filter((product: Product) => product.id === productId)[0]
        setProduct(product)
    }, [data])
    


    return (
        <Desktop_Layout>
            <button onClick={onClick}>{product.name}</button>
        </Desktop_Layout>
    )
}

export default index