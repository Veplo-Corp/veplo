import { Avatar, Box, Text, useBreakpointValue } from '@chakra-ui/react'
import React, { FC } from 'react'
import { imageKitUrl } from '../utils/imageKitUrl'

type Props = {
    imgName: string | null | undefined,
    scr: string | null | undefined,
    primaryText: string | null | undefined,
    secondaryText: string | null | undefined
    maxWidth?: boolean,
    doubleGridDevice?: boolean
}

const ProfilePhoto = (props: Props,) => {
    const isSmallView = useBreakpointValue({ base: true, sm: false });

    return (
        <Box
            display={'flex'}
            gap={2}
        >
            <Avatar
                name={props.imgName ? props.imgName : 'Immagine non trovata'}
                src={props.scr ? imageKitUrl(props.scr, 100, 100) : ''}
                bg='white'
                height={[props.doubleGridDevice ? '40px' : props.maxWidth && isSmallView ? '45px' : '50px', '45px', '50px', '60px']}
                width={[props.doubleGridDevice ? '40px' : props.maxWidth && isSmallView ? '45px' : '50px', '45px', '50px', '60px']}
                borderWidth={'1px'}
                borderColor={'#F3F3F3'}
            />
            <Box
                my={'auto'}
            >
                <Text
                    fontWeight={'black'}
                    fontSize={[props.doubleGridDevice ? '13px' : '15px', '18px']}
                    lineHeight={[props.doubleGridDevice ? '12px' : '16px', '19px']}
                    maxW={props.maxWidth && isSmallView ? '120px' : ''}
                    isTruncated
                >
                    {props.primaryText}
                </Text>
                <Text
                    fontWeight={'medium'}
                    fontSize={[props.doubleGridDevice ? '10px' : '12px', '14px']}
                    maxW={props.maxWidth && isSmallView ? '120px' : ''}
                    color={'#909090'}
                >
                    {props.secondaryText}
                </Text>
            </Box>

        </Box>
    )
}

export default ProfilePhoto