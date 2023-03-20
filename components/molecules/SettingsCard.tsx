import { Box, Divider } from '@chakra-ui/react'
import React, { FC } from 'react'

const SettingsCard: FC<{ children: any, title: string }> = ({ children, title }) => {
    return (
        <Box
            borderRadius={'3xl'}
            w={'full'}
            background={'gray.100'}
            borderWidth={1}
            borderColor={'gray.300'}
            alignContent={'center'}

        >
            <Box
                fontSize={25}
                fontWeight={'extrabold'}
                fontStyle={'italic'}
            >
                <Box
                    paddingY={5}
                    paddingX={8}
                >
                    Impostazioni

                </Box>
                <Divider
                    borderColor={'gray.400'}
                />

            </Box>
            {children}
        </Box>
    )
}

export default SettingsCard