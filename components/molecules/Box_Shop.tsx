import React, { useState } from 'react'
import { Box, Image } from '@chakra-ui/react'
import { Shop } from '../../src/interfaces/shop.interface'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import toUpperCaseFirstLetter from '../utils/uppercase_First_Letter';
import isShopOpen from '../utils/isShopOpen';
import { imageKitUrl } from '../utils/imageKitUrl';

const Box_Shop: React.FC<{ shop: Shop, eventHandler: any, scale: string }> = ({ shop, eventHandler, scale }) => {
    const [isOpen, setisOpen] = useState(isShopOpen(shop?.info?.opening.days, shop?.info?.opening.hours))




    return (
        <Box onClick={() => eventHandler(shop)} width={'full'}
            mb={'2'} overflow='hidden' className='cursor-pointer border border-inherit pb-3 rounded-xl'
            _active={{
                transform: `${scale}`,
            }}>
            <Box

            >
                <LazyLoadImage src={
                    imageKitUrl(shop.photo, 480, 300)
                }
                    //placeholderSrc={'/static/grayScreen.png'}
                    effect="blur"
                    alt={shop.name}
                    width={'full'}
                    height={'full'}
                    className='aspect-[4.8/3] object-cover'
                />
            </Box>
            <div className='flex justify-between mt-2'>
                <Box pb={1} px={3}>
                    <Box
                        mt='1'
                        fontWeight='semibold'
                        as='h2'
                        noOfLines={1}
                        fontSize='medium'
                    >
                        {toUpperCaseFirstLetter(shop.name)}
                    </Box>
                    <Box
                        fontWeight='base'
                        as='h2'
                        fontSize='11px'
                        mt={-1}
                    >
                        {shop.address.street}, {shop.address.city}
                    </Box>

                    {/* <div className='flex justify-between mt-2'>
                        <Box
                            fontWeight='bold'
                            as='h4'
                            fontSize='xs'
                            color='green.600'
                            lineHeight='none'
                            noOfLines={1}
                            mt={'1'}
                        >
                            {SHOP.reviews}
                        </Box>
                        <div className='flex space-x-1'>
                            {SHOP.stars.map((color) => {
                                return (
                                    <Box key={color} h={'4'} w={'4'} borderRadius={'100%'} bg={color} borderWidth={1} borderColor={'gray.200'}>
                                    </Box>
                                )
                            })}
                        </div>
                    </div> */}
                </Box>
                <Box className={`${isOpen ? '' : 'hidden'} my-auto px-5 py-[6px] bg-[#32CD32] mr-3 rounded-xl`}
                    fontSize={'md'}
                >
                    Aperto
                </Box>
            </div>

        </Box>
    )
}

export default Box_Shop