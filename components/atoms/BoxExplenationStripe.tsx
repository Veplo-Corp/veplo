import { Box } from '@chakra-ui/react'
import React, { FC, memo } from 'react'

const BoxExplenationStripe: FC<{ textBold: string }> = ({ textBold }) => {
    return (
        <Box
            borderColor={'gray.300'}
            borderWidth={1}
            display={'flex'}
            justifyContent={'space-between'}
            paddingX={6}
            paddingY={4}
            background={'gray.50'}

            borderRadius={'10'}
            marginTop={6}
            marginBottom={8}
        >
            <Box
                fontSize={['12px', '13px']}
                mr={4}
            >
                Utilizziamo Stripe per assicurarci che i pagamenti avvengano in tempo e per mantenere al sicuro i tuoi dati personali.
                Fai clic su <strong> {textBold} </strong> per procedere alla registrazione con Stripe.
            </Box>
            <img
                className='w-2/12 md:w-1/4'
                src={'/static/stripeLogo.svg'}
                alt='Stripe'
            />
        </Box>
    )
}

export default memo(BoxExplenationStripe)