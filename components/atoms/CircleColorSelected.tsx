import React from 'react'
import { Box, Image, Tooltip } from '@chakra-ui/react'


const CircleColorSelected: React.FC<{ colors: { name: string, cssColor: string }[], dimension: number, space: number, showTooltip?: boolean, colorSelected: string, handleSelectColor: (color: string) => void }> = ({ colors, dimension, space, showTooltip, colorSelected, handleSelectColor }) => {



    return (
        <div className={`flex space-x-2`}>
            {colors.map((color, index) => {
                return (
                    <Tooltip key={index} isDisabled={!showTooltip} label={color.name}>
                        <Box
                            borderRadius={'100%'}
                            borderColor={colorSelected === color.name ? 'gray.700' : 'white'}
                            borderWidth={2.5}
                            display={'flex'}
                        //paddingTop={colorSelected === color.name ? 0 : 1}

                        >
                            <Box
                                cursor={'pointer'}
                                onClick={() => {
                                    handleSelectColor(color.name)
                                }}
                                h={dimension}
                                w={dimension}
                                borderRadius={'100%'}
                                bg={color.cssColor}
                                borderColor={'gray.200'}
                                style={{
                                    boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px'
                                }}
                                margin={0.5}
                            >
                            </Box>
                        </Box>


                    </Tooltip>

                )
            })}
        </div>
    )
}

export default CircleColorSelected