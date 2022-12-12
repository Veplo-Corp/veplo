import React, { useEffect, useRef, useState } from 'react'
import { Box, Image } from '@chakra-ui/react';



const Size_Box: React.FC<any> = ({ borderWidth, py, borderRadius, fontSize, fontWeight, sizes, gender, macrocategory }) => {

    /* return (
        <div className='grid grid-cols-4  w-fit gap-3 '>
            {Sizes.map((size) => {
                console.log(size);
                
                let bg = 'gray.100'
                let color = 'gray.400'


                if (sizes.includes(size)) {
                    bg = 'white'
                    color = 'black.900'
                }

                return (<Box
                    key={size}
                    borderWidth={borderWidth}
                    py={py}
                    borderRadius={borderRadius}
                    fontSize={fontSize}
                    fontWeight={fontWeight}
                    bg={bg}
                    color={color}
                    noOfLines={1}
                    className='text-center w-24 lg:w-32 '
                >
                    {size}
                </Box>)
            })}
        </div>
    ) */

    return (
        <div className='grid grid-cols-3 xl:grid-cols-4  w-fit gap-3 '>
            {sizes.map((sizes:string) => {
                return (<Box
                    key={sizes}
                    borderWidth={borderWidth}
                    py={py}
                    borderRadius={borderRadius}
                    fontSize={fontSize}
                    fontWeight={fontWeight}
                    bg={'white'}
                    color={'black.900'}
                    noOfLines={1}
                    className='text-center w-24 lg:w-32 '
                >
                    {sizes}
                </Box>)
            })}
        </div>
    )
}

export default Size_Box