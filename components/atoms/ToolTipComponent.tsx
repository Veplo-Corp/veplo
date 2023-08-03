import { Box, Tooltip } from '@chakra-ui/react'
import React, { FC } from 'react'

const ToolTipComponent: FC<{ label: string, icon: JSX.Element, smallView?: boolean }> = ({ label, icon, smallView }) => {
    return (<Tooltip label={label}
        bg='white'
        color='primaryBlack.text'
        borderRadius={'full'}
        boxShadow={'sm'}
        fontWeight={'medium'}
    >
        <Box
            position={'absolute'}
            zIndex={20}
            top={smallView ? 2 : 3.5}
            right={smallView ? 2 : '15px'}
            height={smallView ? 7 : 8}
            width={smallView ? 7 : 8}
            margin={'none'}
            padding={'none'}
            background={'white'}
            borderRadius={'full'}
            display={'flex'}
        >
            {icon}
        </Box>
    </Tooltip>)
}

export default ToolTipComponent