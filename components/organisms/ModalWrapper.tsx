import React from 'react'
import ModalReausable from './ModalReausable'
import { useDispatch, useSelector } from 'react-redux'
import { GlobalModal, closeModal } from '../../src/store/reducers/globalModal'
import { Text } from '@chakra-ui/react'

const ModalWrapper = () => {
    const modal: GlobalModal = useSelector((state: any) => state.modal.modal);
    const dispatch = useDispatch();

    console.log(modal);

    return (
        <ModalReausable
            title={modal.title ? modal.title : 'Errore'}
            closeModal={() => {
                dispatch(
                    closeModal()
                );
            }}
            isOpen={modal.show ? modal.show : false}>
            {typeof modal.description === 'string' ? <Text
                mr={5}
                mt={6}
                mb={3}
                fontSize={'18px'}
                fontWeight={'normal'}
                color={'secondaryBlack.text'}
            >
                {modal.description}
            </Text>
                :
                <>
                    {modal.description}
                </>
            }
        </ModalReausable>
    )
}

export default ModalWrapper