import { Box, Text } from '@chakra-ui/react'
import { Mail, PhoneOutcome } from 'iconoir-react'
import Link from 'next/link'
import React from 'react'

const index = () => {
    return (
        <Box
            className='
            md:h-screen
            mb-96 mt-10
            w-full md:w-3/4 lg:w-5/12 m-auto my-4 lg:my-20'
            display={['grid', 'flex']}
            gap={[10, 10]}
            justifyContent={['center', 'space-between']}
        >
            <Box>
                <Mail
                    className='w-12 h-12 lg:w-18 lg:h-18'
                    strokeWidth={1.5}
                />
                <Text
                    fontSize={'lg'}
                    fontWeight={'extrabold'}
                    mt={2}
                >
                    <Link
                        prefetch={false}
                        href="mailto:business@veplo.it"
                        target="_blank" rel="noopener noreferrer"
                    >
                        Scrivici
                    </Link>
                </Text>
                <Text
                    fontSize={'sm'}
                    mb={2}
                >
                    Risponderemo il prima possibile
                </Text>
                <Text
                    fontSize={['md', 'lg']}
                    fontWeight={'medium'}
                >
                    <Link
                        prefetch={false}
                        href="mailto:info@veplo.it"
                        target="_blank" rel="noopener noreferrer"
                    >
                        clienti: info@veplo.it
                    </Link>
                </Text>
                <Text
                    fontSize={['md', 'lg']}
                    fontWeight={'medium'}
                >
                    <Link
                        prefetch={false}
                        href="mailto:business@veplo.it"
                        target="_blank" rel="noopener noreferrer"
                    >
                        negozi: business@veplo.it
                    </Link>
                </Text>
            </Box>
            <Box>
                <PhoneOutcome
                    className='w-12 h-12 lg:w-18 lg:h-18'
                    strokeWidth={1.5}
                />
                <Text
                    fontSize={'lg'}
                    fontWeight={'extrabold'}
                    mt={2}
                >
                    <Link
                        prefetch={false}
                        href="mailto:business@veplo.it"
                        target="_blank" rel="noopener noreferrer"
                    >
                        Chiamaci
                    </Link>
                </Text>
                <Text
                    fontSize={'sm'}
                    mb={2}
                >
                    dal lunedì al venerdì dalle 09:00 alle 18:00
                </Text>

                <Text
                    fontSize={['md', 'lg']}
                    fontWeight={'medium'}
                >
                    <Link href="tel:+393403033922"
                    >
                        +39 3403033922
                    </Link>
                </Text>
            </Box>
        </Box>
    )
}

export default index