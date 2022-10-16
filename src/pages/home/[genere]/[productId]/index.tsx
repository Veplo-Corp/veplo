import { useRouter } from 'next/router'
import React from 'react'
import Desktop_Layout from '../../../../../components/atoms/Desktop_Layout';
import { Box, Image } from '@chakra-ui/react'

const index = () => {

    const router = useRouter();

    const query = router.query;
    //decodeURI
    console.log(decodeURIComponent(query.nome));

    const dress = {
        name: 'LOGO LONG SLEEVE TEE - Maglietta a manica lunga',
        company: 'Sartoria Rizzo Merlini',
        brand: 'Tommy Hilfiger',
        formattedPrice: '24,99€',
        imageUrl: 'https://img01.ztat.net/article/spp-media-p1/0a53a253d16a366cb8752f4ef4c76f37/24afae32e49b473db7b2502bef83e4ea.jpg?imwidth=1800',
        imageAlt: 'Rear view of modern dress',
        color: ['blackAlpha.900', 'gray.300', 'red.700', 'white'],
        id: 'ABC1234'
    }

    const zoomImage = () => {

    }

    return (
        <Desktop_Layout>
            <div className='flex justify-between'>
                <Box onClick={zoomImage} key={Math.random()} minW='20' maxW='450' mb={'5'} borderRadius='lg' overflow='hidden' className='cursor-pointer'>
                    <Image src={dress.imageUrl} alt={dress.imageAlt} />
                </Box>
            </div>
        </Desktop_Layout>
    )
}

export default index