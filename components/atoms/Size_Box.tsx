import React, { useEffect, useRef, useState } from 'react'
import { Box, Image } from '@chakra-ui/react';

interface Props {
    borderWidth: string,
    py: number,
    borderRadius: number,
    fontSize: string,
    fontWeight: string,
    lots: {
        size: string,
        quantity: any
    }[],
    totalLotsProduct: string[],
    handleLot: (size: string) => void,
    sizeSelected?: string
}


const Size_Box: React.FC<Props> = ({ borderWidth, py, borderRadius, fontSize, fontWeight, lots, handleLot, sizeSelected, totalLotsProduct }) => {



    return (
        <div className='grid grid-cols-3 xl:grid-cols-4  w-fit gap-3'>
            {totalLotsProduct.map((size) => {
                const sizeProductExist = lots.find(lot => lot.size === size)
                return (
                    <Box
                        key={size}
                        borderWidth={sizeSelected === size ? '2px' : borderWidth}
                        borderColor={sizeSelected === size ? 'gray.600' : 'gray-100'}
                        py={py}
                        borderRadius={borderRadius}
                        fontSize={fontSize}
                        fontWeight={fontWeight}
                        bg={sizeProductExist?.quantity > 0 ? `white` : 'gray.100'}
                        color={'black.900'}
                        noOfLines={3}
                        className='text-center w-full lg:w-32'
                        h={'full'}
                        cursor={sizeProductExist?.quantity <= 0 || !sizeProductExist ? '' : 'pointer'}
                        px={2}
                        onClick={() => {
                            if (sizeProductExist?.quantity <= 0 || !sizeProductExist) return
                            handleLot(size)
                        }}

                    >
                        <Box
                        >
                            {size.toUpperCase()}
                        </Box>
                        <Box
                            fontWeight={['normal', 'medium']}
                            fontSize={['2xs', '2xs']}
                            color={'gray.500'}
                            mt={-1}
                        >
                            {sizeProductExist?.quantity > 0 ? `disponibilità: ${sizeProductExist?.quantity}` : 'non disponibile'}
                        </Box>
                    </Box>)
            })}
        </div>
    )
}

export default Size_Box