import React, { useRef, useState } from 'react'
import { Button } from '@chakra-ui/react'
import BlackButton from '../atoms/BlackButton'
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react'

const Drawer_Add_Image = () => {
    const [isOpen, setisOpen] = useState(true);
    const hiddenFileInput = useRef(null);

    const onImageChange = () => {

    }

    // Programatically click the hidden file input element
    // when the Button component is clicked
    const handleClick = (event) => {
        hiddenFileInput.current.click();
    };

    return (

        <Drawer
            isOpen={isOpen}
            placement='top'
            size='full'
            onClose={() => setisOpen(false)}
        >
            <DrawerOverlay />
            <DrawerContent>

                <DrawerHeader padding={4} className='flex justify-between'>
                    <h3 className='md:ml-12 italic text-sm md:text-3xl font-black my-auto hidden md:flex'>
                        Inserisci le immagini del prodotto
                    </h3>
                    <svg onClick={() => setisOpen(false)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 md:hidden my-auto">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>

                    <div className='md:mr-16' >
                        <BlackButton
                            onClick={handleClick}
                            element='aggiungi immagine'
                            borderRadius={5}
                            width={200}
                            heigth={12}
                            size={'sm'}
                            typeButton={'button'}
                            disabled={false} />
                    </div>
                    <input
                        ref={hiddenFileInput}
                        type="file" id="file" multiple accept="image/*" 
                        className='hidden'
                        onChange={onImageChange} />
                </DrawerHeader>
                <DrawerBody>

                </DrawerBody>
                <DrawerFooter padding={0}>
                    <footer className="w-full bg-whith items-center py-4 px-6 md:px-10 border-t	border-inherit	">
                        <div className='flex justify-between'>
                            <div className='hidden md:flex'>
                                <Button
                                    onClick={() => setisOpen(false)}
                                    borderRadius={5}
                                    width={200}
                                    height={12}
                                    size={'sm'}
                                    variant='outline'
                                    colorScheme={'blackAlpha'}
                                    color={'blackAlpha.900'}
                                    disabled={false} >
                                    indietro
                                </Button>
                            </div>

                            <div className='flex justify-between gap-6  md:gap-4'>
                                <p className='my-auto	italic text-sm md:text-base	font-medium	'>
                                    aggiungi minimo 3 foto per confermare
                                </p>
                                <BlackButton
                                    element='conferma'
                                    borderRadius={5}
                                    width={200}
                                    heigth={12}
                                    size={'sm'}
                                    typeButton={'button'}
                                    disabled={true} />
                            </div>
                        </div>

                    </footer>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default Drawer_Add_Image