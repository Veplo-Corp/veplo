import React from 'react'
import { Button } from '@chakra-ui/react'

type Props = {
    element: string,
    borderRadius: number,
    size:string,
    typeButton: "button" | "submit" | "reset"
}

const BlackButton: React.FC<Props>  = ({element, borderRadius, size, typeButton}) => {
    return (
        <Button
        type={typeButton}
        borderRadius={borderRadius} size={size} padding={5} paddingInline={10}
            bg={'black.900'}
            color={'white'}
            _hover={{ bg: 'black.900' }}
            _focus={{
                bg: 'black.900'
            }}
            _active={{
                transform: 'scale(0.98)',
            }}
        >{element}</Button>
    )
}

export default BlackButton