import {
  Box, Button, FormControl, FormLabel, Input, Textarea, FormErrorMessage,
  IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, useDisclosure, useToast, Grid,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import habitatService from '../../../Services/habitatService';
import { useState } from 'react';

const CreateHabitat = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [file, setFile] = useState(null); // State to store the selected file

  const createHabitatMutation = useMutation({
    mutationFn: habitatService.createHabitat, 
    onSuccess: () => {
      toast({
        title: 'Habitat created successfully!',
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
    description: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Habitat name is required'),
    description: Yup.string().required('Description is required'),
  });

  const handleFileChange = (event) => {
    setFile(event.target.files[0]); // Store the selected file
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description);
    if (file) {
      formData.append('image', file); // Append the file to FormData
    }

    createHabitatMutation.mutate(formData);
    setSubmitting(false);
    resetForm();
    setFile(null); // Reset file input
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
                      <Field name="description" as={Textarea} placeholder="Enter description" />
                      <ErrorMessage name="description" component={FormErrorMessage} />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Image</FormLabel>
                      <Input type="file" accept="image/*" onChange={handleFileChange} />
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
