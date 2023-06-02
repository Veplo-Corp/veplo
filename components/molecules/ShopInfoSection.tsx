import { Box, Tag, Text } from '@chakra-ui/react'
import React, { FC } from 'react'
import { Shop } from '../../src/interfaces/shop.interface'

const ShopInfoSection: FC<{ shop: Shop }> = ({ shop }) => {
    return (
        <Box
        >
            <Tag size={['sm', 'md']} variant='solid'
                colorScheme={shop.status === 'active' ? 'green' : 'red'}
            >
                {shop.status === 'active' ? 'attivo' : 'non attivo'}
            </Tag>
            <Text
                mt={-1}
                fontSize={['md', '2xl']}
                fontWeight={'extrabold'}
            >{shop.name}</Text>
            <Text
                mt={-1}
                fontSize={['2xs', 'xs']}
                fontWeight={'semibold'}
                color={'gray.500'}
            >{shop.address?.city}, {shop.address?.street}</Text>
        </Box>
    )
}

export default ShopInfoSection