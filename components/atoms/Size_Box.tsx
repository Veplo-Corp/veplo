import React, { useEffect, useRef, useState } from 'react'
import { Box, Image, Text } from '@chakra-ui/react';
import { Lot } from '../../src/lib/apollo/generated/graphql';

interface Props {
    borderWidth: string,
    py: number,
    borderRadius: string,
    fontSize: string,
    fontWeight: any,
    lots: Lot[] | undefined,
    totalLotsProduct: string[],
    handleLot: (size: string) => void,
    sizeSelected?: string
}


const Size_Box: React.FC<Props> = ({ borderWidth, py, borderRadius, fontSize, fontWeight, lots, handleLot, sizeSelected, totalLotsProduct }) => {


    if (!lots) {
        return (
            <></>
        )
    }

    return (
        <div className='grid grid-cols-3 xl:grid-cols-4 w-full md:w-fit xl:w-full gap-3'>
            {totalLotsProduct.map((size) => {
                const sizeProductExist = lots.find(lot => lot.size === size)
                return (
                    <Box
                        key={size}
                        borderWidth={sizeSelected === size ? borderWidth : borderWidth}
                        borderColor={sizeSelected === size ? 'primary.bg' : 'gray.200'}
                        py={py}
                        minH={'60px'}
                        borderRadius={borderRadius}
                        fontSize={fontSize}
                        fontWeight={fontWeight}
                        bg={sizeProductExist?.quantity && sizeProductExist?.quantity > 0 && sizeSelected !== size ? 'white' : sizeSelected === size ? 'primary.bg' : '#F2F2F2'}
                        color={sizeProductExist?.quantity && sizeProductExist?.quantity > 0 && sizeSelected !== size ? '#3A3A3A' : sizeSelected === size ? 'white' : '#A19F9F'}
                        className="text-center md:min-w-24 lg:w-32 xl:w-full min-w-[100px]"
                        h={'full'}
                        cursor={sizeProductExist?.quantity && sizeProductExist?.quantity <= 0 || !sizeProductExist ? '' : 'pointer'}
                        px={[2, 2]}
                        onClick={() => {
                            if (sizeProductExist?.quantity && sizeProductExist?.quantity <= 0 || !sizeProductExist) return;
                            handleLot(size);
                        }}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Box
                            paddingY={0}
                            className='select-none'
                        >
                            <Text

                                fontSize={size.length > 5 ? '15px' : fontSize}
                                fontWeight={sizeSelected !== size ? fontWeight : 'semibold'}
                            >
                                {size.toUpperCase()}
                            </Text>
                            <Text fontWeight={'normal'}
                                fontSize={['2xs', '2xs']} color={sizeProductExist?.quantity && sizeProductExist?.quantity > 0 && sizeSelected !== size ? 'gray.500' : sizeSelected === size ? 'white' : '#A19F9F'} mt={'-4px'}>
                                {sizeProductExist?.quantity && sizeProductExist?.quantity === 1 ? 'ultimo rimasto' : sizeProductExist?.quantity && sizeProductExist?.quantity < 10 && sizeProductExist?.quantity > 0 ? `solo ${sizeProductExist?.quantity} disponibil${sizeProductExist?.quantity > 1 ? 'i' : 'e'}` : sizeProductExist?.quantity && sizeProductExist?.quantity > 0 ? `` : 'esaurito'}
                            </Text>
                        </Box>

                    </Box>
                )
            })}
        </div >
    )
}

export default Size_Box