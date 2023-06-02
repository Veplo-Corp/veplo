import { Box, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React from 'react'

const AddNewShopCard = () => {
    const router = useRouter()
    return (
        <Box maxW='sm' borderWidth='1px' borderRadius='xl' overflow='hidden'
            className='cursor-pointer'
            minH={['200px', '200px']}
            bgColor={'gray.50'}
            _active={{
                transform: 'scale(0.99)',
            }}
            onClick={() => {
                router.push('/shop/home/crea-shop')
            }}
        >
            <div className='flex justify-center h-full items-center text-gray-600
                    '>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-6 h-6 mr-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <Text fontSize={'lg'}
                    fontWeight={'bold'}
                >
                    Aggiungi
                </Text>
            </div>

        </Box>
    )
}

export default AddNewShopCard