import { Divider } from '@chakra-ui/react'
import React from 'react';


const Text = ({element}) => {
    if (element.place_type[0] === 'address') {
        if (element.context[1].id.split('.')[0] === 'place') {
            return (
                <>
                    <p className='pl-2  text-md font-medium text-gray-800'>
                        {element.address !== undefined ? <span >{element.text_it + ' ' + element.address}</span> : <span>{element.text_it}</span>}, <span>{element.context[1].text_it}</span>
                    </p>
                    <Divider p={1} orientation='horizontal' />
                </>
            )
        } else if (element.context[1].id.split('.')[0] === 'locality') {
            return (
                <>
                    <p className='pl-2  text-md font-medium text-gray-800'>
                        {element.address !== undefined ? <span >{element.text_it + ' ' + element.address}</span> : <span>{element.text_it}</span>}, <span>{element.context[2].text_it}, {element.context[1].text_it}</span>
                    </p>
                    <Divider p={1} orientation='horizontal' />
                </>
            )
        }

    } else if (element.place_type[0] === 'place') {
        return (
            <>
                <p className='pl-2  text-md font-medium text-gray-800'>
                    {element.text_it}, {element.context[0].text_it}
                </p>
                <Divider p={1} orientation='horizontal' />
            </>
        )
    }
    else{
        return(<></>)
    }
}

const Address_text_handle = ({ element, handleEvent }) => {
    // return (
    //     <Divider p={1} orientation='horizontal' />

    // )
    console.log(element);
    return (
        <div key={element.id} onClick={() => handleEvent(element)} className=' pt-2 -ml-2  cursor-pointer hover:bg-gray-100 rounded-sm	'>
            <Text element={element} />
        </div>
    )



    

}

export default Address_text_handle