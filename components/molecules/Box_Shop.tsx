import React, { useState } from 'react'
import { Box, HStack, Image, Tag, TagLabel } from '@chakra-ui/react'
import { Shop } from '../../src/interfaces/shop.interface'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import toUpperCaseFirstLetter from '../utils/uppercase_First_Letter';
import isShopOpen from '../utils/isShopOpen';
import { imageKitUrl } from '../utils/imageKitUrl';

const Box_Shop: React.FC<{ shop: Shop, eventHandler: any, scale: string }> = ({ shop, eventHandler, scale }) => {




    return (
        <Box onClick={() => eventHandler(shop)}
            mb={'2'} className='cursor-pointer min-h-[100px]'
            _active={{
                transform: `${scale}`,
            }}
            maxW={'full'}
        >

            <LazyLoadImage src={
                imageKitUrl(shop.profileCover)
            }
                //PlaceholderSrc={PlaceholderImage}
                alt={shop.name}
                className='object-cover aspect-[2.3/1] min-h-[100px] xl:min-h-[200px] rounded-[15px]'
            />
            <Box
                display={'flex'}
                justifyContent={'space-between'}
            >
                <Box
                    marginBottom={1}
                    width={['20', '32']}
                    height={['20', '32']}
                    mt={[-10, -16]}
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
                            alt={shop.name}
                            className='m-auto h-full w-full p-[4px] lg:p-[5px] rounded-full'
                        />
                    </Box>
                </Box>
                {shop.categories && <Box
                    mt={2}
                >
                    <HStack spacing={1.5}>
                        {shop.categories.map((category) => (
                            <Tag
                                size={['sm', 'md']}
                                paddingX={3}
                                paddingY={[1.5, 1]}
                                key={category}
                                borderRadius='full'
                                fontWeight={'medium'}
                                variant='solid'
                                bg={'primary.bg'}
                                color={'primary.text'}
                            >
                                <TagLabel>{category}</TagLabel>
                            </Tag>
                        ))}
                    </HStack>
                </Box>}
            </Box>

            <Box pb={1} px={3} display={'flex'} gap={1.5}>
                <Box
                    fontWeight='extrabold'
                    as='h2'
                    noOfLines={1}
                    fontSize={['lg', 'xl']}

                    lineHeight={'normal'}
                    mb={0}
                >
                    {toUpperCaseFirstLetter(shop.name)}
                </Box>
                <div className="w-1 h-1 rounded-full bg-[#909090] my-auto"></div>

                <Box
                    fontWeight='medium'
                    as='h2'
                    fontSize='sm'
                    my={'auto'}
                    color={'#909090'}
                    lineHeight={'4'}
                    mb={0.5}
                    noOfLines={1}
                >
                    {shop.address.city}
                </Box>
            </Box>

        </Box>
    )
}

export default Box_Shop