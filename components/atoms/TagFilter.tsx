import { Tag, TagLabel } from '@chakra-ui/react'
import { Cancel } from 'iconoir-react'
import React, { FC } from 'react'

export type FilterAccepted = 'colors' | 'maxPrice' | 'minPrice' | 'sizes' | 'sorting' | 'microCategory' | 'macroCategory' | 'brand' | 'fit' | 'materials' | 'traits' | 'length'

const TagFilter: FC<{ value: FilterAccepted, text: string, handleEvent: (value: FilterAccepted) => void }> = ({ value, text, handleEvent }) => {
    return (
        <Tag
            cursor={'pointer'}
            key={value} paddingY={[2, 3]} paddingX={[3, 4]} borderRadius={'full'}
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
                fontSize={['sm', 'md']}
                fontWeight={'normal'}
            >
                {text}

            </TagLabel>
            <Cancel
                className='h-5 w-5 m-auto ml-1.5 md:ml-1'
            />
        </Tag>
    )
}

export default TagFilter