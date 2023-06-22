import { Box, Text } from '@chakra-ui/react'
import { Switch } from '@headlessui/react'
import React, { Fragment, useState } from 'react'

const ToogleComponent = () => {
    const [enabled, setEnabled] = useState(false)

    return (
        <Box height={12}
            borderWidth={1}
            borderColor={'gray.200'}
            rounded={'lg'}
            display={'flex'}
            textAlign={'center'}
            px={3}
            gap={3}
            onClick={() => setEnabled(prevstate => { return !prevstate })}
            cursor={'pointer'}
        >
            <Text
                my={'auto'}
                fontSize={'md'}
                fontWeight={'semibold'}
                color={'#3A3A3A'}
            >
                promozioni
            </Text>
            <Switch checked={enabled} as={Fragment}
            >
                {({ checked }) => (
                    /* Use the `checked` state to conditionally style the button. */
                    <button
                        className={`${checked ? 'bg-black' : 'bg-[#EFEFEF]'
                            } relative inline-flex h-[26px] w-[48px] items-center my-auto rounded-full`}
                    >
                        <span className="sr-only">promozioni</span>
                        <span
                            className={`${checked ? 'translate-x-6' : 'translate-x-1'
                                } inline-block h-[21px] w-[21px] transform rounded-full bg-white transition`}
                        />
                    </button>
                )}
            </Switch>
        </Box>
    )
}

export default ToogleComponent