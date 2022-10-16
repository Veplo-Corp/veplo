import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Desktop_Layout from '../../../../../components/atoms/Desktop_Layout';
import { Box, Image } from '@chakra-ui/react';


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
            <div className='flex justify-between'>
                <div className='flex space-x-4 '>
                    <Box onClick={zoomImage} key={Math.random()} minW='20' maxW='450' mb={'5'} borderRadius='lg' overflow='hidden' className='cursor-pointer'>
                        <Image src={fullImage} alt={dress.imageAlt} />
                    </Box>
                    <div>
                        {dress.imageUrl.map((image) => {
                                return (
                                    <Box onClick={() => changeImageFull(image)} key={Math.random()} minW='20' maxW='24' mb={'5'} borderRadius='lg' overflow='hidden'
                                    borderWidth={1.5}
                                    className={` ${image == fullImage ? "border-black" : "border-white"} cursor-pointer`}
                                    >
                                        <Image src={image} alt={dress.imageAlt} />
                                    </Box>
                                )
                        })}

                    </div>

                </div>

            </div>
        </Desktop_Layout>
    )
}

export default index