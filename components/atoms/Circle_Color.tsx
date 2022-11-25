import React from 'react'
import { Box, Image } from '@chakra-ui/react'


const Circle_Color: React.FC<{colors:any, dimension:number, space:number, eventHanlder?:any}> = ({colors, dimension, space, eventHanlder}) => {
    
    return (
        <div className={`flex space-x-${space}`}>
            {colors.map((color) => {
                return (
                    <Box onClick={()=> {
                        if(eventHanlder){
                            eventHanlder()
                        }
                    }} key={color} h={dimension} w={dimension} borderRadius={'100%'} bg={color} borderWidth={1} borderColor={'gray.200'}>
                    </Box>
                )
            })}
        </div>
    )
}

export default Circle_Color