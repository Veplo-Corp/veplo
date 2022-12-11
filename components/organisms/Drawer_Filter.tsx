import { Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, HStack, Select, Stack, Tag, TagCloseButton, TagLabel, Text, useDisclosure } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useRef, useState } from 'react'
import Input_Drawer from '../atoms/Input_Drawer'
import Select_multiple_options from '../atoms/Select_multiple_options'
import { BRANDS } from '../mook/brands'
import { Color, COLORS } from '../mook/colors'


const Drawer_Filter: FC<{ openDrawerMath: number }> = ({ openDrawerMath }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [showFilter, setshowFilter] = useState(true)
    const [filteredBrand, setFilteredBrand] = useState([])
    const [brandSelected, setBrandSelected] = useState<string[] | []>([])
    const [colorSelected, setColorSelected] = useState<Color[] | []>([])
    const [minAmount, setMinAmount] = useState<number>(0)
    const [maxAmount, setMaxAmount] = useState<number | 'Max'>('Max')
    const [normalHeightForBox, setNormalHeightForBox] = useState(true)

    const router = useRouter();
    const colors = useRef<Color[]>(COLORS)

    const priceGap = [
        5,
        10,
        15,
        20,
        25,
        50,
        100,
        150
    ]



    useEffect(() => {
        //console.log(openDrawerMath);
        if (openDrawerMath !== 1 && openDrawerMath > 0 && openDrawerMath !== undefined) {
            onOpen()
        }
    }, [openDrawerMath])


    const onChangeText = (query: string) => {
        setshowFilter(false)
        setFilteredBrand((prevstate: any) => {
            if (query.length === 0) {
                setshowFilter(true)
                setFilteredBrand([])

            }

            return query === '' || query.length < 3
                ? BRANDS.filter((value: string) =>
                    value
                        .toLowerCase()
                        .replace(/\s+/g, '')
                        .startsWith(query.toLowerCase().replace(/\s+/g, ''))
                ).slice(0, 700) : BRANDS.filter((value: string) =>
                    value
                        .toLowerCase()
                        .replace(/\s+/g, '')
                        .includes(query.toLowerCase().replace(/\s+/g, ''))
                )
        })

    }
    const selectBrand = (brand: string) => {

        setBrandSelected((prevstate) => {
            const brandAldreadyExist = prevstate.filter(state => state === brand)[0]
            if (brandAldreadyExist) return prevstate

            return [
                ...prevstate,
                brand
            ]
        })
        setFilteredBrand([])
        setshowFilter(true)
    }

    const removeBrandFromList = (brandToRemove: string) => {
        const newBrendsArray = brandSelected.filter(brand => brand !== brandToRemove)
        setBrandSelected(newBrendsArray)
    }

    // const removeColorFromList = (colorToRemove: Color) => {
    //     console.log(colorToRemove);

    //     const newColorsArray = colorSelected.filter(color => color.name !== colorToRemove.name)        
    //     setColorSelected(newColorsArray)
    // }

    const selectColor = (color: Color) => {
        console.log(colorSelected);

        setColorSelected(prevstate => {
            const colorAldreadyExist = prevstate.filter(state => state.name === color.name)[0]
            if (colorAldreadyExist) return prevstate.filter(state => state.name !== color.name)

            return [
                ...prevstate,
                color
            ]
        })


    }



    return (
        <Drawer

            onClose={onClose} isOpen={isOpen} size={['xs', 'md']}
            placement={'right'}>
            <DrawerOverlay />
            <DrawerContent
            >
                {/* <DrawerCloseButton size={'lg'} mt={'0'} /> */}
                <DrawerHeader borderWidth={0} borderBottomWidth={1} borderColor={'gray.200'} py={'3'} px={'4'}
                    className='flex justify-between'
                >
                    <p className="font-black text-2xl italic text-black-900 my-auto ">Filtri</p>
                    <Button
                        colorScheme={'green'}
                        borderRadius={30}
                        onClick={onClose}
                    >
                        APPLICA
                    </Button>
                </DrawerHeader>
                <DrawerBody
                    p={0}
                >
                    <Input_Drawer title='seleziona uno o più brand' onChangeText={onChangeText} />
                    {filteredBrand.length > 0 && !showFilter &&
                        filteredBrand.map((brand, id) => {
                            return (
                                <div
                                    onClick={() => {
                                        selectBrand(brand)
                                    }}
                                    key={id} className='bg-slate-50 py-2 px-6 h-12 border-0 border-b text-md font-medium flex cursor-pointer'>
                                    <p className='my-auto'>
                                        {brand}
                                    </p>
                                </div>
                            )
                        })
                    }
                    {showFilter &&
                        <>
                            <Box py={3} px={4} pb={2} borderBottomWidth={1} borderColor={'gray.200'}>
                                <h3 className='font-bold lg:text-lg text-md mb-2'>Brand</h3>
                                {brandSelected.map((brand, id) => (
                                    <Tag
                                        marginRight={1}
                                        marginBottom={2}
                                        size={'lg'}
                                        py={[2, 3]}
                                        px={[4]}
                                        key={id}
                                        fontSize={['xs', 'md']}
                                        borderRadius='full'
                                        variant='solid'
                                        bg={'white'}
                                        color={'gray.900'}
                                        borderColor={'gray.900'}
                                        borderWidth={1}
                                        _hover={{ bg: 'white' }}
                                        _focus={{
                                            bg: 'black.900'
                                        }}
                                        _active={{
                                            transform: 'scale(0.98)',
                                        }}

                                    >
                                        <TagLabel>{brand}</TagLabel>
                                        <TagCloseButton
                                            onClick={() => removeBrandFromList(brand)}
                                            fontSize={['xl', '2xl']}
                                            color={'black'}
                                        />
                                    </Tag>
                                ))}
                            </Box>
                            <Box py={3} px={4} pb={4} borderBottomWidth={1} borderColor={'gray.200'}>
                                <h3 className='font-bold text-md lg:text-lg mb-2'>Prezzo</h3>
                                <Flex gap={3}>
                                    <Box>
                                        <h5 className='font-medium text-sm lg:text-md mb-0'>Min</h5>
                                        <Select size={['md', 'lg']} width={'fit-content'}
                                            onChange={(event) => {

                                                setMinAmount(Number(event.target.value))
                                                if (Number(event.target.value) > Number(maxAmount)) {
                                                    setMaxAmount('Max')
                                                }
                                            }}
                                        >
                                            <option
                                                value={'0'}
                                            >0 €</option>
                                            {priceGap.map((price) => {
                                                return (<option
                                                    key={price}
                                                    value={price}
                                                >{price} €</option>)
                                            })}
                                        </Select>
                                    </Box>
                                    <Box>
                                        <h5 className='font-medium text-sm lg:text-md mb-0'>Max</h5>
                                        <Select value={maxAmount} size={['md', 'lg']} width={'fit-content'}
                                            onChange={(event) => {
                                                setMaxAmount(Number(event.target.value))
                                            }}
                                        >
                                            {priceGap.map((price) => {
                                                return (<option
                                                    key={price}
                                                    disabled={price < minAmount}
                                                    value={price}
                                                >{price} €</option>)
                                            })}
                                            <option
                                                value={'Max'}
                                            >MAX</option>
                                        </Select>
                                    </Box>
                                </Flex>
                            </Box>
                            <Box py={3} px={4}
                                pb={2} borderBottomWidth={1} borderColor={'gray.200'}


                            // height={'full'}
                            >
                                {/* <h3 className='font-bold lg:text-lg text-md mb-2'>Colore</h3>
                                    <Select_multiple_options values={colors.current} type={'color'}
                                        handleChangeState={(colors: any) => {
                                            setColorSelected(colors)
                                            console.log('eccolo');
                                        }}
                                    />
                                <div>
                                

                                </div> */}
                                <h3 className='font-bold text-md lg:text-lg mb-3'>Colore</h3>
                                <div>
                                    <div className='flex overflow-x-auto'>
                                        {COLORS.slice(0, 6).map((color: Color, id) => {
                                            return (
                                                <div className=" w-full cursor-pointer mr-2 "
                                                    key={id}
                                                >
                                                    <Tag
                                                        onClick={() => selectColor(color)}
                                                        width={'fit-content'}
                                                        marginRight={1}
                                                        marginBottom={2}
                                                        size={'lg'}
                                                        py={[2, 3]}
                                                        px={[4]}
                                                        fontSize={['xs', 'md']}
                                                        borderRadius='full'
                                                        variant='solid'
                                                        bg={`${colorSelected.find(element => element.name === color.name) ? 'black' : 'white'}`}
                                                        color={`${colorSelected.find(element => element.name === color.name) ? 'white' : 'black'}`}
                                                        borderColor={'gray.900'}
                                                        borderWidth={1}
                                                        _hover={{
                                                            bg: `${colorSelected.find(element => element.name === color.name) ? 'black' : 'white'}`
                                                        }}
                                                        _focus={{
                                                            bg: `${colorSelected.find(element => element.name === color.name) ? 'black' : 'white'}`
                                                        }}
                                                        _active={{
                                                            transform: 'scale(0.98)',
                                                        }}

                                                    >
                                                        <TagLabel>{color.name}</TagLabel>
                                                        <Box h={[5, 6]} w={[5, 6]} borderRadius={'100%'} bg={color.cssColor} borderWidth={1} borderColor={'gray.200'} ml={2}>
                                                        </Box>
                                                    </Tag>
                                                </div>
                                            )
                                        })}

                                    </div>
                                    <div className='mt-1'>
                                        <div className='flex overflow-x-auto'>
                                            {COLORS.slice(6).map((color: Color, id) => {
                                                return (
                                                    <div className=" w-full cursor-pointer mr-2 "
                                                        key={id}
                                                    >
                                                        <Tag
                                                            onClick={() => selectColor(color)}
                                                            width={'fit-content'}
                                                            marginRight={1}
                                                            marginBottom={2}
                                                            size={'lg'}
                                                            py={[2, 3]}
                                                            px={[4]}
                                                            fontSize={['xs', 'md']}
                                                            borderRadius='full'
                                                            variant='solid'
                                                            bg={`${colorSelected.find(element => element.name === color.name) ? 'black' : 'white'}`}
                                                            color={`${colorSelected.find(element => element.name === color.name) ? 'white' : 'black'}`}
                                                            borderColor={'gray.900'}
                                                            borderWidth={1}
                                                            _hover={{
                                                                bg: `${colorSelected.find(element => element.name === color.name) ? 'black' : 'white'}`
                                                            }}
                                                            _focus={{
                                                                bg: `${colorSelected.find(element => element.name === color.name) ? 'black' : 'white'}`
                                                            }}
                                                            _active={{
                                                                transform: 'scale(0.98)',
                                                            }}

                                                        >
                                                            <TagLabel>{color.name}</TagLabel>
                                                            <Box h={[5, 6]} w={[5, 6]} borderRadius={'100%'} bg={color.cssColor} borderWidth={1} borderColor={'gray.200'} ml={2}>
                                                            </Box>
                                                        </Tag>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>


                            </Box>
                        </>
                    }
                </DrawerBody>

            </DrawerContent>
        </Drawer>
    )
}

export default Drawer_Filter