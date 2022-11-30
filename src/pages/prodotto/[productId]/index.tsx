import React, { useEffect } from 'react'
import { Product } from '../../../interfaces/product.interface';
import { initApollo } from '../../../lib/apollo';
import GET_SINGLE_PRODUCT from '../../../lib/apollo/queries/getSingleProduct';
import createUrlScheme from '../../../../components/utils/create_url'
import { useRouter } from 'next/router';


export async function getServerSideProps(ctx:any) {

    const apolloClient = initApollo()
    

    const { productId } = ctx.params


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
    const category = 
        product.macroCategory.toLocaleLowerCase().includes(product.microCategory.toLocaleLowerCase()) 
        ? product.microCategory
        : product.macroCategory + '-' + product.microCategory
    const newUrl = createUrlScheme([product.brand, product.name, category])    
    const navigate = (url:string) => {}
    useEffect(() => {
        if(newUrl){  
            router.push(`/prodotto/${router.query.productId}/${newUrl}`)
        }
    }, [product])
    

    return (
        <>
        </>
    )
}



export default index