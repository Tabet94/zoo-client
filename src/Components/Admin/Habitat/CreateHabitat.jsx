import {
    Box, Button, FormControl, FormLabel, Input, Textarea, FormErrorMessage,
    IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
    ModalBody, ModalCloseButton, useDisclosure, useToast, Grid,
  } from '@chakra-ui/react';
  import { AddIcon } from '@chakra-ui/icons';
  import { Formik, Field, Form, ErrorMessage } from 'formik';
  import * as Yup from 'yup';
  import { useMutation, useQueryClient } from '@tanstack/react-query';
  import habitatService from '../../../Services/habitatService'
  
  const CreateHabitat = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const queryClient = useQueryClient();
  
    const createHabitatMutation = useMutation({
        mutationFn: habitatService.createHabitat, 
        onSuccess: () => {
          toast({
            title: 'habitat created successfully!',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          queryClient.invalidateQueries({ queryKey: ['habitatService'] });
          onClose();
        },
        onError: (error) => {
          toast({
            title: 'Error creating habitat.',
            description: error.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          console.error('Error creating habitat:', error);
        },
      });
      
  
    const initialValues = {
      name: '',
      description:''
    };
  
    const validationSchema = Yup.object({
      name: Yup.string().required('habitat name is required'),
      description: Yup.string().required('decirption  is required'),
      
    });

    const handleSubmit = (values, { setSubmitting, resetForm }) => {
        createHabitatMutation.mutate(values);
        setSubmitting(false);
        resetForm();
    };
  
    return (
      <>
        <IconButton
          icon={<AddIcon />}
          aria-label="Add Habitat"
          bgGradient="linear(to-l, #ffcc99, #ff8c66)"
          onClick={onOpen}
          _hover={{
            transform: 'scale(1.05)',
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
          }}
          size="sm"
        />
  
        <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
          <ModalOverlay />
          <ModalContent borderRadius="md" boxShadow="lg">
            <ModalHeader
              fontSize="lg"
              fontWeight="bold"
              bg="linear-gradient(to-r, #663300, #cc6600)"
              color="black"
            >
              Create New Habitat
            </ModalHeader>
            <ModalCloseButton color="black" />
            <ModalBody>
            <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                  
                
            
                {({ isSubmitting }) => (
                  <Form>
                    <Grid templateColumns="repeat(2, 1fr)" gap={6} mt={4}>
                      <FormControl>
                        <FormLabel>Habitat Name</FormLabel>
                        <Field name="name" as={Input} placeholder="Enter habitat name" />
                        <ErrorMessage name="name" component={FormErrorMessage} />
                      </FormControl>
  
                      <FormControl>
                        <FormLabel>Description</FormLabel>
                        <Field name="description" as={Textarea} placeholder="enter description" />
                        <ErrorMessage name="description" component={FormErrorMessage} />
                      </FormControl>
                      
                    </Grid>
  
                    <ModalFooter justifyContent="center" mt={6}>
                      <Button onClick={onClose} mr={3} colorScheme="gray">
                        Cancel
                      </Button>
                      <Button
                        bgGradient="linear(to-r, #663300, #cc6600)"
                        _hover={{
                          bgGradient: 'linear(to-r, #cc6600, #663300)',
                          transform: 'scale(1.05)',
                          boxShadow: 'lg',
                        }}
                        isLoading={isSubmitting}
                        type="submit"
                      >
                        Create Habitat
                      </Button>
                    </ModalFooter>
                  </Form>
                )}
              </Formik>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  };
  
  export default CreateHabitat;
  