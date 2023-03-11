import { Box, Divider } from '@chakra-ui/react'
import React from 'react'
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout'

const settings = [
    {
        name: 'Configurazione Account',
        href: '/user/settings/edit-account',
    },
    {
        name: 'come funzionano gli ordini',
        href: undefined,
    },
    {
        name: 'chi sono i negozi che vendono in veplo',
        href: undefined,
    },
    {
        name: 'voglio restituire un ordine',
        href: undefined,
    }
]

const index = () => {
    return (
        <Desktop_Layout>
            <div className='flex w-full mt-8 md:mt-10' >
                <div className='md:p-3 space-y-4 m-auto md:w-8/12 lg:w-1/2'>
                    <Box
                        borderRadius={'3xl'}
                        w={'full'}
                        background={'gray.100'}
                        borderWidth={1}
                        borderColor={'gray.300'}
                        alignContent={'center'}

                    >
                        <Box
                            fontSize={20}
                            fontWeight={'bold'}
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
                        {settings.map((setting, index) => {
                            return (
                                <div key={setting.name}>
                                    <Box
                                        paddingY={5}
                                        paddingX={8}
                                        display={'flex'}
                                        justifyContent={'space-between'}
                                    >
                                        <Box>{setting.name}</Box>
                                    </Box>
                                    {index !== settings.length - 1 && <Divider
                                        borderColor={'gray.400'}

                                    />}
                                </div>

                            )
                        })}
                    </Box>
                </div>
            </div>

        </Desktop_Layout >
    )
}

export default index