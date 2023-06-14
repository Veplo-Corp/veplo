import { Box, Table, TableCaption, TableContainer, Tbody, Td, Text, Tfoot, Th, Thead, Tr } from '@chakra-ui/react'
import React, { FC, useEffect, useState } from 'react'
import { GUIDE_SIZES } from '../mook/sizeGuide'
import toUpperCaseFirstLetter from '../utils/uppercase_First_Letter'

const GuideSize: FC<{ gender: 'f' | 'm', macrocategory: string }> = ({ gender, macrocategory }) => {

    const [parameters, setParameters] = useState<any>()
    console.log(macrocategory);

    useEffect(() => {
        const genderSelected = gender === 'm' ? 1 : 0;
        const parameters = Object.values(GUIDE_SIZES)[genderSelected].find(value => value.category.includes(macrocategory.toLowerCase()))
            ?
            Object.values(GUIDE_SIZES)[genderSelected].find(value => value.category.includes(macrocategory.toLowerCase()))
            :
            Object.values(GUIDE_SIZES)[genderSelected][1]

        console.log(parameters);
        setParameters(parameters)

    }, [macrocategory, gender])

    //console.log(Object.keys(parameters?.sizes[0]));


    // return (
    //     <></>
    // )

    return (
        <Box mt={2} minH={'50vh'}>
            {/* <Text
                mb={2}
                fontSize={['lg', 'xl']}
                fontWeight={'bold'}
            >{toUpperCaseFirstLetter(categories)}</Text> */}
            {parameters
                &&
                <TableContainer >
                    <Table variant='striped' colorScheme='gray'>
                        <Thead>
                            <Tr>
                                {Object.keys(parameters?.sizes[0]).map((title: any) => {
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

                            {parameters?.sizes.map((element: any) => {
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