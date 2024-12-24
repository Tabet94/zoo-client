import {
    Box, Button, FormControl, FormLabel, Input, Textarea, FormErrorMessage,
    IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
    ModalBody, ModalCloseButton, useDisclosure, useToast, Grid,
  } from '@chakra-ui/react';
  import { AddIcon } from '@chakra-ui/icons';
  import { Formik, Field, Form, ErrorMessage } from 'formik';
  import * as Yup from 'yup';
  import { useMutation, useQueryClient } from '@tanstack/react-query';
  import zooService from '../../../Services/ZooService';
  
  const CreateService = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const queryClient = useQueryClient();
  
    const createServiceMutation = useMutation({
        mutationFn: zooService.createService, 
        onSuccess: () => {
          toast({
            title: 'Service created successfully!',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          queryClient.invalidateQueries({ queryKey: ['zooService'] });
          onClose();
        },
        onError: (error) => {
          toast({
            title: 'Error creating zoo service.',
            description: error.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          console.error('Error creating zoo service:', error);
        },
      });
      
  
    const initialValues = {
      name: '',
      description: '',
      image: null,
    };
  
    const validationSchema = Yup.object({
      name: Yup.string().required('Service name is required'),
      description: Yup.string().required('Description is required'),
    });

    const handleSubmit = (values, { setSubmitting, resetForm }) => {
        createServiceMutation.mutate(values);
        setSubmitting(false);
        resetForm();
    };
  
    return (
      <>
        <IconButton
          icon={<AddIcon />}
          aria-label="Add Service"
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
              Create New Service
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
                        <FormLabel>Service Name</FormLabel>
                        <Field name="name" as={Input} placeholder="Enter service name" />
                        <ErrorMessage name="name" component={FormErrorMessage} />
                      </FormControl>
  
                      <FormControl>
                        <FormLabel>Description</FormLabel>
                        <Field name="description" as={Textarea} placeholder="Enter description" />
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
                        Create Zoo Service
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
  
  export default CreateService;
  