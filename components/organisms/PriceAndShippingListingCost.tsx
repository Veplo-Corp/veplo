import { Box, Divider } from '@chakra-ui/react'
import React, { FC } from 'react'
import { formatNumberWithTwoDecimalsInString } from '../utils/formatNumberWithTwoDecimalsInString'

const PriceAndShippingListingCost: FC<{ subTotal: number, total: number, shippingCost: number, coupon: number }> = ({ subTotal, total, shippingCost, coupon }) => {
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
                    {formatNumberWithTwoDecimalsInString(subTotal)}€
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
                    {shippingCost ? formatNumberWithTwoDecimalsInString(shippingCost) + '€' : 'gratis'}
                </Box>
            </Box>

            {coupon > 0 && <Box
                display={'flex'}
                justifyContent={'space-between'}
            >
                <Box>
                    Sconto coupon applicato
                </Box>
                <Box>
                    -{formatNumberWithTwoDecimalsInString(coupon)}€
                </Box>
            </Box>}
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
                    {formatNumberWithTwoDecimalsInString(total)} €
                </Box>
            </Box>
        </Box>
    )
}

export default PriceAndShippingListingCost