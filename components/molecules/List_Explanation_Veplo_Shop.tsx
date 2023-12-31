import { Box } from '@chakra-ui/react'
import React from 'react'


interface Explaination {
    title: string,
    description: string,
    list: {
        title: string,
        description: string,
    }[]
}

const Explain_Veplo: Explaination = {
    title: 'Veplo Shop',
    description: 'non ti preoccupare, registrarsi è gratis!',
    list: [
        {
            title: 'crea il tuo negozio da zero',
            description: 'Parlaci della tua azienda e fornisci le informazioni per poter inserire il tuo negozio'
        },
        {
            title: 'Inserisci i prodotti',
            description: 'aggiungi i prodotti in vendita al tuo negozio. Ci basta avere 2 foto e le informazioni del prodotto'
        },
        {
            title: 'Pubblica il tuo shop su Veplo',
            description: 'attiva il negozio e sarà visibile a tutti gli utenti di Veplo'
        }
    ]

}

const List_Explanation_Veplo_Shop = () => {
    return (
        <Box
            marginX={['2', '-2']}
        //paddingTop={'16'}
        >
            <h1
                className='font-bold text-3xl  leading-8'
            >
                {Explain_Veplo.title}
            </h1>
            <h4
                className='font-regular text-md mb-3'
            >
                {Explain_Veplo.description}
            </h4>
            {Explain_Veplo.list.map((item, key) => {
                return (
                    <Box
                        key={key}
                        display={'flex'}
                        justifyContent={'space-between'}
                        marginBottom={['1', '3']}
                    >
                        <div className='w-2/12'>
                            <Box
                                margin={'auto'}
                                marginStart={['0', '2']}
                                fontSize={'6xl'}
                                fontWeight={'extrabold'}
                            >
                                {key + 1}
                            </Box>
                        </div>

                        <div
                            className='m-auto w-full ml-1 md:ml-3 mr-2'
                        >
                            <Box
                                fontSize={'xl'}
                                fontWeight={'semibold'}
                                mb={['0', '0.5']}
                            >
                                {item.title}
                            </Box>
                            <Box
                                fontSize={'sm'}
                                fontWeight={'normal'}
                                lineHeight={'shorter'}
                            >
                                {item.description}
                            </Box>
                        </div>

                    </Box>
                )
            })

            }
        </Box>
    )
}

export default List_Explanation_Veplo_Shop