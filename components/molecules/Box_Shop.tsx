import React, { useState } from 'react'
import { Box, Divider, HStack, Image, Tag, TagLabel, VStack } from '@chakra-ui/react'
import { Shop } from '../../src/interfaces/shop.interface'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import toUpperCaseFirstLetter from '../utils/uppercase_First_Letter';
import isShopOpen from '../utils/isShopOpen';
import { imageKitUrl } from '../utils/imageKitUrl';
import { GetShopQuery, ShopsQuery } from '../../src/lib/apollo/generated/graphql';

const Box_Shop: React.FC<{ shop: ShopsQuery["shops"][0], eventHandler: any, scale: string }> = ({ shop, eventHandler, scale }) => {

    const ShopInfo = () => {
        return (
            <>
                <Box
                    fontWeight='medium'
                    as='h2'
                    fontSize={['15px', '17px']}
                    color={'#909090'}
                    lineHeight={'4'}
                    my={'auto'}
                    mb={'6px'}
                    noOfLines={1}
                >
                    22 prodotti
                </Box>
                <div className="w-[6px] h-[6px] rounded-full bg-[#909090] my-auto mb-3 "></div>
                <img
                    className='h-5 w-5 sm:h-6 sm:w-6 my-auto mb-1'
                    src={'https://www.datocms-assets.com/102220/1691248108-money-with-wings_1f4b8-1.png'} />
            </>

        )
    }

    const ShopName = () => {
        return (
            <Box
                fontWeight='extrabold'
                as='h2'
                noOfLines={1}
                fontSize={['26px', '30px']}
                lineHeight={'normal'}
                mb={0}
            >
                {toUpperCaseFirstLetter(shop.name)}
            </Box>
        )
    }

    const ShopTag = () => {
        return (<HStack spacing={2.5}>
            {shop.categories && shop.categories.map((category) => (
                <Tag
                    size={['sm', 'md']}
                    paddingX={['12px', '16px']}
                    paddingY={['5px', '6px']}
                    key={category}
                    borderRadius='full'
                    fontWeight={'semibold'}
                    variant='solid'
                    bg={'primary.opacityBg'}
                    color={'primary.bg'}
                >
                    <TagLabel>{category}</TagLabel>
                </Tag>
            ))}
        </HStack>)
    }

    return (
        <>

            <Box onClick={() => eventHandler(shop)}
                mb={'2'} className='cursor-pointer min-h-[50px] sm:hidden mt-5 '
                _active={{
                    transform: `${scale}`,
                }}
                maxW={'full'}
            >
                <Box display={'flex'} width={'full'} gap={'20px'}>

                    <Box
                        marginBottom={1}
                        width={'113px'}
                        height={'113px'}
                        borderWidth={1}
                        borderColor={'#EFEFEF'}
                        background={'#EFEFEF'}
                        borderRadius={'full'}
                        color={'gray.400'}
                        display={'flex'}
                    >


                        <LazyLoadImage src={
                            imageKitUrl(shop.profilePhoto)
                        }
                            //PlaceholderSrc={PlaceholderImage}
                            alt={'' + shop.name}
                            className='my-auto h-[110px] w-[110px] m-auto rounded-full'

                        />
                    </Box>
                    <Box display={'grid'} gap={'8px'} my={'auto'}>
                        <ShopName />


                        <Box display={'flex'} gap={'6px'}>
                            <ShopInfo />
                        </Box>
                        {shop.categories && <Box
                            my={'auto'}
                        >
                            <ShopTag />
                        </Box>}
                    </Box>

                </Box>
                <Divider className='mt-7 mx-auto'
                    width={'95%'}
                    orientation='horizontal' />
            </Box >
            <Box onClick={() => eventHandler(shop)}
                mb={'2'} className='cursor-pointer min-h-[100px] hidden sm:grid'
                _active={{
                    transform: `${scale}`,
                }}
                maxW={'full'}
            >

                <LazyLoadImage src={
                    imageKitUrl(shop?.profileCover ? shop?.profileCover : '', 870, 378)
                }
                    //PlaceholderSrc={PlaceholderImage}
                    alt={'' + shop?.name}
                    effect='blur'
                    className='object-cover aspect-[2.3/1] min-h-[100px] xl:min-h-[200px] rounded-[20px]'
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
                                alt={'' + shop.name}
                                className='m-auto h-full w-full p-[4px] lg:p-[5px] rounded-full'
                            />
                        </Box>
                    </Box>
                    {shop.categories && <Box
                        my={'auto'}
                    >
                        <ShopTag />
                    </Box>}
                </Box>

                <Box pb={1} pl={8} display={'flex'} gap={'10px'}>
                    <ShopName />
                    <div className="w-[6px] h-[6px] rounded-full bg-[#909090] my-auto mb-3 "></div>
                    <ShopInfo />
                </Box>

            </Box>
        </>

    )
}

export default Box_Shop