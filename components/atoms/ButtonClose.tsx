import { Button } from '@chakra-ui/react'
import { Cancel } from 'iconoir-react'
import React, { FC } from 'react'

const ButtonClose: FC<{ handleEvent: () => void }> = ({ handleEvent }) => {
    return (
        <Button
            borderRadius={'full'}
            h={12}
            w={12}
            p={0}
            variant={'grayPrimary'}
            onClick={handleEvent}
        >
            <Cancel
                strokeWidth={2.8}
                className='w-7 h-7'
            />
        </Button>
    )
}

export default ButtonClose