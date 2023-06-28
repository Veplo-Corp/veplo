import { Box, Table, TableCaption, TableContainer, Tbody, Td, Text, Tfoot, Th, Thead, Tr } from '@chakra-ui/react'
import React, { FC, useEffect, useState } from 'react'
import { GUIDE_SIZES } from '../mook/sizeGuide'
import toUpperCaseFirstLetter from '../utils/uppercase_First_Letter'
import { CATEGORIES } from '../mook/categories'

const GuideSize: FC<{ macrocategorySizeGuide: any }> = ({ macrocategorySizeGuide }) => {


    //console.log(Object.keys(parameters?.sizes[0]));

    if (!macrocategorySizeGuide) return (
        <></>
    )


    return (
        <Box mt={2} minH={'50vh'}>
            {/* <Text
                mb={2}
                fontSize={['lg', 'xl']}
                fontWeight={'bold'}
            >{toUpperCaseFirstLetter(categories)}</Text> */}
            {macrocategorySizeGuide
                &&
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
        </Box>

    )
}

export default GuideSize