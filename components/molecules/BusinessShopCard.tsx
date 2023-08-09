import { Box, Tag } from '@chakra-ui/react'
import React, { FC } from 'react'
import { imageKitUrl } from '../utils/imageKitUrl'
import { Shop } from '../../src/interfaces/shop.interface'
import { LazyLoadImage } from 'react-lazy-load-image-component'

const BusinessShopCard: FC<{ shop: Shop, toShop: (shop: Shop) => void }> = ({ shop, toShop }) => {
    return (
        <Box key={shop.id} maxW='sm' borderWidth='1px' borderRadius='xl' overflow='hidden'
            minH={['200px', '200px']}
            className='cursor-pointer'
            _active={{
                transform: 'scale(0.99)',
            }}
            onClick={() => toShop(shop)}
        >
            <LazyLoadImage
                className='w-96 lg:w-full object-cover aspect-[2.3/1]'
                src={imageKitUrl(shop.profileCover)}
                alt={'immagine non trovata'}
            />
            <Box
                width={['14', '28']}
                height={['14', '28']}
                mt={[-6, -14]}
                zIndex={10}
                borderWidth={1}
                borderColor={'white'}
                background={'white'}
                borderRadius={'full'}
                color={'gray.400'}
                fontSize={['xs', 'sm']}
                className='ml-5 md:ml-8 w-full'
                display={'flex'}
            >
                <Box
                    borderRadius={'full'}
                    width={'full'}
                    height={'full'}
                    background={'white'}
                    textAlign={'center'}
                    display={'flex'}
                >
                    <LazyLoadImage src={
                        imageKitUrl(shop.profilePhoto)
                    }
                        //PlaceholderSrc={PlaceholderImage}
                        alt={shop.name.visualized}
                        className='m-auto h-full w-full p-[4px] lg:p-[5px] rounded-full'
                    />
                </Box>
            </Box>
            <Box py={3} pt={1} px={4}>
                <Box display='flex' alignItems='baseline'
                    justifyContent={'space-between'}
                >
                    <Box
                        color='gray.500'
                        fontWeight='semibold'
                        letterSpacing='wide'
                        fontSize='xs'
                        textTransform='uppercase'
                    >
                        {shop.isDigitalOnly === false ? 'FISICO' : 'DIGITALE'}
                    </Box>
                    <Tag
                        fontSize={'xs'}
                        size={'sm'}
                        colorScheme={shop.status === 'active' ? 'green' : 'orange'}
                    >
                        {shop.status === 'active' ? 'ATTIVO' : 'DISATTIVATO'}
                    </Tag>
                </Box>

                <Box
                    mt='1'
                    fontWeight='semibold'
                    as='h4'
                    lineHeight='tight'
                    noOfLines={1}
                >
                    {shop.name.visualized}
                </Box>
                <Box
                    fontWeight='normal'
                    as='h5'
                    fontSize={'sm'}
                    mt={-1}
                    lineHeight='tight'
                    noOfLines={1}
                >
                    {shop.address.street}, {shop.address.city}
                </Box>
            </Box>
        </Box>
    )
}

export default BusinessShopCard