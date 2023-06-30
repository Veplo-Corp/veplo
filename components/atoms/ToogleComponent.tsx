import { Box, Text } from '@chakra-ui/react'
import { Switch } from '@headlessui/react'
import React, { FC, Fragment, useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import { GTMEventType, VeploGTMEvent } from '../../src/lib/analytics/eventTypes';
import { useAnalytics } from '../../src/lib/analytics/hooks/useAnalytics';
import { gtag } from '../../src/lib/analytics/gtag';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { Firebase_User } from '../../src/interfaces/firebase_user.interface';

const ToogleComponent: FC<{ value: boolean | undefined, handleChangeToogle: (toogle: string) => void, modifyToogleInComponent: boolean }> = ({ value, handleChangeToogle, modifyToogleInComponent }) => {
    const [enabled, setEnabled] = useState(false)
    const user: Firebase_User = useSelector((state: any) => state.user.user);


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
                if (state === 'true') {
                    return gtag({
                        command: GTMEventType.saleToggle,
                        args: {
                            label: 'Click on sale toggle',
                            gender: user.genderSelected === 'm' ? 'male' : user.genderSelected === 'f' ? 'female' : 'not_speficied'
                        }
                    })
                }
            }}
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
                        className={`${checked ? 'bg-[#FF5A78]' : 'bg-[#EFEFEF]'
                            } relative inline-flex h-[25px] w-[46px] items-center my-auto rounded-full`}
                    >
                        <span className="sr-only">promozioni</span>
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