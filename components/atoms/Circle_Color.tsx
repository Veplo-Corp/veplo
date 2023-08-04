import React from 'react'
import { Box, Image, Tooltip } from '@chakra-ui/react'
import { COLORS_TYPES } from '../mook/productParameters/colors'


const Circle_Color: React.FC<{ handleColorFocused?: (color: string) => void, colors: any, dimension: number | string, space: number, eventHanlder?: (color: string) => void, showTooltip?: boolean }> = ({ handleColorFocused, colors, dimension, space, eventHanlder, showTooltip }) => {

    return (
        <Box
            display={'flex'}
            gap={1}
        >
            {colors.map((color: any) => {
                return (
                    <Tooltip key={color} isDisabled={!showTooltip} label={''}>
                        <Box onClick={() => {

                            if (eventHanlder) {

                                eventHanlder(color)
                            }
                        }} h={dimension} w={dimension} borderRadius={'100%'} bg={color}
                            //borderWidth={1} borderColor={'gray.200'}
                            onMouseEnter={() => {
                                if (handleColorFocused) {
                                    const colorsName = COLORS_TYPES[0].type.find(colorElement => colorElement.cssColor === color)?.name

                                    if (!colorsName) return
                                    handleColorFocused(colorsName)
                                }
                            }}
                            borderWidth={'1px'}
                            borderColor={color !== '#FFFFFF' ? 'white' : '#D8D8D8'}
                        >
                        </Box>
                    </Tooltip>

                )
            })}
        </Box>
    )
}

export default Circle_Color