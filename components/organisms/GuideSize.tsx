import { Box, Table, TableCaption, TableContainer, Tbody, Td, Text, Tfoot, Th, Thead, Tr } from '@chakra-ui/react'
import React, { FC, useEffect, useState } from 'react'
import { GUIDE_SIZES } from '../mook/sizeGuide'
import toUpperCaseFirstLetter from '../utils/uppercase_First_Letter'
import { CATEGORIES } from '../mook/categories'
import { imageKitUrl } from '../utils/imageKitUrl'

const GuideSize: FC<{ macrocategorySizeGuide: any, sizeGuideTemplatePhotoUrl?: string | null | undefined }> = ({ macrocategorySizeGuide, sizeGuideTemplatePhotoUrl }) => {






    return (
        <Box >
            {/* <Text
                mb={2}
                fontSize={['lg', 'xl']}
                fontWeight={'bold'}
            >{toUpperCaseFirstLetter(categories)}</Text> */}
            {macrocategorySizeGuide
                && !sizeGuideTemplatePhotoUrl &&
                <TableContainer >
                    <Table variant='striped' colorScheme='gray'>
                        <Thead>
                            <Tr>
                                {Object.keys(macrocategorySizeGuide[0]).map((title: any) => {
                                    return (
                                        <Th
                                            px={[0, 5]}
                                            textAlign={['center', 'center']}
                                            key={title}
                                            fontSize={['xs', 'sm']}
                                        >{title}</Th>
                                    )
                                })}

                            </Tr>
                        </Thead>
                        <Tbody>

                            {macrocategorySizeGuide.map((element: any) => {
                                return (
                                    <Tr key={element.EU}>
                                        {Object.values(element).map((value: any, index) => (
                                            <Td
                                                fontSize={['xs', 'sm']}
                                                fontWeight={'medium'}
                                                px={[0, 5]}
                                                textAlign={['center', 'center']}
                                                key={index}>{value}</Td>
                                        ))}
                                    </Tr>

                                )
                            })}

                        </Tbody>
                    </Table>
                </TableContainer>
            }
            {
                sizeGuideTemplatePhotoUrl &&
                <img
                    className='min-w-[30vw] max-h-[75vh] lg:max-w-[90vw] object-contain'
                    src={imageKitUrl(sizeGuideTemplatePhotoUrl)}
                />
            }
        </Box>

    )
}

export default GuideSize