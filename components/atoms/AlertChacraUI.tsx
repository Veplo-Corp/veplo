import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Box,
} from '@chakra-ui/react'

import React, { FC } from 'react'


type Props = {
    alert: 'error' | 'success' | 'warning' | 'info',
    title: string,
    subtitle: string
}

const AlertChacraUI: FC<Props> = ({ ...props }) => {
    return (
        <Alert
            m={'auto'}
            status={props.alert}
            display={['grid', 'flex']}
            p={4}
        >
            <AlertIcon
                display={['none', 'flex']}
                boxSize='40px' m={'auto'}
            />
            <Box
                width={'full'}
                ml={[0, 4]}
            >
                <AlertTitle
                    mb={1} fontSize={['md', 'lg']}>
                    {props.title}
                </AlertTitle>
                <AlertDescription
                    fontSize={['sm', 'md']}
                >
                    {props.subtitle}
                </AlertDescription>
            </Box>

        </Alert>
    )
}

export default AlertChacraUI