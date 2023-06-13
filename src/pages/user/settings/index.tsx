import { Box, Divider } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React from 'react'
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout'
import SettingsCard from '../../../../components/molecules/SettingsCard'

const settings = [
    {
        name: 'Configurazione Account',
        href: '/user/settings/edit-account',
    },
    /* {
        name: 'come funzionano gli ordini',
        href: undefined,
    }, */
    /* {
        name: 'chi sono i negozi che vendono in veplo',
        href: undefined,
    }, */
    {
        name: 'Voglio restituire un ordine',
        href: '/policies/reso-e-rimborsi',
    },
    {
        name: 'Termini e Condizioni',
        href: '/policies/termini-e-condizioni',
    }
]

const index = () => {




    const router = useRouter()
    return (
        <Desktop_Layout>
            <div className='flex w-full mt-8 md:mt-10' >
                <div className='md:p-3 space-y-4 m-auto w-full md:w-8/12 lg:w-1/2'>
                    <SettingsCard title='Impostazioni'>
                        {settings.map((setting, index) => {
                            return (
                                <div key={setting.name}>
                                    <Box
                                        onClick={() => {
                                            if (!setting.href) return
                                            router.push(setting.href)
                                        }
                                        }
                                        paddingY={5}
                                        paddingX={8}
                                        display={'flex'}
                                        cursor={'pointer'}
                                        justifyContent={'space-between'}
                                    >
                                        <Box>{setting.name}</Box>
                                        <Box

                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                            </svg>
                                        </Box>
                                    </Box>
                                    {
                                        index !== settings.length - 1 && <Divider
                                            borderColor={'gray.400'}
                                        />
                                    }
                                </div>

                            )
                        })}
                    </SettingsCard>

                </div>
            </div >

        </Desktop_Layout >
    )
}

export default index