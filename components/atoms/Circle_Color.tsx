import React from 'react'
import { Box, Image, Tooltip } from '@chakra-ui/react'


const Circle_Color: React.FC<{ colors: any, dimension: number, space: number, eventHanlder?: (color: string) => void, showTooltip?: boolean }> = ({ colors, dimension, space, eventHanlder, showTooltip }) => {

    return (
        <div className={`flex space-x-${space}`}>
            {colors.map((color: any) => {
                return (
                    <Tooltip key={color} isDisabled={!showTooltip} label={''}>
                        <Box onClick={() => {
                            if (eventHanlder) {
                                eventHanlder(color)
                            }
                        }} h={dimension} w={dimension} borderRadius={'100%'} bg={color}
                            //borderWidth={1} borderColor={'gray.200'}

                            borderWidth={'1px'}
                            borderColor={color !== '#FFFFFF' ? 'white' : '#D8D8D8'}
                        >
                        </Box>
                    </Tooltip>

                )
            })}
        </div>
    )
}

export default Circle_Color