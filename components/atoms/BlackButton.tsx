import React from 'react'
import { Button } from '@chakra-ui/react'

type Props = {
    city: string
}

const BlackButton: React.FC<Props>  = ({city}) => {
    return (
        <Button borderRadius={50} size={'lg'} padding={5} paddingInline={10}
            bg={'black.900'}
            color={'white'}
            _hover={{ bg: 'black.900' }}
            _focus={{
                bg: 'black.900'
            }}
            _active={{
                transform: 'scale(0.98)',
            }}
        >{city}</Button>
    )
}

export default BlackButton