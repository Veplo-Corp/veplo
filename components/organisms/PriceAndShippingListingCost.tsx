import { Box, Divider } from '@chakra-ui/react'
import React, { FC } from 'react'
import { formatNumberWithTwoDecimals } from '../utils/formatNumberWithTwoDecimals'

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
                    {formatNumberWithTwoDecimals(subTotal)}€
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
                    {shippingCost ? formatNumberWithTwoDecimals(shippingCost) + '€' : 'gratis'}
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
                    {formatNumberWithTwoDecimals(total)} €
                </Box>
            </Box>
        </Box>
    )
}

export default PriceAndShippingListingCost