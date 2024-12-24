import React, { useState } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useToast,
  Spinner,
  Flex,
  IconButton,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Text,
  useDisclosure,
  Badge,
  VStack,
  HStack,
  Stack,
  Divider,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon, AddIcon } from '@chakra-ui/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import habitatService from '../../../Services/habitatService';
import CreateHabitat from './CreateHabitat';

const ListHabitat = () => {
  const [selectedHabitat, setSelectedHabitat] = useState(null);
  const [updatedHabitatData, setUpdatedHabitatData] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();

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
      onClose();
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
    onOpen();
  };

  const handleUpdate = () => {
    updateHabitatMutation.mutate({ id: selectedHabitat._id, updatedData: updatedHabitatData });
  };

  if (isLoading) return <Spinner size="xl" color="green.500" display="block" mx="auto" my={6} />;
  if (isError) return <Text color="red.500" fontSize="lg" textAlign="center">Error loading habitats</Text>;

  return (
    <Box p={6} maxW="6xl" mx="auto" bg="gray.50" borderRadius="lg" boxShadow="xl">
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg" color="green.600">
          Manage Habitats
        </Heading>

        <CreateHabitat isOpen={isOpen} onClose={onClose} />
      </Flex>

      <TableContainer bg="white" borderRadius="lg" boxShadow="lg">
        <Table variant="striped" colorScheme="green">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Description</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {habitats.map((habitat) => (
              <Tr key={habitat._id}>
                <Td>
                  <Text fontWeight="bold" color="green.800">
                    {habitat.name}
                  </Text>
                </Td>
                <Td>{habitat.description}</Td>
                <Td>
                  <Badge colorScheme="teal">Active</Badge>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      icon={<EditIcon />}
                      colorScheme="blue"
                      onClick={() => handleEdit(habitat)}
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      onClick={() => handleDelete(habitat._id)}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Modal for Editing or Adding Habitat */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedHabitat ? 'Edit Habitat' : 'Add Habitat'}</ModalHeader>
          <ModalBody>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  value={updatedHabitatData.name || ''}
                  onChange={(e) => setUpdatedHabitatData({ ...updatedHabitatData, name: e.target.value })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input
                  value={updatedHabitatData.description || ''}
                  onChange={(e) => setUpdatedHabitatData({ ...updatedHabitatData, description: e.target.value })}
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" onClick={handleUpdate}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ListHabitat;
