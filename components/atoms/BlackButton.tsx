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
            variant={'black'}
            _disabled={{
                bg: '#000000'
            }}
            _hover={{
                color: 'primary.text'
            }}
            leftIcon={leftIcon}
        >{element}</Button>
    )
}

export default BlackButton