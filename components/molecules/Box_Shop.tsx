import React from 'react'
import { Box, Image } from '@chakra-ui/react'
import { Shop } from '../../src/interfaces/shop.interface'


const Box_Shop: React.FC<{shop:Shop, eventHandler:any, scale:string, width:number, height:string}> = ({shop, eventHandler, scale, width, height}) => {
    return (
        <Box onClick={() => eventHandler(shop)} width={'fit-content'} mb={'2'} overflow='hidden' className='cursor-pointer border border-inherit pb-2 rounded-md'
            _active={{
                transform: `${scale}`,
            }}>
            <Image src={shop.photo} className='object-cover'  width={width} maxHeight={height} alt={'immagine non trovata'} />
            <Box py={1} px={4}>
                <Box
                    mt='1'
                    fontWeight='semibold'
                    as='h2'
                    noOfLines={1}
                    fontSize='medium'
                >
                    {shop.name}
                </Box>
                {/* categorires */}
                {/* <Box
                                    fontWeight='medium'
                                    as='h2'
                                    noOfLines={1}
                                    fontSize='14px'
                                    className='italic'
                                >
                                    {shop.categories}
                                    
                                </Box> */}
                <Box
                    fontWeight='medium'
                    as='h2'
                    fontSize='12px'
                    mt={-0.5}
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
        </Box>
    )
}

export default Box_Shop