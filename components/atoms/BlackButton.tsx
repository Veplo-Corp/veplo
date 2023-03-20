import React from 'react'
import { Button } from '@chakra-ui/react'
import { DownloadIcon } from '@chakra-ui/icons'

type Props = {
    element: string | JSX.Element,
    borderRadius: number,
    size: string,
    typeButton: "button" | "submit" | "reset",
    disabled: boolean,
    width?: number | string,
    heigth?: number,
    onClick?: any,
    leftIcon?: any
}

const BlackButton: React.FC<Props> = ({ element, borderRadius, size, typeButton, disabled, width, heigth, onClick, leftIcon }) => {

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
            leftIcon={leftIcon}
        >{element}</Button>
    )
}

export default BlackButton