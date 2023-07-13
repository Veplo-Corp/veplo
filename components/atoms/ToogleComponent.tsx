import { Box, Text } from '@chakra-ui/react'
import { Switch } from '@headlessui/react'
import React, { FC, Fragment, ReactNode, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

const ToogleComponent: FC<{ text: ReactNode | string, toogleColor?: string, value: boolean | undefined, handleChangeToogle: (toogle: string) => void, modifyToogleInComponent: boolean }> = ({ text, toogleColor, value, handleChangeToogle, modifyToogleInComponent }) => {
    const [enabled, setEnabled] = useState(false)


    useEffect(() => {
        if (value === undefined) return setEnabled(false)
        return setEnabled(value)
    }, [value])



    return (

        <Box height={12}
            borderWidth={1}
            borderColor={'gray.200'}
            rounded={'10px'}
            display={'flex'}
            textAlign={'center'}
            px={3}
            gap={3}
            onClick={() => {
                if (modifyToogleInComponent) setEnabled(prevstate => { return !prevstate })
                const state = !enabled === true ? 'true' : 'false'
                handleChangeToogle(state)

            }}
            cursor={'pointer'}
        >
            <Box
                fontSize={'md'}
                fontWeight={'semibold'}
                color={'#3A3A3A'}
                my={'auto'}
            >
                {text}
            </Box>

            <Switch checked={enabled} as={Fragment}
            >
                {({ checked }) => (
                    /* Use the `checked` state to conditionally style the button. */
                    <button
                        className={`${checked ? toogleColor ? toogleColor : 'bg-[#FF5A78]' : 'bg-[#EFEFEF]'
                            } relative inline-flex h-[25px] w-[46px] items-center my-auto rounded-full`}
                    >
                        <span className="sr-only">{text}</span>
                        <span
                            className={`${checked ? 'translate-x-6' : 'translate-x-1'
                                } inline-block h-[18px] w-[18px] transform rounded-full bg-white transition`}
                        />
                    </button>
                )}
            </Switch>
        </Box>
    )
}

export default ToogleComponent