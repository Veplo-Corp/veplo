import { Tag, TagLabel } from '@chakra-ui/react'
import React, { FC } from 'react'

const TagComponent: FC<{ text: string, bg: string, color: string }> = ({ text, bg, color }) => {
    return (
        <Tag
            size={['sm', 'sm', 'md']}
            paddingX={['9px', '12px', '16px']}
            fontSize={['xs', 'md']}
            paddingY={['4px', '5px', '6px']}
            borderRadius='full'
            fontWeight={['medium', 'semibold']}
            variant='solid'
            bg={bg}
            color={color}
        >
            <TagLabel>{text}</TagLabel>
        </Tag>
    )
}

export default TagComponent