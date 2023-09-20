import React, { useState } from 'react'
import { Box, Divider, HStack, Image, Tag, TagLabel, Text, VStack } from '@chakra-ui/react'
import { Shop } from '../../src/interfaces/shop.interface'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import toUpperCaseFirstLetter from '../utils/uppercase_First_Letter';
import isShopOpen from '../utils/isShopOpen';
import { imageKitUrl } from '../utils/imageKitUrl';
import { GetShopQuery, ShopsQuery } from '../../src/lib/apollo/generated/graphql';
import TagComponent from '../atoms/TagComponent';

const Box_Shop: React.FC<{ shop: ShopsQuery["shops"][0], eventHandler: any, scale: string }> = ({ shop, eventHandler, scale }) => {
    let numImages = 1;

    if (shop.stats?.averagePrice && shop.stats?.averagePrice > 60000 && shop.stats?.averagePrice < 12000) {
        numImages = 2;
    } else if (shop.stats?.averagePrice && shop.stats?.averagePrice >= 12000) {
        numImages = 3;
    }
    const ShopInfo = () => {
        return (
            <>
                <Box
                    fontWeight='medium'
                    as='h2'
                    fontSize={['15px', '17px', '15px', '17px']}
                    color={'#909090'}
                    lineHeight={'4'}
                    my={'auto'}
                    mt={[0, '13px', '13px']}
                    noOfLines={1}
                >
                    {shop.stats?.productsQuantity} prodott{shop.stats?.productsQuantity && shop.stats?.productsQuantity > 1 ? 'i' : 'o'}
                </Box>
                <div className="w-[4px] h-[4px] sm:w-[5px] sm:h-[5px]  rounded-full bg-[#909090] my-auto mb-2 sm:mt-5 "></div>
                <Box display={'flex'} gap={[1.5, '8px']} className='my-auto sm:mt-[10px] md:mt-[14px] lg:mt-[12px] xl:mt-[10px] '>
                    {Array.from({ length: numImages }).map((_, index) => (
                        <img
                            key={index}
                            className='h-5 w-5 sm:h-6 sm:w-6 md:h-4 md:w-4 lg:h-5 lg:w-5 xl:h-6 xl:w-6'
                            src={'https://www.datocms-assets.com/102220/1691248108-money-with-wings_1f4b8-1.png'}
                            alt='Money with wings'
                        />
                    ))}
                </Box>
            </>

        )
    }

    const ShopName = () => {
        return (
            <Box
            >
                <Text
                    fontWeight='extrabold'
                    as='h2'
                    noOfLines={1}
                    fontSize={['22px', '30px', '20px', '24px', '30px']}
                    lineHeight={'normal'}
                    mb={0}
                >
                    {toUpperCaseFirstLetter(shop.name?.visualized)}
                </Text>
                <Text
                    fontWeight={'normal'}
                    as='h2'
                    noOfLines={1}
                    color={'#909090'}
                    fontSize={['14px', '18px', '14px', '16px', '16px']}
                    lineHeight={['normal']}
                    mb={0}
                    mt={['-2px', '-2px']}
                >
                    @{shop.name?.unique}
                </Text>
            </Box>

        )
    }

    const ShopTag = () => {
        return (<HStack spacing={2.5}>
            {shop.categories && shop.categories.map((category) => (
                <TagComponent
                    key={category}
                    text={category}
                    bg={'primary.opacityBg'}
                    color={'primary.bg'}
                />
            ))}
        </HStack>)
    }

    return (
        <>

            <Box onClick={() => eventHandler(shop)}
                mb={'2'} className='cursor-pointer min-h-[50px] sm:hidden mt-4 '
                _active={{
                    transform: `${scale}`,
                }}
                maxW={'full'}
            >
                <Box display={'flex'} width={'full'} gap={'20px'}>

                    <Box
                        marginBottom={1}
                        width={'102px'}
                        height={'102px'}
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
                            alt={'' + shop.name?.visualized}
                            className='my-auto h-[100px] w-[100px] m-auto rounded-full'

                        />
                    </Box>
                    <Box display={'grid'} gap={'7px'} my={'auto'}>
                        <ShopName />


                        <Box display={'flex'} gap={'10px'}>
                            <ShopInfo />
                        </Box>
                        {shop.categories && <Box
                            my={'auto'}
                        >
                            <ShopTag />
                        </Box>}
                    </Box>

                </Box>
                <Divider className='mt-6 mx-auto'
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
                    alt={'' + shop?.name?.visualized}
                    effect='blur'
                    className='object-cover aspect-[2.6/1] min-h-[100px] xl:min-h-[200px] rounded-[20px]'
                />
                <Box
                    display={'flex'}
                    justifyContent={'space-between'}
                >
                    <Box
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
                                alt={'' + shop.name?.visualized}
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
                    <div className="w-[5px] h-[5px] rounded-full bg-[#909090] my-auto mt-5 "></div>
                    <ShopInfo />
                </Box>

            </Box>
        </>

    )
}

export default Box_Shop