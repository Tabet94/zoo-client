import React, { useState } from 'react';
import {
  Box,
  Heading,
  Grid,
  Card,
  CardBody,
  Text,
  Image,
  Badge,
  Button,
  useToast,
  Spinner,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import habitatService from '../../../Services/habitatService';
import CreateHabitat from './CreateHabitat';
import HabitatDetails from './HabitatDetailModal'; // Import the HabitatDetails component

const ListHabitat = () => {
  const [selectedHabitat, setSelectedHabitat] = useState(null);
  const [updatedHabitatData, setUpdatedHabitatData] = useState({});
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: habitats = [], isLoading, isError } = useQuery({
    queryKey: ['habitats'],
    queryFn: () => habitatService.getAllHabitats(),
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

  const deleteHabitatMutation = useMutation({
    mutationFn: habitatService.deleteHabitat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habitats'] });
      toast({
        title: 'Habitat deleted',
        description: 'The habitat was successfully deleted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting habitat',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const updateHabitatMutation = useMutation({
    mutationFn: ({ id, updatedData }) => habitatService.updateHabitat(id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habitats'] });
      toast({
        title: 'Habitat updated',
        description: 'The habitat was successfully updated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onEditClose();
    },
    onError: (error) => {
      toast({
        title: 'Error updating habitat',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this habitat?')) {
      deleteHabitatMutation.mutate(id);
    }
  };

  const handleEdit = (habitat) => {
    setSelectedHabitat(habitat);
    setUpdatedHabitatData(habitat);
    onEditOpen();
  };

  const handleUpdate = () => {
    updateHabitatMutation.mutate({ id: selectedHabitat._id, updatedData: updatedHabitatData });
  };

  const handleDetails = (habitat) => {
    setSelectedHabitat(habitat); // Set selected habitat for details
    onDetailsOpen(); // Open the details modal
  };

  if (isLoading) return <Spinner size="xl" color="green.500" display="block" mx="auto" my={6} />;
  if (isError) return <Text color="red.500" fontSize="lg" textAlign="center">Error loading habitats</Text>;

  return (
    <Box p={6} maxW="7xl" mx="auto" bg="gray.50" borderRadius="lg" boxShadow="xl">
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg" color="teal.600">Manage Habitats</Heading>
        <CreateHabitat />
      </Flex>

      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }} gap={8}>
        {habitats.map((habitat) => (
          <Card
            key={habitat._id}
            bg="white"
            borderRadius="xl"
            boxShadow="lg"
            overflow="hidden"
            transition="transform 0.2s"
            _hover={{ transform: 'scale(1.03)' }}
          >
            <Image
              src={habitat.imagesUrl[0]}
              alt={habitat.name}
              boxSize="100%"
              objectFit="cover"
              height="200px"
            />
            <CardBody p={4}>
              <Text fontWeight="bold" color="teal.700" fontSize="lg" mb={2}>
                {habitat.name}
              </Text>
              <Text mb={4} fontSize="sm" color="gray.600" noOfLines={2}>
                {habitat.description}
              </Text>
              <Flex justifyContent="space-between" alignItems="center">
                <Flex gap={3}>
                  <Button
                    size="sm"
                    leftIcon={<EditIcon />}
                    colorScheme="blue"
                    onClick={() => handleEdit(habitat)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    leftIcon={<DeleteIcon />}
                    colorScheme="red"
                    onClick={() => handleDelete(habitat._id)}
                  >
                    Delete
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="teal"
                    onClick={() => handleDetails(habitat)}
                  >
                    Details
                  </Button>
                </Flex>
              </Flex>
            </CardBody>
          </Card>
        ))}
      </Grid>

      {/* Habitat Details Modal */}
      <Modal isOpen={isDetailsOpen} onClose={onDetailsClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Habitat Details</ModalHeader>
          <ModalBody>
            {selectedHabitat ? (
              <HabitatDetails habitatId={selectedHabitat._id} />
            ) : (
              <Text>No habitat selected</Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onDetailsClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Update Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Habitat</ModalHeader>
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Name</FormLabel>
              <Input
                value={updatedHabitatData.name || ''}
                onChange={(e) => setUpdatedHabitatData({ ...updatedHabitatData, name: e.target.value })}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Description</FormLabel>
              <Input
                value={updatedHabitatData.description || ''}
                onChange={(e) => setUpdatedHabitatData({ ...updatedHabitatData, description: e.target.value })}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onEditClose}>Cancel</Button>
            <Button colorScheme="blue" onClick={handleUpdate}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ListHabitat;
