import { Avatar, Box, Text, useBreakpointValue } from '@chakra-ui/react'
import React, { FC } from 'react'
import { imageKitUrl } from '../utils/imageKitUrl'

type Props = {
    imgName: string | null | undefined,
    scr: string | null | undefined,
    primaryText: string | null | undefined,
    secondaryText: string | null | undefined
    maxWidth?: string | undefined,
    doubleGridDevice?: boolean,
    popover?: boolean
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
                height={[props.doubleGridDevice ? '40px' : props.popover ? '50px' : '60px', props.popover ? '50px' : '60px', '60px', '60px']}
                width={[props.doubleGridDevice ? '40px' : props.popover ? '50px' : '60px', props.popover ? '50px' : '60px', '60px', '60px']}
                borderWidth={'1px'}
                borderColor={'#F3F3F3'}
            />
            <Box
                my={'auto'}
            >
                <Text
                    fontWeight={'black'}
                    fontSize={[props.doubleGridDevice ? '13px' : (isSmallView && props.popover) ? '15px' : (props.primaryText && props.primaryText?.length > 18) ? '17px' : '19px', props.popover ? '12px' : '18px', '18px']}
                    lineHeight={[props.doubleGridDevice ? '12px' : isSmallView && props.popover ? '16px' : '20px', props.popover ? '13px' : '19px', '20px']}
                    maxW={props.maxWidth && (props.doubleGridDevice || props.popover) && isSmallView ? props.maxWidth : ''}
                    isTruncated
                    color={'primaryBlack.text'}
                >
                    {props.primaryText}
                </Text>
                <Text
                    fontWeight={'normal'}
                    mt={'-1px'}
                    fontSize={[props.doubleGridDevice ? '10px' : isSmallView && props.popover ? '12px' : '14px', props.popover ? '10px' : '14px', '14px']}
                    maxW={props.maxWidth && (props.doubleGridDevice || props.popover) && isSmallView ? props.maxWidth : ''}
                    color={'#909090'}
                    isTruncated
                >
                    {props.secondaryText}
                </Text>
            </Box>

        </Box>
    )
}

export default ProfilePhoto