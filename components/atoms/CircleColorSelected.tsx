import React, { memo } from 'react'
import { Box, Image, Tooltip } from '@chakra-ui/react'


const CircleColorSelected: React.FC<{ colors: { name: string, cssColor: string }[], dimension: number | string, space: number, showTooltip?: boolean, colorSelected: string, handleSelectColor: (color: string, size: undefined) => void }> = ({ colors, dimension, space, showTooltip, colorSelected, handleSelectColor }) => {



    return (
        <div className={`flex space-x-1`}>
            {colors.map((color, index) => {
                return (
                    <Tooltip key={index} isDisabled={!showTooltip} label={color.name}>
                        <Box
                            borderRadius={'100%'}
                            borderColor={colorSelected.toLowerCase() === color.name.toLowerCase() && color.name.toLowerCase() !== 'bianco' ? color.cssColor :
                                colorSelected.toLowerCase() === color.name.toLowerCase() && color.name.toLowerCase() === 'bianco' ? '#D9D9D9' : 'white'}
                            borderWidth={3}
                            display={'flex'}
                        //paddingTop={colorSelected.toLowerCase() === color.name ? 0 : 1}

                        >
                            <Box
                                cursor={'pointer'}
                                onClick={() => {
                                    handleSelectColor(color.name, undefined)
                                }}
                                h={dimension}
                                w={dimension}
                                borderRadius={'100%'}
                                bg={color.cssColor}
                                borderColor={color.name.toLowerCase() === 'bianco' ? '#D9D9D9' : 'white'}
                                borderWidth={1}
                                // style={{
                                //     boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px'
                                // }}
                                margin={'3px'}
                            >
                            </Box>
                        </Box>
                    </Tooltip>
                )
            })}
        </div>
    )
}



export default memo(CircleColorSelected)