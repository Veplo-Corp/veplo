import { Tag, TagLabel } from '@chakra-ui/react'
import React, { FC } from 'react'

const TagComponent: FC<{ text: string, bg: string, color: string }> = ({ text, bg, color }) => {
    return (
        <Tag
            size={['sm', 'md']}
            paddingX={['12px', '16px']}
            paddingY={['5px', '6px']}
            borderRadius='full'
            fontWeight={'semibold'}
            variant='solid'
            bg={bg}
            color={color}
        >
            <TagLabel>{text}</TagLabel>
        </Tag>
    )
}

export default TagComponent