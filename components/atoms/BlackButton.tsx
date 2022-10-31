import React from 'react'
import { Button } from '@chakra-ui/react'

type Props = {
    element: string,
    borderRadius: number,
    size: string,
    typeButton: "button" | "submit" | "reset",
    disabled: boolean,
    width?: number,
    heigth?: number,
    onClick?: any
}

const BlackButton: React.FC<Props> = ({ element, borderRadius, size, typeButton, disabled, width, heigth, onClick }) => {

    return (
        <Button
            onClick={onClick}
            disabled={disabled}
            type={typeButton}
            borderRadius={borderRadius} 
            size={size} 
            padding={5} 
            paddingInline={10}
            width={width}
            height={heigth}
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