import { Box, Button, ButtonGroup, Center, IconButton, Input, Spinner, Text } from '@chakra-ui/react'
import { MagnifyingGlassIcon, PencilIcon, PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/20/solid'
import React, { FC, useEffect, useRef, useState } from 'react'
import { resizeFile } from '../utils/resizeFile';
import ModalReausable from './ModalReausable';
import GET_SIZEGUIDE_TEMPLATES from '../../src/lib/apollo/queries/getSizeGuideTemplates';
import ADD_SIZE_GUIDE_TEMPLATE from '../../src/lib/apollo/mutations/addSizeGuideTemplate';
import EDIT_SIZE_GUIDE_TEMPLATE from '../../src/lib/apollo/mutations/editSizeGuideTemplate';
import DELETE_SIZE_GUIDE_TEMPLATE from '../../src/lib/apollo/mutations/deleteSizeGuideTemplate';


import { useMutation, useQuery } from '@apollo/client';
import { uploadImage } from '../../src/lib/upload/uploadImage';
import { UploadEventType } from '../../src/lib/upload/UploadEventTypes';
import { Image } from '../../src/pages/shop/home/crea-shop';
import { Trash } from 'iconoir-react';
import { imageKitUrl } from '../utils/imageKitUrl';
import { SizeGuideTemplate } from '../../src/lib/apollo/generated/graphql';
import { ToastOpen } from '../utils/Toast';

const SizeGuidesComponent: FC<{ id: string, isSelectable?: boolean, onChangeSizeGuide?: (url: string | undefined) => void, defaultTemplateGuideSelectionPhoto?: string | undefined | null, productId?: string | null | undefined, handleEditSizeGuideTemplateFromProduct?: (photoUrl: string) => void }> = ({ id, isSelectable, onChangeSizeGuide, defaultTemplateGuideSelectionPhoto, productId, handleEditSizeGuideTemplateFromProduct }) => {
  const hiddenFileInputSizeGuideImage = useRef<any>(null);
  const hiddenEditFileInputSizeGuideImage = useRef<any>(null);
  const { addToast } = ToastOpen();
  const [sizeGuideSelected, setSizeGuideSelected] = useState<SizeGuideTemplate | undefined>()
  const [titleSizeGuide, settitleSizeGuide] = useState<string>('')
  const [newImage, setNewImage] = useState<Image | undefined>()
  const [newImageEdit, setNewImageEdit] = useState<Image | undefined>()
  const [isTitleAlreadyExisting, setIsTitleAlreadyExisting] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [sizeGuideTemplateToEdit, setSizeGuideTemplateToEdit] = useState<SizeGuideTemplate | undefined>()
  const [isSizeGuideTemplateModalOpen, setIsSizeGuideTemplateModalOpen] = useState<boolean>(false)

  const [isModalDeleteSizeGuide, setIsModalDeleteSizeGuide] = useState<string | undefined>()

  const [imageURLForPreview, setImageURLForPreview] = useState<string | undefined>()

  const { loading, error, data } = useQuery(GET_SIZEGUIDE_TEMPLATES, {
    variables: {
      id
    },
  });

  const [addSizeGuideTemplate, addSizeGuideStatus] = useMutation(ADD_SIZE_GUIDE_TEMPLATE, {
    awaitRefetchQueries: true,
    refetchQueries: [{
      query: GET_SIZEGUIDE_TEMPLATES,
      variables: {
        id
      }
    }],
  });

  const [editSizeGuideTemplate] = useMutation(EDIT_SIZE_GUIDE_TEMPLATE, {
    awaitRefetchQueries: true,
    refetchQueries: [{
      query: GET_SIZEGUIDE_TEMPLATES,
      variables: {
        id
      }
    }],
  });

  const [deleteSizeGuideTemplate] = useMutation(DELETE_SIZE_GUIDE_TEMPLATE, {
    awaitRefetchQueries: true,
    refetchQueries: [{
      query: GET_SIZEGUIDE_TEMPLATES,
      variables: {
        id
      }
    }],
  });

  useEffect(() => {
    if (typeof defaultTemplateGuideSelectionPhoto === 'string') {
      const guideSizeTelmpaltes = data?.shop?.sizeGuideTemplates
      const sizeTemplate = guideSizeTelmpaltes?.filter(element => element.photo === defaultTemplateGuideSelectionPhoto)
      if (sizeTemplate?.[0]) {
        setSizeGuideSelected(sizeTemplate[0])
      }
    }
  }, [data])




  const handleClickInputFile = () => {
    if (!hiddenFileInputSizeGuideImage.current) return
    hiddenFileInputSizeGuideImage.current.click();
  };

  const handleClickInputFileEditImage = (sizeGuide: SizeGuideTemplate) => {
    if (!hiddenEditFileInputSizeGuideImage.current) return
    setSizeGuideTemplateToEdit(sizeGuide)
    hiddenEditFileInputSizeGuideImage.current.click();
  };

  const onSelectFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    hiddenFileInputSizeGuideImage.current.click();
    if (e.target.files) {
      try {
        const file = e.target.files[0];
        const base64 = await resizeFile(file);
        if (typeof base64 !== 'string') return
        fetch(base64)
          .then(res => res.blob())
          .then((blob) => {
            const url = URL.createObjectURL(blob)
            const file = new File([blob], "photo1", {
              type: 'image/jpeg'
            });
            const newImage: Image = {
              type: 'image/jpeg',
              blob: blob,
              url: url,
              file: file,
            }
            setNewImage(newImage)
          }
          )


      } catch (err) {

      }
    }
    else {

    }
  }

  const handleAddSizeGuideTemplate = async () => {

    if (titleSizeGuide.length <= 0 || !newImage) return
    try {
      setIsLoading(true)
      const imageUrlDb = await uploadImage(newImage.file, UploadEventType.sizeGuide)
      await addSizeGuideTemplate({
        variables: {
          shopId: id,
          options: {
            title: titleSizeGuide,
            photo: imageUrlDb.id
          }
        }
      })
      setNewImage(undefined)
      settitleSizeGuide('')
      setIsLoading(false)
      addToast({
        position: 'top',
        title: 'Guida alle taglie aggiunta con successo',
        status: 'success',
        duration: 6000,
        isClosable: true
      })
    }
    catch (e) {
      setIsLoading(false)
      addToast({
        position: 'top',
        title: "Errore imprevisto, se persiste contatta l'assistenza",
        status: 'error',
        duration: 6000,
        isClosable: true
      })
      console.log(e);

    }
  }

  const handleSeePreviewImage = (imageURL: string) => {
    setImageURLForPreview(imageURL)
    setIsModalOpen(true)
  }

  const onSelectFileInputEditImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    hiddenEditFileInputSizeGuideImage.current.click();
    if (e.target.files) {
      try {
        const file = e.target.files[0];
        const base64 = await resizeFile(file);
        if (typeof base64 !== 'string') return
        fetch(base64)
          .then(res => res.blob())
          .then((blob) => {
            const url = URL.createObjectURL(blob)
            const file = new File([blob], "photo1", {
              type: 'image/jpeg'
            });
            const newImage: Image = {
              type: 'image/jpeg',
              blob: blob,
              url: url,
              file: file,
            }
            setNewImageEdit(newImage)
            setIsSizeGuideTemplateModalOpen(true)

          }
          )


      } catch (err) {

      }
    }
    else {

    }
  }

  const editImageSizeGuide = async () => {
    const newSizeGuideTemplateToEdit = { ...sizeGuideTemplateToEdit }

    if (!newImageEdit || !newSizeGuideTemplateToEdit?.title || !newSizeGuideTemplateToEdit?.photo) return
    try {
      setIsLoading(true)
      const imageUrlDb = await uploadImage(newImageEdit.file, UploadEventType.sizeGuide)

      await editSizeGuideTemplate({
        variables: {
          title: newSizeGuideTemplateToEdit?.title,
          shopId: id,
          options: {
            title: newSizeGuideTemplateToEdit?.title,
            photo: imageUrlDb.id
          }
        }
      })
      setNewImageEdit(undefined)
      setSizeGuideTemplateToEdit(undefined)
      setIsSizeGuideTemplateModalOpen(false)
      setIsLoading(false)
      addToast({
        position: 'top',
        title: 'Guida alle taglie aggiornata',
        status: 'success',
        duration: 6000,
        isClosable: true
      })
    }
    catch (e) {
      setIsLoading(false)
      setIsSizeGuideTemplateModalOpen(false)
      addToast({
        position: 'top',
        title: "Errore imprevisto, se persiste contatta l'assistenza",
        status: 'error',
        duration: 6000,
        isClosable: true
      })

    }
  }

  const handleDeleteSizeGuide = async (title: string) => {
    setIsModalDeleteSizeGuide(title)
  }



  return (
    <>
      <Box
        paddingY={7}
        paddingX={[3, 7]} borderWidth={1}
        borderColor={'gray.300'}
        borderRadius={'2xl'}
      >
        {!isLoading ?
          (<>

            {/* <h3 className='text-md md:text-xl font-extrabold mb-6'>
          Inserisci una nuova guida alle taglie
        </h3> */}

            <Box
              display={'flex'}
              width={'full'}
              justifyContent={'space-between'}
              gap={3}
            >
              <Box
                width={'full'}
                className='w-3/4'
                paddingY={3}
                paddingX={4}
                borderWidth={1}
                borderColor={'gray.300'}
                borderRadius={'2xl'}
                display={'flex'}
                justifyContent={'space-between'}
              >

                <Input variant='unstyled'
                  maxWidth={64}

                  value={titleSizeGuide}
                  maxLength={35}
                  onChange={(e) => {
                    settitleSizeGuide(e.target.value)
                    if (
                      data?.shop?.sizeGuideTemplates?.filter(sizeGuide => sizeGuide.title === e.target.value.trim()) && data?.shop?.sizeGuideTemplates?.filter(sizeGuide => sizeGuide.title === e.target.value.trim()).length > 0
                    ) {
                      setIsTitleAlreadyExisting(true)
                    } else {
                      setIsTitleAlreadyExisting(false)
                    }
                  }}
                  placeholder='Aggiungi nuova guida' />


                <Box
                  display={'flex'}
                  gap={3}
                >
                  <Text
                    width={'fit-content'}
                    onClick={handleClickInputFile}
                    cursor={'pointer'}
                    color={'primary.bg'}
                    fontSize={'sm'}
                    my={'auto'}
                  >
                    {newImage ? 'modifica immagine' : 'Carica immagine'}
                  </Text>
                  {newImage && <MagnifyingGlassIcon
                    cursor={'pointer'}
                    className='my-auto'
                    color='#FF5A78'
                    onClick={() => {
                      handleSeePreviewImage(newImage.url)
                    }}
                    height={16}
                  />}
                </Box>

                <Input
                  type="file" id="file" multiple
                  accept="image/*"
                  className='hidden'
                  ref={hiddenFileInputSizeGuideImage}
                  onChange={(e) => {
                    onSelectFileInput(e);
                  }}
                />
              </Box>
              <Button
                isDisabled={titleSizeGuide.length <= 0 || !newImage || isTitleAlreadyExisting || addSizeGuideStatus.loading || isLoading}
                height={12}
                width={14}
                _disabled={{
                  bg: "#D9D9D9"
                }}
                _hover={{
                }}
                variant={'primary'}
                padding={0}
                marginY={'auto'}
                borderRadius={'full'}
                onClick={handleAddSizeGuideTemplate}

              >
                {!isLoading ?
                  (<PlusIcon
                    width={32}
                  />)

                  : (
                    <Spinner
                      thickness='4px'
                      speed='0.65s'
                      emptyColor='gray.200'
                      color='white'
                      size='md'
                    />
                  )}
              </Button>

            </Box>
            {isTitleAlreadyExisting && <Text
              fontSize={'sm'}
              color={'cancelTag.bg'}
            >
              Nome già esistente
            </Text>}
            <h3 className='text-md md:text-xl font-extrabold mt-6 mb-2'>
              {isSelectable ? 'seleziona una guida' : 'le tue guide'}
            </h3>
            <Box
              display={'grid'}
              gap={3}
            >
              {data?.shop?.sizeGuideTemplates?.map((sizeGuide) => {
                return (<Box
                  key={sizeGuide.title}
                  display={'flex'}
                  width={'full'}
                  justifyContent={'space-between'}
                  gap={3}
                >

                  <Box
                    width={'full'}

                    paddingY={3}
                    paddingX={4}
                    borderWidth={1}
                    borderColor={'gray.300'}
                    borderRadius={'2xl'}
                    display={'flex'}

                    justifyContent={'space-between'}
                  >
                    <Box
                      display={'flex'}
                      gap={3}
                      cursor={'pointer'}
                      width={'full'}
                      onClick={() => {
                        if (!sizeGuide.title || !sizeGuide.photo) return
                        if (sizeGuide.title === sizeGuideSelected?.title) {
                          setSizeGuideSelected(undefined)
                          if (onChangeSizeGuide) {
                            onChangeSizeGuide(undefined)
                          }
                          return
                        }
                        setSizeGuideSelected(sizeGuide)
                        if (onChangeSizeGuide) {
                          onChangeSizeGuide(undefined)
                        }
                      }}
                    >
                      {isSelectable &&
                        <Box
                          bg={sizeGuide.title === sizeGuideSelected?.title ? 'primary.bg' : 'white'}
                          width={6}
                          height={6}

                          borderRadius={'full'}
                          borderWidth={1}
                          borderColor={sizeGuide.title === sizeGuideSelected?.title ? 'white' : 'gray.300'}

                        >

                        </Box>
                      }
                      <Text
                        my={'auto'}

                      >
                        {sizeGuide.title}
                      </Text>
                    </Box>


                    <Box
                      display={'flex'}
                      gap={3}
                    >

                      <MagnifyingGlassIcon
                        cursor={'pointer'}
                        className='my-auto'
                        color='#FF5A78'
                        onClick={() => {
                          if (!sizeGuide.photo) return
                          handleSeePreviewImage(imageKitUrl(sizeGuide.photo))
                        }}
                        height={16}
                      />
                    </Box>


                  </Box>
                  <Button
                    height={12}
                    width={14}
                    _disabled={{
                      bg: "#D9D9D9"
                    }}
                    _hover={{
                    }}
                    variant='ghost'
                    colorScheme='blue'
                    padding={0}
                    marginY={'auto'}
                    borderRadius={'full'}
                    onClick={() => {
                      handleClickInputFileEditImage(sizeGuide)
                    }}

                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </Button>
                  <Button
                    height={12}
                    width={14}
                    _disabled={{
                      bg: "#D9D9D9"
                    }}
                    _hover={{
                    }}
                    variant='ghost'
                    colorScheme='red'
                    padding={0}
                    marginY={'auto'}
                    borderRadius={'full'}
                    onClick={() => {
                      if (!sizeGuide.title) return
                      handleDeleteSizeGuide(sizeGuide.title)
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </Button>
                </Box>)
              })}
            </Box>
            {productId && <Button
              variant={'primary'}
              mt={5}
              mb={-1}
              width={'full'}
              size={'lg'}
              borderRadius={'10px'}
              isDisabled={(defaultTemplateGuideSelectionPhoto === sizeGuideSelected?.photo) || !sizeGuideSelected?.photo}
              _disabled={{
                bg: 'gray.300'
              }}
              _hover={{
                color: 'primary.text'
              }}
              onClick={() => {
                if (handleEditSizeGuideTemplateFromProduct && sizeGuideSelected?.photo) {
                  handleEditSizeGuideTemplateFromProduct(sizeGuideSelected?.photo)
                }
              }}
            >
              Conferma modifica
            </Button>}

          </>)
          : (
            <Center>
              <Spinner
                thickness='5px'
                speed='0.65s'
                emptyColor='primary.bg'
                color='white'
                size='xl'
              />
            </Center>
          )
        }
      </Box>
      <Input
        type="file" id="file" multiple
        accept="image/*"
        className='hidden'
        ref={hiddenEditFileInputSizeGuideImage}
        onChange={(e) => {
          onSelectFileInputEditImage(e);
        }}
      />
      <ModalReausable
        title=''
        isOpen={isModalOpen}
        closeModal={() => {
          setIsModalOpen(false)
        }}
        positionTopModal={true}
      >
        <Box
          mt={4}
        >
          <img
            className='min-h[50vh] min-w-[30vw] max-h-[80vh] lg:max-w-[90vw]'
            src={imageURLForPreview}
          />
        </Box>

      </ModalReausable>
      <ModalReausable
        title='Attenzione'
        isOpen={isSizeGuideTemplateModalOpen ? true : false}
        closeModal={() => {
          setSizeGuideTemplateToEdit(undefined)
          setNewImageEdit(undefined)
          setIsSizeGuideTemplateModalOpen(false)
        }}
      >
        <Box
          marginTop={2}
          fontSize={'md'}
          fontWeight={'normal'}
          color={'gray.500'}
        >
          tutti i prodotti collegati a questa guida subiranno la modifica dell'immagine
        </Box>
        <ButtonGroup gap='2'
          marginTop={5}
          textAlign={'end'}
          float={'right'}
        >
          <Button
            onClick={() => {
              setSizeGuideTemplateToEdit(undefined)
              setNewImageEdit(undefined)
              setIsSizeGuideTemplateModalOpen(false)
            }}
            variant={'grayPrimary'}
            borderRadius={'20px'}
            fontSize={'md'}
            paddingInline={'25px'}
          >Annulla
          </Button>
          <Button
            onClick={() => {
              editImageSizeGuide()

            }}
            colorScheme='green'
            borderRadius={'20px'}
            fontSize={'md'}
            paddingInline={'25px'}
            isDisabled={isLoading}
            minW={40}
          >{
              !isLoading ? 'Conferma modifica' : (
                <Spinner
                  thickness='3px'
                  speed='0.65s'
                  emptyColor='gray.200'
                  color='white'
                  size='md'
                />
              )
            }
          </Button>
        </ButtonGroup>

      </ModalReausable>
      <ModalReausable
        title='Attenzione'
        isOpen={isModalDeleteSizeGuide ? true : false}
        closeModal={() => {
          setIsModalDeleteSizeGuide(undefined)
        }}
      >
        <Box
          marginTop={2}
          fontSize={'md'}
          fontWeight={'normal'}
          color={'gray.500'}
        >
          tutti i prodotti collegati a questa guida subiranno la cancellazione della stessa
        </Box>
        <ButtonGroup gap='2'
          marginTop={5}
          textAlign={'end'}
          float={'right'}
        >
          <Button
            onClick={() => {
              setIsModalDeleteSizeGuide(undefined)
            }}
            variant={'grayPrimary'}
            borderRadius={'20px'}
            fontSize={'md'}
            paddingInline={'25px'}
          >Annulla
          </Button>
          <Button
            onClick={async () => {
              if (!isModalDeleteSizeGuide) return
              setIsLoading(true)
              try {
                await deleteSizeGuideTemplate({
                  variables: {
                    shopId: id,
                    title: isModalDeleteSizeGuide
                  }
                })
                setIsLoading(false)
                addToast({
                  position: 'top',
                  title: `Guida alle taglie "${isModalDeleteSizeGuide}" eliminata con successo`,
                  status: 'success',
                  duration: 6000,
                  isClosable: true
                })
                setIsModalDeleteSizeGuide(undefined)

              } catch {
                addToast({
                  position: 'top',
                  title: "Errore imprevisto, se persiste contatta l'assistenza",
                  status: 'error',
                  duration: 6000,
                  isClosable: true
                })
                setIsLoading(false)

              }
            }}
            colorScheme='green'
            borderRadius={'20px'}
            fontSize={'md'}
            paddingInline={'25px'}
            isDisabled={isLoading}
            minW={40}
          >{
              !isLoading ? 'Conferma modifica' : (
                <Spinner
                  thickness='3px'
                  speed='0.65s'
                  emptyColor='gray.200'
                  color='white'
                  size='md'
                />
              )
            }
          </Button>
        </ButtonGroup>

      </ModalReausable>
    </>

  )
}

export default SizeGuidesComponent