import { Box, Divider } from '@chakra-ui/react'
import React, { FC } from 'react'

const PriceAndShippingListingCost: FC<{ subTotal: number, total: number, shippingCost: number }> = ({ subTotal, total, shippingCost }) => {
    return (
        <Box
            marginTop={[5, 4]}
            width={'full'}
            fontSize={'sm'}
        >

            <Box
                display={'flex'}
                justifyContent={'space-between'}
                mb={0}
            >
                <Box>
                    Subtotale
                </Box>
                <Box>
                    {subTotal.toFixed(2).replace('.', ',')} €
                </Box>
            </Box>
            <Box
                display={'flex'}
                justifyContent={'space-between'}
            >
                <Box>
                    Spedizione
                </Box>
                <Box>
                    {shippingCost.toFixed(2).replace('.', ',')} €
                </Box>
            </Box>
            <Divider
                marginY={[1, 2]}
            />
            <Box
                display={'flex'}
                justifyContent={'space-between'}
                fontSize={'md'}
                fontWeight={'semibold'}
            >
                <Box>
                    Totale
                </Box>
                <Box>
                    {(total).toFixed(2).replace('.', ',')} €
                </Box>
            </Box>
        </Box>
    )
}

export default PriceAndShippingListingCost