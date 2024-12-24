import React, { useState } from 'react';
import {
  Box,
  Heading,
  Grid,
  Card,
  CardBody,
  Text,
  IconButton,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Spinner,
  HStack,
  Badge,
  Flex,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import animalService from '../../../Services/animalService';
import CreateAnimal from './CreateAnimal';

const AnimalComponent = () => {
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [updatedAnimalData, setUpdatedAnimalData] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();

  // Fetch animals using React Query
  const { data: animals = [], isLoading, isError } = useQuery({
    queryKey: ['animals'],
    queryFn: animalService.getAllAnimals,
    onError: (error) => {
      toast({
        title: 'Error fetching animals',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  // Mutations for deleting and updating animals
  const deleteAnimalMutation = useMutation({
    mutationFn: animalService.deleteAnimal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animals'] });
      toast({
        title: 'Animal deleted',
        description: 'The animal was successfully deleted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting animal',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const updateAnimalMutation = useMutation({
    mutationFn: ({ id, updatedData }) => animalService.updateAnimal(id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animals'] });
      toast({
        title: 'Animal updated',
        description: 'The animal was successfully updated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'Error updating animal',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this animal?')) {
      deleteAnimalMutation.mutate(id);
    }
  };

  const handleEdit = (animal) => {
    setSelectedAnimal(animal);
    setUpdatedAnimalData(animal);
    onOpen();
  };

  const handleUpdate = () => {
    updateAnimalMutation.mutate({ id: selectedAnimal._id, updatedData: updatedAnimalData });
  };

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedAnimalData({ ...updatedAnimalData, [name]: value });
  };

  if (isLoading) return <Spinner size="xl" color="green.500" display="block" mx="auto" my={6} />;
  if (isError) return <Text color="red.500" fontSize="lg" textAlign="center">Error loading animals</Text>;

  return (
    <Box p={6} maxW="7xl" mx="auto" bg="gray.50" borderRadius="lg" boxShadow="xl">
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg" color="green.600">Manage Animals</Heading>
        <CreateAnimal isOpen={isOpen} onClose={onClose} />
      </Flex>

      {/* Animal Cards */}
      <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
        {animals.map((animal) => (
          <Card key={animal._id} boxShadow="md" borderRadius="lg" bg="white">
            <CardBody>
              <Heading size="md" color="green.600">{animal.name}</Heading>
              <Text mt={2} fontSize="sm" color="gray.600">Race: {animal.race}</Text>
              <Text mt={2} fontSize="sm" color="gray.600">Habitat: {animal.habitat ? animal.habitat.name : 'Unknown'}</Text>
              <HStack mt={3} spacing={3}>
                <Badge colorScheme="green">Active</Badge>
                <HStack spacing={2}>
                  <IconButton icon={<EditIcon />} colorScheme="blue" onClick={() => handleEdit(animal)} />
                  <IconButton icon={<DeleteIcon />} colorScheme="red" onClick={() => handleDelete(animal._id)} />
                </HStack>
              </HStack>
            </CardBody>
          </Card>
        ))}
      </Grid>

      {/* Modal for editing/creating animal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedAnimal ? 'Edit Animal' : 'Add Animal'}</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input name="name" value={updatedAnimalData.name || ''} onChange={handleInputChange} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Race</FormLabel>
              <Input name="race" value={updatedAnimalData.race || ''} onChange={handleInputChange} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Habitat</FormLabel>
              <Input name="habitat" value={updatedAnimalData.habitat || ''} onChange={handleInputChange} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" onClick={handleUpdate}>Save</Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AnimalComponent;
