import { Tag, TagLabel } from '@chakra-ui/react'
import { Cancel } from 'iconoir-react'
import React, { FC } from 'react'


const TagFilter: FC<{ value: 'colors' | 'maxPrice' | 'minPrice' | 'sizes' | 'sorting', text: any, handleEvent: (value: 'colors' | 'maxPrice' | 'minPrice' | 'sizes' | 'sorting') => void }> = ({ value, text, handleEvent }) => {
    return (
        <Tag
            cursor={'pointer'}
            key={value} paddingY={3} paddingX={4} borderRadius={'full'}
            color={'primary.bg'}
            bg={'white'}
            borderWidth={1}
            borderColor={'primary.bg'}
            onClick={() => handleEvent(value)}
            display={'flex'}
            justifyContent={'space-between'}
        >
            <TagLabel
                minW={5}
                fontSize={'md'}
                fontWeight={'normal'}
            >
                {text}

            </TagLabel>
            <Cancel
                className='h-5 w-5 m-auto ml-1'
            />
        </Tag>
    )
}

export default TagFilter