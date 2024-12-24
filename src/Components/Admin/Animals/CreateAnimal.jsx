import {
  Box, Button, FormControl, FormLabel, Input, Textarea, FormErrorMessage,
  IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, useDisclosure, useToast, Grid, Select,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import animalService from '../../../Services/animalService';
import habitatService from '../../../Services/habitatService'; // Assuming you have this service to fetch habitats

const CreateAnimal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();
  
  // Fetch habitats when the component is mounted
  const { data: habitats = [], isLoading, isError } = useQuery({
    queryKey: ['habitats'],
    queryFn: habitatService.getAllHabitats,
    onError: (error) => {
      toast({
        title: 'Error fetching habitats',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const createAnimalMutation = useMutation({
    mutationFn: animalService.createAnimal,
    onSuccess: () => {
      toast({
        title: 'Animal created successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      queryClient.invalidateQueries({ queryKey: ['animalService'] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'Error creating animal.',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Error creating animal:', error);
    },
  });

  const initialValues = {
    name: '',
    race: '',
    habitat: '', // ID of the habitat to be passed to backend
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Animal name is required'),
    race: Yup.string().required('Animal race is required'),
    habitat: Yup.string().required('Animal habitat is required'),
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    createAnimalMutation.mutate(values);
    setSubmitting(false);
    resetForm();
  };

  return (
    <>
      <IconButton
        icon={<AddIcon />}
        aria-label="Add Animal"
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
            Create New Animal
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
                      <FormLabel>Animal Name</FormLabel>
                      <Field name="name" as={Input} placeholder="Enter animal name" />
                      <ErrorMessage name="name" component={FormErrorMessage} />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Race</FormLabel>
                      <Field name="race" as={Textarea} placeholder="Enter race" />
                      <ErrorMessage name="race" component={FormErrorMessage} />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Habitat</FormLabel>
                      <Field name="habitat" as={Select} placeholder="Select habitat">
                        {!isLoading && habitats && habitats.map((habitat) => (
                          <option key={habitat._id} value={habitat._id}>
                            {habitat.name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="habitat" component={FormErrorMessage} />
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
                      Create Animal
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

export default CreateAnimal;
