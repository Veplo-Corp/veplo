import React, { useEffect, useRef, useState } from 'react'
import { Box, Image } from '@chakra-ui/react';

interface Props {
    borderWidth: string,
    py: number,
    borderRadius: string,
    fontSize: string,
    fontWeight: any,
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
        <div className='grid grid-cols-3 xl:grid-cols-4 w-full md:w-fit xl:w-full gap-3'>
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
                        bg={sizeProductExist?.quantity > 0 ? 'white' : '#F2F2F2'}
                        color={sizeProductExist?.quantity > 0 ? 'black' : '#A19F9F'}
                        noOfLines={3}
                        className="text-center md:min-w-24 lg:w-32 xl:w-full min-w-[100px]"
                        h={'full'}
                        cursor={sizeProductExist?.quantity <= 0 || !sizeProductExist ? '' : 'pointer'}
                        px={[2, 2]}
                        onClick={() => {
                            if (sizeProductExist?.quantity <= 0 || !sizeProductExist) return;
                            handleLot(size);
                        }}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Box
                            paddingY={size.length > 5 ? 0 : 1}
                            minH={12}
                        >
                            <Box
                                fontSize={size.length > 5 ? '15px' : fontSize}
                                fontWeight={size.length > 5 ? 'medium' : fontWeight}
                                mb={size.length > 5 ? 1.5 : 2}
                            >
                                {size.toUpperCase()}
                            </Box>
                            <Box fontWeight={['base', 'base']}

                                fontSize={['2xs', '2xs']} color={'gray.500'} mt={-3}>
                                {sizeProductExist?.quantity < 10 && sizeProductExist?.quantity > 0 ? `solo ${sizeProductExist?.quantity} disponibil${sizeProductExist?.quantity > 1 ? 'i' : 'e'}` : sizeProductExist?.quantity > 0 ? `` : 'terminato'}
                            </Box>
                        </Box>

                    </Box>
                )
            })}
        </div>
    )
}

export default Size_Box