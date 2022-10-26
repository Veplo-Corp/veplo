import React from 'react'
import { Box, Image } from '@chakra-ui/react'


const Box_Shop = (props) => {
    return (
        <Box onClick={() => props.eventHandler(props.shop)}  width={'fit-content'} mb={'2'} overflow='hidden' className='cursor-pointer'
                            _active={{
                                transform: `${props.scale}`,
                            }}>
                            <Image src={props.shop.photo} className='object-cover' borderRadius='lg' width={props.width} maxHeight={props.height} alt={props.shop.imageAlt} />
                            <Box py='1' px={'0'}>
                                <Box
                                    mt='1'
                                    fontWeight='semibold'
                                    as='h2'
                                    noOfLines={1}
                                    fontSize='medium'
                                >
                                    {props.shop.name}
                                </Box>

                                <Box
                                    fontWeight='medium'
                                    as='h2'
                                    noOfLines={1}
                                    fontSize='14px'
                                    className='italic'
                                >
                                    {props.shop.categories}
                                </Box>
                                <Box
                                    fontWeight='medium'
                                    as='h2'
                                    fontSize='12px'
                                    mt={-0.5}
                                >
                                    {props.shop.address.city}
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
                        </Box>
    )
}

export default Box_Shop