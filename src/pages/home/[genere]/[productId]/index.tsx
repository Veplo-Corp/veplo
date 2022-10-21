import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Desktop_Layout from '../../../../../components/atoms/Desktop_Layout';
import { Box, Image } from '@chakra-ui/react';
import GET_SINGLE_PRODUCT from '../../../../lib/apollo/queries/getSingleProduct'
import { useQuery } from '@apollo/client';
import { Product } from '../../../../interfaces/product.interface';
import { initApollo } from '../../../../lib/apollo';
import Circle_Color from '../../../../../components/atoms/Circle_Color';
import Size_Box from '../../../../../components/atoms/Size_Box';


export async function getStaticPaths() {
    return {
        paths: [],
        fallback: 'blocking', // can also be true or false
    }
}

export async function getStaticProps(ctx) {
    // Call an external API endpoint to get posts.
    // You can use any data fetching library
    const apolloClient = initApollo()


    const { productId } = ctx.params
    console.log(productId);


    const { data, error } = await apolloClient.query({
        query: GET_SINGLE_PRODUCT,
        variables: { id: productId }
    })

    return {
        props: {
            product: data.product || null,
            error: error || null
            // initialApolloState: apolloClient.cache.extract(),
        }
    }


    // By returning { props: { posts } }, the Blog component
    // will receive `posts` as a prop at build time
    return {
        props: {
            // data,
            // error,
            // loading
        },
    }
}


// const { loading, data, error } = useQuery(GET_SINGLE_PRODUCT, {
//     fetchPolicy: 'no-cache',
//     variables: {
//         id: '635030f4692a668cf323436f',
//     },
// })



const index: React.FC<{ product: Product, error: string }> = ({ product, error }) => {
    //!handle error case
    console.log(product);

    //const router = useRouter();
    //const query = router.query;
    //decodeURI
    //console.log(decodeURIComponent(query.nome));



    const dress = {
        name: 'LOGO LONG SLEEVE TEE - Maglietta a manica lunga',
        company: 'Sartoria Rizzo Merlini',
        brand: 'Tommy Hilfiger',
        formattedPrice: '24,99€',
        imageUrl: ['https://img01.ztat.net/article/spp-media-p1/0a53a253d16a366cb8752f4ef4c76f37/24afae32e49b473db7b2502bef83e4ea.jpg?imwidth=1800', 'https://img01.ztat.net/article/spp-media-p1/92ec5b9defd53c6095411644ba6df0a3/b55be231798048b1a53c715a5285e32f.jpg?imwidth=1800', 'https://img01.ztat.net/article/spp-media-p1/d975829dee9936ac91401531ffc18747/bb1c440521394dc088318d777a8c4280.jpg?imwidth=1800&filter=packshot'],
        imageAlt: 'Rear view of modern dress',
        color: ['blackAlpha.900', 'gray.300', 'red.700', 'white'],
        id: 'ABC1234'
    }

    const [fullImage, setfullImage] = useState(dress.imageUrl[0])


    const zoomImage = () => {
    }

    const changeImageFull = (url) => {
        setfullImage(url)
    }




    return (
        <Desktop_Layout>

            <div className='flex justify-between w-full'>
                <div className='flex space-x-4 w-full md:w-7/12 xl:w-1/2 '>
                    <Box onClick={zoomImage} key={Math.random()} minW='20' maxW='450' mb={'5'} borderRadius='lg' overflow='hidden' className='cursor-pointer'>
                        <Image src={fullImage} alt={dress.imageAlt} />
                    </Box>
                    <div>
                        {dress.imageUrl.map((image) => {
                            return (
                                <Box onClick={() => changeImageFull(image)} key={Math.random()} mb={'5'} borderRadius='lg' overflow='hidden'
                                    borderWidth={1.5}
                                    className={` ${image == fullImage ? "border-black" : "border-white"} cursor-pointer
                                    w-20
                                    xl:w-32
                                    `}
                                >
                                    <Image src={image} alt={dress.imageAlt} />
                                </Box>
                            )
                        })}

                    </div>
                </div>
                <Box className='hidden md:block md:w-5/12 xl:w-1/2 pl-4 lg:pl-0 xl:pr-10'>
                    <Box
                        fontWeight='normal'
                        as='h2'
                        lineHeight='tall'
                        noOfLines={1}
                        fontSize='small'
                    >
                        {/* codice schiantato */}
                        {product.macroCategory}
                        {product.gender === 'F' && <span className='ml-1'>per donna</span>}
                        {product.gender === 'M' && <span className='ml-1'>per uomo</span>}
                    </Box>
                    <Box
                        fontWeight='normal'
                        as='h2'
                        noOfLines={1}
                        mt='-2'
                        fontSize='3xl'
                        className='italic'
                    >
                        {product.brand}
                    </Box>
                    <Box
                        fontWeight='medium'
                        as='h1'
                        noOfLines={2}
                        lineHeight={'30px'}
                        mt='0'
                        fontSize='3xl'
                    >
                        {product.name}
                    </Box>
                    <Box
                        fontWeight='medium'
                        as='h1'
                        noOfLines={1}
                        mt='2'
                        fontSize='sm'
                    >
                        {product.price.toFixed(2)}€
                    </Box>
                    <Box
                        fontWeight='light'
                        as='h1'
                        noOfLines={1}
                        mt='6'
                        fontSize='md'
                    >
                        {product.colors.length}
                        {product.colors.length === 1 && <span className='ml-1'>colorazione disponibile</span>}
                        {product.colors.length > 1 && <span className='ml-1'>colorazioni disponibili</span>}
                    </Box>
                    <div className='mt-2'>
                        <Circle_Color colors={product.colors} dimension={10} space={'4'} />
                    </div>
                    <Box
                        fontWeight='light'
                        as='h1'
                        noOfLines={1}
                        mt='6'
                        mb={3}
                        fontSize='md'
                    >
                        Taglie disponibili
                    </Box>
                    <Size_Box
                        borderWidth='1px'
                        py={2}
                        borderRadius={5}
                        width={28}
                        fontSize={'2xl'}
                        fontWeight={'normal'}
                        sizes={product.sizes}
                    />

                </Box>

            </div>
        </Desktop_Layout>
    )
}

export default index