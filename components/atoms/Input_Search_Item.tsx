import { Box, Input, InputGroup, InputRightElement, Text } from '@chakra-ui/react'
import { Cancel, NavArrowRight, Search } from 'iconoir-react'
import React, { FC, useEffect, useRef, useState } from 'react'
import { useDebounceEffect } from '../utils/useDebounceEffect'
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

const Input_Search_Item: FC<{ placeholder: string, onConfirmText: (text: string) => void, textInput?: string, handleChangeValue: (text: string) => void }> = ({ placeholder, onConfirmText, textInput, handleChangeValue }) => {
    const [textSearched, setTextSearched] = useState('');
    const [isSearchBoxVisible, setisSearchBoxVisible] = useState(false)
    const router = useRouter()
    const onConfirm = (e: any) => {
        if (e.key === 'Enter' || e.key === undefined) {
            handleConfirm()
        }
    }


    const handleConfirm = () => {
        if (textSearched.length < 0) return
        setTextSearched('')
        setisSearchBoxVisible(false)
        onConfirmText(textSearched.trim())
        //setTextSearched('')
    }


    useDebounceEffect(async () => {

        if (textSearched.length <= 0) return
        console.log(textSearched);
        setisSearchBoxVisible(true)


    },
        500,
        [textSearched],
    )

    const handleChangeValueInput = (e: any) => {
        //console.log(e.target.value);
        setTextSearched(e.target.value)
        setisSearchBoxVisible(false)
        //handleChangeValue(e.target.value)
    }

    useEffect(() => {
        if (!router.isReady) return
        setisSearchBoxVisible(false)
        setTextSearched('')
    }, [router.query])


    return (
        <div className='w-auto md:w-56 xl:w-[28rem]' >
            <InputGroup
                className='relative w-full'
            >
                <Input
                    type='text'
                    value={textSearched}
                    maxLength={50}
                    borderWidth={1.5}
                    borderColor={'white'}

                    onKeyDown={onConfirm}
                    placeholder={placeholder}
                    _placeholder={{
                        color: '#A19F9F',
                        opacity: 1,
                        fontWeight: '500'
                    }}
                    borderRadius={10}
                    py={2}
                    pl={4}
                    size='md'
                    fontSize={'md'}
                    focusBorderColor='#F2F2F2'
                    _focus={{
                        background: 'white',
                    }}
                    fontWeight={'semibold'}
                    bg={'#F2F2F2'}
                    onChange={(e) => handleChangeValueInput(e)}
                />
                <InputRightElement
                    mr={1}
                    className='cursor-pointer'
                    color={'#A19F9F'}
                    onClick={() => {
                        setisSearchBoxVisible(false)
                        setTextSearched('')
                    }}
                    children={

                        textSearched.length > 0 ? (
                            <Cancel
                                className="w-7 h-7"
                                strokeWidth={2}
                            />

                        ) : (
                            <Search
                                className="w-6 h-6"
                                strokeWidth={2}
                            />
                        )


                    }
                />
            </InputGroup>
            <AnimatePresence>
                {isSearchBoxVisible && textSearched.length > 0 && (
                    <motion.div
                        initial={{ opacity: 1, scale: 0.9 }} // Stato iniziale
                        animate={{ opacity: 1, scale: 1 }} // Stato animato
                        //exit={{ opacity: 0.5, scale: 0.8 }} // Stato di uscita
                        transition={{ duration: 0.1 }} // Durata della transizione
                    >
                        <Box
                            position={'absolute'}
                            mt={'8px'}
                            borderRadius={15}
                            p={4}
                            py={4}
                            className='w-auto md:w-56 xl:w-[28rem]'
                            bg={'white'}
                            display={'flex'}
                            justifyContent={'space-between'}
                            cursor={'pointer'}
                            _active={{
                                transform: 'scale(0.99)',
                            }}
                            borderWidth={2}
                            borderColor='#F2F2F2'
                            onClick={handleConfirm}
                        >
                            <Box>
                                <Text
                                    fontSize={'xs'}
                                    fontWeight={'medium'}
                                    textColor={'#909090'}
                                    lineHeight={1.1}
                                >
                                    Ricerca
                                </Text>
                                <Text
                                    fontSize={'md'}
                                    fontWeight={'semibold'}
                                >
                                    {textSearched}
                                </Text>
                            </Box>
                            <NavArrowRight
                                height={35}
                                width={35}
                                strokeWidth={1.5}
                                className='my-auto'
                            />
                        </Box>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Input_Search_Item