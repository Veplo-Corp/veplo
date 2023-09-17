import React from 'react'
import { ProductVariation } from '../../src/lib/apollo/generated/graphql';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { imageKitUrl } from '../utils/imageKitUrl';
import { Box, Tooltip, color } from '@chakra-ui/react';

const VariationPreview: React.FC<{ variations: ProductVariation[], dimension: number | string, space: number, showTooltip?: boolean, colorSelected: string, handleSelectColor: (color: string, size: undefined) => void }> =
    ({ variations, dimension, space, showTooltip, colorSelected, handleSelectColor }) => {



        return (
            <Box
                display={'flex'}
                gap={2}
            >
                {variations.map((variation, index) => {

                    return (
                        <Tooltip key={index} isDisabled={!showTooltip} label={variation?.color}>

                            <Box
                                borderWidth={1.5}
                                borderColor={colorSelected === variation.color ? 'black' : 'white'}
                                rounded={'lg'}
                                onClick={() => {
                                    if (!variation?.color) return
                                    handleSelectColor(variation?.color, undefined)
                                }}
                            >

                                <LazyLoadImage
                                    src={
                                        imageKitUrl(variation.photos?.[0], 237, 247)
                                    }
                                    alt={variation?.color + 'non trovato'}

                                    className={`aspect-[4.8/5] h-20 w-20 object-cover  cursor-pointer rounded-lg
                                
                            `}
                                />
                            </Box>
                        </Tooltip>

                    )
                })}

            </Box>
        )
    }

export default VariationPreview