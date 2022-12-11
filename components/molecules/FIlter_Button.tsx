import { Box, Center, HStack, VStack } from '@chakra-ui/react'
import MobileDetect from 'mobile-detect';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useState } from 'react'
import Drawer_Filter from '../organisms/Drawer_Filter';

const FIlter_Button: FC<{gender:string, macrocategory:string}> = ({gender, macrocategory}) => {
    const [bottomPadding, setbottomPadding] = useState([4, 8])
    const [openDrawer, setOpenDrawer] = useState(1)
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            let type = new MobileDetect(window.navigator.userAgent)
            //console.log(type);            
            if (type.os() === "AndroidOS" || type.os() === 'iOS') {
                const newHeight = window.innerHeight;
                const screenHeight = screen.availHeight;
                setbottomPadding([screenHeight - newHeight, 8])
                const updateWindowDimensions = () => {
                    const newHeight = window.innerHeight;
                    const screenHeight = screen.availHeight;
                    console.log(newHeight);
                    console.log(screenHeight);
                    console.log(screenHeight - newHeight);
                    setbottomPadding([screenHeight - newHeight, 8])
                    console.log("updating height");
                };
                window.addEventListener("resize", updateWindowDimensions);
                return () => window.removeEventListener("resize", updateWindowDimensions)
            }
        }
    }, []);

    return (
        <>
            <Drawer_Filter openDrawerMath={openDrawer} gender={gender} macrocategory={macrocategory} />
            <Box
                boxShadow={'rgba(0, 0, 0, 0.35) 0px 5px 15px'}
                width={70}
                height={70}
                backgroundColor={'gray.900'}
                borderRadius={'full'}
                _active={{
                    transform: 'scale(0.98)',
                }}
                className='cursor-pointer'
                position={'fixed'}
                bottom={[4, 8]}
                right={[4, 10]}
                onClick={() => {
                    console.log(router.asPath);

                    setOpenDrawer(Math.random())
                    
                }}
            >
                <Center height={'full'} color={'white'}

                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                    </svg>
                </Center>
            </Box>
        </>


    )
}

export default FIlter_Button