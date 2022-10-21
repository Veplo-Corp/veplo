import React, { useEffect, useState } from 'react'
import { Box, Image } from '@chakra-ui/react';

const SIZES = [
    {
        text: 'XS',
        size: 'XS (32)'
    },
    {
        text: 'S',
        size: 'S (36)'
    },
    {
        text: 'M',
        size: 'M (40)'
    },
    {
        text: 'L',
        size: 'L (44)'
    },
    {
        text: 'XL',
        size: 'XL (48)'
    },
    {
        text: 'XXL',
        size: 'XXL (48)'
    }
]


const Size_Box = ({ borderWidth, py, borderRadius, width, fontSize, fontWeight, sizes }) => {



    return (
        <div className='grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-fit gap-3 '>
            {SIZES.map((size) => {
                let bg = 'gray.100'
                let color = 'gray.400'


                if (sizes.includes(size.size)) {
                    bg = 'white'
                    color = 'black.900'
                }

                return (<Box
                    key={size.text}
                    borderWidth={borderWidth}
                    py={py}
                    borderRadius={borderRadius}
                    width={width}
                    fontSize={fontSize}
                    fontWeight={fontWeight}
                    bg={bg}
                    color={color}
                    className='text-center '
                >
                    {size.text}
                </Box>)
            })}
        </div>



    )
}

export default Size_Box