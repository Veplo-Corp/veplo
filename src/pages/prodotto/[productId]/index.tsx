import React, { useEffect } from 'react'
import { Product } from '../../../interfaces/product.interface';
import { initApollo } from '../../../lib/apollo';
import GET_SINGLE_PRODUCT from '../../../lib/apollo/queries/getSingleProduct';
import createUrlScheme from '../../../../components/utils/create_url'
import { useRouter } from 'next/router';


export async function getServerSideProps(ctx) {

    const apolloClient = initApollo()


    const { productId } = ctx.params
    console.log(productId);


    const{ data, error }: {data:any, error:any} = await apolloClient.query({
        query: GET_SINGLE_PRODUCT,
        variables: { id: productId }
    })

    const product: Product = data.product
    

    return {
      props: {product}, // will be passed to the page component as props
    }

}

const index: React.FC<{ product: Product, error: string }> = ({product}) => {
    const router = useRouter()
    console.log(product);
    const newUrl = createUrlScheme([product.brand, product.name, product.microCategory])
    console.log(newUrl);
    
    const navigate = (url) => {}
    useEffect(() => {
        if(newUrl){  
            router.push(`/prodotto/${product.id}/${newUrl}`)
        }
    }, [product])
    

    


    return (
        <>
        </>
    )
}



export default index