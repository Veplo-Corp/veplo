import React from 'react'
import ModalReausable from './ModalReausable'
import { useDispatch, useSelector } from 'react-redux'
import { GlobalModal, closeModal } from '../../src/store/reducers/globalModal'
import { Text } from '@chakra-ui/react'
import { WarningCompoment } from './WarningsComponent'

const ModalWrapper = () => {
    const modal: GlobalModal = useSelector((state: any) => state.modal.modal);
    const dispatch = useDispatch();

    const closeModalHandler = () => {
        dispatch(
            closeModal()
        );
    }

    return (
        <ModalReausable
            title={modal.title ? modal.title : 'Errore'}
            closeModal={closeModalHandler}
            isOpen={modal.show ? modal.show : false}>
            {modal.description && <Text
                mr={5}
                mt={6}
                mb={3}
                fontSize={'18px'}
                fontWeight={'normal'}
                color={'secondaryBlack.text'}
            >
                {modal.description}
            </Text>}
            {modal.descriptionComponent === 'Warnings' && <WarningCompoment
                confirmButton={closeModalHandler}
                warnings={modal.props}
            />}


        </ModalReausable>
    )
}

export default ModalWrapper