import { Box, Tag, Text } from '@chakra-ui/react'
import React, { FC } from 'react'
import { Shop } from '../../src/interfaces/shop.interface'

const ShopInfoSection: FC<{ shop: Shop, shopStreet: string | undefined }> = ({ shop, shopStreet }) => {
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
            {shopStreet && <Text
                mt={-1}
                fontSize={['2xs', 'md']}
                fontWeight={'medium'}
                color={'gray.500'}
            >{shopStreet}</Text>}
        </Box>
    )
}

export default ShopInfoSection