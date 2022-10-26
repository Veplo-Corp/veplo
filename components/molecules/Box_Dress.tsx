import React from 'react'
import { Box, Image } from '@chakra-ui/react'
import Circle_Color from '../atoms/Circle_Color'


const Box_Dress = (props) => {

    
    return (
        <Box onClick={() => props.eventHandler(props.dress)} minW='20' maxW='350' mb={'5'} borderRadius='lg' overflow='hidden' className='cursor-pointer'
            _active={{
                transform: 'scale(0.99)',
            }}>
            <Image src={props.dress.photos[0]} alt={props.dress.imageAlt} />
            <Box py='1' px={'0'}>
                <Box
                    mt='1'
                    fontWeight='bold'
                    as='h2'
                    lineHeight='tight'
                    noOfLines={1}
                    fontSize='sm'
                >
                    {props.dress.shopName}
                </Box>
                <Box
                    fontWeight='normal'
                    as='h2'
                    noOfLines={1}
                    lineHeight='tight'
                    fontSize='sm'
                    className='italic'
                >
                    {props.dress.brand}
                </Box>
                <Box
                    fontWeight='normal'
                    as='h3'
                    fontSize='sm'
                    noOfLines={1}
                    mt={-1}
                >
                    {props.dress.name}
                </Box>
                <div className='flex justify-between mt-2'>
                    <Box
                        fontWeight='bold'
                        as='h4'
                        fontSize='xs'
                        color='green.600'
                        lineHeight='none'
                        noOfLines={1}
                        mt={'1'}
                    >
                        {props.dress.formattedPrice}
                    </Box>
                    <Circle_Color colors={props.dress.colors} dimension={'4'}  space={'1'}/>
                    
                </div>
            </Box>
        </Box>
    )
}

export default Box_Dress