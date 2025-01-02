import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
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
  Flex,
  Avatar,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, ViewIcon } from '@chakra-ui/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import animalService from '../../../Services/animalService';
import CreateAnimal from './CreateAnimal';

const AnimalComponent = () => {
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [updatedAnimalData, setUpdatedAnimalData] = useState({});
  const { isOpen: isEditModalOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDetailsModalOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();

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
      onEditClose();
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
    onEditOpen();
  };

  const handleUpdate = () => {
    updateAnimalMutation.mutate({ id: selectedAnimal._id, updatedData: updatedAnimalData });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedAnimalData({ ...updatedAnimalData, [name]: value });
  };

  const handleViewDetails = async (animalId) => {
    try {
      const fetchedAnimal = await animalService.getAnimalById(animalId);
      setSelectedAnimal(fetchedAnimal);
      onDetailsOpen();
    } catch (error) {
      toast({
        title: 'Error fetching animal details',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (isLoading) return <Spinner size="xl" color="green.500" display="block" mx="auto" my={6} />;
  if (isError) return <Text color="red.500" fontSize="lg" textAlign="center">Error loading animals</Text>;

  return (
    <Box p={6} maxW="7xl" mx="auto" bg="gray.50" borderRadius="lg" boxShadow="xl">
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg" color="green.600">Manage Animals</Heading>
        <CreateAnimal isOpen={isEditModalOpen} onClose={onEditClose} />
      </Flex>

      <Box>
        {animals.map((animal) => (
          <Box
            key={animal._id}
            bg="white"
            borderRadius="md"
            p={4}
            mb={4}
            boxShadow="md"
            _hover={{
              boxShadow: 'xl',
              transform: 'scale(1.02)',
              transition: 'all 0.3s ease-in-out',
            }}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Flex alignItems="center">
              <Avatar name={animal.name} src={animal.imagesUrl[0]} size="lg" mr={4} />
              <Box>
                <Text fontSize="xl" fontWeight="bold" color="green.600">{animal.name}</Text>
                <Text fontSize="sm" color="gray.500">Race: {animal.race}</Text>
                <Text fontSize="sm" color="gray.500">Habitat: {animal.habitat ? animal.habitat.name : 'Unknown'}</Text>
              </Box>
            </Flex>

            <HStack spacing={4}>
              <IconButton
                icon={<EditIcon />}
                onClick={() => handleEdit(animal)}
                aria-label="Edit animal"
                colorScheme="blue"
              />
              <IconButton
                icon={<DeleteIcon />}
                onClick={() => handleDelete(animal._id)}
                aria-label="Delete animal"
                colorScheme="red"
              />
              <IconButton
                icon={<ViewIcon />}
                onClick={() => handleViewDetails(animal._id)}
                aria-label="View animal details"
                colorScheme="green"
              />
            </HStack>
          </Box>
        ))}
      </Box>

      {/* Modal for Viewing Animal Details */}
      <Modal isOpen={isDetailsModalOpen} onClose={onDetailsClose} isCentered size="lg">
  <ModalOverlay />
  <ModalContent borderRadius="lg" maxW="4xl" p={6} bg="white" boxShadow="lg">
    <ModalHeader>
      <Text fontSize="2xl" fontWeight="bold" color="green.600">Animal Details</Text>
    </ModalHeader>
    <ModalBody>
      <Flex direction="column" gap={4}>
        {/* Animal Basic Information */}
        <Box p={4} bg="gray.50" borderRadius="lg" boxShadow="md">
          <Heading size="md" color="green.600">Basic Info</Heading>
          <Text fontSize="lg" color="gray.600"><strong>Name:</strong> {selectedAnimal?.name}</Text>
          <Text fontSize="lg" color="gray.600"><strong>Race:</strong> {selectedAnimal?.race}</Text>
          <Text fontSize="lg" color="gray.600"><strong>Habitat:</strong> {selectedAnimal?.habitat?.name || 'Unknown'}</Text>
        </Box>

        {/* Vet Report Section */}
        {selectedAnimal?.vetReports?.length > 0 ? (
  selectedAnimal.vetReports.map((report, index) => (
    <Box
      key={index}
      p={4}
      bg="gray.50"
      borderRadius="lg"
      boxShadow="md"
      mb={4} // Adds spacing between each report
    >
      <Heading size="md" color="green.600">
        Vet Report #{index + 1}
      </Heading>
      <Text fontSize="lg" color="gray.600">
        <strong>Details:</strong> {report.details || 'No report available'}
      </Text>
      <Text fontSize="lg" color="gray.600">
        <strong>Date:</strong> {new Date(report.date).toLocaleDateString() || 'N/A'}
      </Text>
      <Text fontSize="lg" color="gray.600">
        <strong>Food:</strong> {report.food || 'Not specified'}
      </Text>
      <Text fontSize="lg" color="gray.600">
        <strong>Quantity:</strong> {report.quantity || 'Not specified'}
      </Text>
      <Text fontSize="lg" color="gray.600">
        <strong>State:</strong> {report.state || 'Not specified'}
      </Text>
    </Box>
  ))
) : (
  <Box p={4} bg="gray.50" borderRadius="lg" boxShadow="md">
    <Text fontSize="lg" color="gray.600">No vet reports available.</Text>
  </Box>
)}


        {/* Additional Information - Add more sections as needed */}
        <Box p={4} bg="gray.50" borderRadius="lg" boxShadow="md">
          <Heading size="md" color="green.600">Other Details</Heading>
          {/* You can add other details like age, gender, etc. */}
        </Box>
      </Flex>
    </ModalBody>
    <ModalFooter>
      <Button variant="ghost" onClick={onDetailsClose} colorScheme="green">Close</Button>
    </ModalFooter>
  </ModalContent>
</Modal>


      {/* Modal for Editing Animal */}
      <Modal isOpen={isEditModalOpen} onClose={onEditClose} isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="xl">
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
            <Button variant="ghost" onClick={onEditClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AnimalComponent;
