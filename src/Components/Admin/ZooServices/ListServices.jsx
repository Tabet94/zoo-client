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
import zooService from '../../../Services/ZooService';
import CreateService from './CreateService'

const ListService = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [updatedServiceData, setUpdatedServiceData] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: services = [], isLoading, isError } = useQuery({
    queryKey: ['services'],
    queryFn: zooService.getAllServices,
    onError: (error) => {
      toast({
        title: 'Error fetching services',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: zooService.deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: 'Service deleted',
        description: 'The service was successfully deleted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting service',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: ({ id, updatedData }) => zooService.updateService(id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        title: 'Service updated',
        description: 'The service was successfully updated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'Error updating service',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      deleteServiceMutation.mutate(id);
    }
  };

  const handleEdit = (service) => {
    setSelectedService(service);
    setUpdatedServiceData(service);
    onOpen();
  };

  const handleUpdate = () => {
    updateServiceMutation.mutate({ id: selectedService._id, updatedData: updatedServiceData });
  };

  if (isLoading) return <Spinner size="xl" color="green.500" display="block" mx="auto" my={6} />;
  if (isError) return <Text color="red.500" fontSize="lg" textAlign="center">Error loading services</Text>;

  return (
    <Box p={6} maxW="6xl" mx="auto" bg="gray.50" borderRadius="lg" boxShadow="xl">
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg" color="green.600">
          Manage Zoo Services
        </Heading>
        
        <CreateService isOpen={isOpen} onClose={onClose} />
        
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
            {services.map((service) => (
              <Tr key={service._id}>
                <Td>
                  <Text fontWeight="bold" color="green.800">
                    {service.name}
                  </Text>
                </Td>
                <Td>{service.description}</Td>
                <Td>
                  <Badge colorScheme="teal">Active</Badge>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      icon={<EditIcon />}
                      colorScheme="blue"
                      onClick={() => handleEdit(service)}
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      onClick={() => handleDelete(service._id)}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Modal for Editing or Adding Service */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedService ? 'Edit Service' : 'Add Service'}</ModalHeader>
          <ModalBody>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  value={updatedServiceData.name || ''}
                  onChange={(e) => setUpdatedServiceData({ ...updatedServiceData, name: e.target.value })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input
                  value={updatedServiceData.description || ''}
                  onChange={(e) => setUpdatedServiceData({ ...updatedServiceData, description: e.target.value })}
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

export default ListService;
