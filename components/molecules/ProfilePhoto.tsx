import { Avatar, Box, Text } from '@chakra-ui/react'
import React, { FC } from 'react'
import { imageKitUrl } from '../utils/imageKitUrl'

type Props = {
    imgName: string | null | undefined,
    scr: string | null | undefined,
    primaryText: string | null | undefined,
    secondaryText: string | null | undefined
}

const ProfilePhoto = (props: Props) => {
    return (
        <Box
            display={'flex'}
            gap={2}
        >
            <Avatar
                name={props.imgName ? props.imgName : 'Immagine non trovata'}
                src={props.scr ? imageKitUrl(props.scr, 100, 100) : ''}
                bg='white'
                height={['50px', '50px', '60px', '60px']}
                width={['50px', '50px', '60px', '60px']}
                borderWidth={'1px'}
                borderColor={'#F3F3F3'}
            />
            <Box
                my={'auto'}
            >
                <Text
                    fontWeight={'black'}
                    fontSize={['15px', '18px']}
                    lineHeight={['16px', '19px']}
                >
                    {props.primaryText}
                </Text>
                <Text
                    fontWeight={'medium'}
                    fontSize={['12px', '14px']}

                    color={'#909090'}
                >
                    {props.secondaryText}
                </Text>
            </Box>

        </Box>
    )
}

export default ProfilePhoto