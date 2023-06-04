import React, { FC } from 'react'
import { Box, Button, Center, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Text, useDisclosure, VStack } from '@chakra-ui/react'
import { Cancel } from 'iconoir-react'

const DrawerFilter: FC<{ isOpen: boolean, closeDrawer: () => void }> = ({ isOpen, closeDrawer }) => {
    return (
        <Drawer
            isOpen={isOpen}
            placement='bottom'
            size={'lg'}

            onClose={closeDrawer}
        >
            <DrawerOverlay />
            <DrawerContent
                //borderRadius={'3xl'}
                borderTopRadius={'3xl'}
            >

                <DrawerHeader
                    color={'secondaryBlack.text'}
                    py={5} px={8} fontSize={'24px'} fontWeight={'extrabold'}
                    display={'flex'}
                    justifyContent={'space-between'}
                >
                    <Text
                        marginY={'auto'}
                    >
                        Filtri
                    </Text>

                    <Button
                        borderRadius={'full'}
                        h={12}
                        w={12}
                        p={0}
                        variant={'grayPrimary'}
                        onClick={closeDrawer}
                    >
                        <Cancel
                            strokeWidth={2.8}
                            className='w-8 h-8'
                        />
                    </Button>

                </DrawerHeader>
                <DrawerBody
                    minH={'35vh'}
                >


                </DrawerBody>
            </DrawerContent>

        </Drawer >
    )
}

export default DrawerFilter