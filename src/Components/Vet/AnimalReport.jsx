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
  Button,
  Spinner,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useDisclosure,
  useToast,
  Divider,
  Avatar,
  Flex,
} from '@chakra-ui/react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import animalService from '../../Services/animalService';
import reportService from '../../Services/reportService';
import useFetchById from '../hook';

const AnimalReport = () => {
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [reportData, setReportData] = useState({
    state: '',
    food: '',
    quantity: '',
    date: '',
    details: '',
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();

  // Query for animals
  const { data: animals = [], isLoading, isError } = useQuery({
    queryKey: ['animals'],
    queryFn: () => animalService.getAllAnimals(),
  });

  // Use custom hook to fetch reports by animal
  const { data: vetReports = [], isLoading: reportsLoading, refetch: refetchReports } = useFetchById(
    reportService.getVetReportsByAnimal,
    selectedAnimal
  );

  const createVetReportMutation = useMutation({
    mutationFn: (newReport) => reportService.createVetReport(selectedAnimal, newReport),
    onSuccess: () => {
      toast({ title: 'Vet report created successfully', status: 'success', duration: 3000 });
      refetchReports();
      onClose();
      setReportData({
        state: '',
        food: '',
        quantity: '',
        date: '',
        details: '',
      });
    },
    onError: (error) => {
      toast({ title: 'Error creating vet report', description: error.message, status: 'error', duration: 3000 });
    },
  });

  const handleCreateReport = () => {
    createVetReportMutation.mutate(reportData);
  };

  if (isLoading) return <Spinner size="xl" color="teal.500" display="block" mx="auto" my={6} />;
  if (isError) return <Text color="red.500" fontSize="lg" textAlign="center">Error loading animals</Text>;

  return (
    <Box p={8} maxW="8xl" mx="auto" bg="gray.50" borderRadius="lg" boxShadow="xl">
      <Heading size="xl" color="teal.600" mb={8} textAlign="center" fontWeight="bold">Animal Management Dashboard</Heading>

      {/* Animal Data Grid Table */}
      <Table  mb={6}>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Race</Th>
            <Th>Habitat</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {animals.map((animal) => (
            <Tr key={animal._id}>
              <Td>
                <Flex alignItems="center">
                  <Avatar name={animal.name} src={animal.image || ''} size="sm" mr={4} />
                  {animal.name}
                </Flex>
              </Td>
              <Td>{animal.race}</Td>
              <Td>{animal.habitat?.name || 'Unknown'}</Td>
             
              <Td>
                <Button
                  size="sm"
                  colorScheme="teal"
                  variant="outline"
                  onClick={() => {
                    setSelectedAnimal(animal._id);
                    refetchReports();
                    onOpen();
                  }}
                >
                  Add Report
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Modal for Viewing and Adding Vet Reports */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent borderRadius="lg" boxShadow="xl">
          <ModalHeader bg="teal.600" color="white" borderTopRadius="lg" fontWeight="bold">Vet Reports</ModalHeader>
          <ModalBody bg="gray.50" p={6}>
            {reportsLoading ? (
              <Spinner size="xl" color="teal.500" display="block" mx="auto" my={6} />
            ) : (
              vetReports.map((report, index) => (
                <Box key={index} p={4} bg="white" borderRadius="md" boxShadow="md" mb={4}>
                  <Text fontSize="md" color="teal.700"><strong>State:</strong> {report.state}</Text>
                  <Text fontSize="md" color="teal.700"><strong>Food:</strong> {report.food}</Text>
                  <Text fontSize="md" color="teal.700"><strong>Quantity:</strong> {report.quantity}</Text>
                  <Text fontSize="md" color="teal.700"><strong>Date:</strong> {new Date(report.date).toLocaleDateString()}</Text>
                  <Text fontSize="md" color="teal.700"><strong>Details:</strong> {report.details}</Text>
                </Box>
              ))
            )}
            <Divider my={6} />
            <Heading size="md" color="teal.700" mb={4}>Add a New Vet Report</Heading>
            <FormControl mb={4}>
              <FormLabel>State</FormLabel>
              <Input
                placeholder="State"
                value={reportData.state}
                onChange={(e) => setReportData({ ...reportData, state: e.target.value })}
                borderRadius="md"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Food</FormLabel>
              <Input
                placeholder="Food"
                value={reportData.food}
                onChange={(e) => setReportData({ ...reportData, food: e.target.value })}
                borderRadius="md"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Quantity</FormLabel>
              <NumberInput
                value={reportData.quantity}
                onChange={(value) => setReportData({ ...reportData, quantity: value })}
                borderRadius="md"
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Date</FormLabel>
              <Input
                type="date"
                value={reportData.date}
                onChange={(e) => setReportData({ ...reportData, date: e.target.value })}
                borderRadius="md"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Details</FormLabel>
              <Textarea
                placeholder="Enter details"
                value={reportData.details}
                onChange={(e) => setReportData({ ...reportData, details: e.target.value })}
                borderRadius="md"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter bg="gray.100" p={4}>
            <Button colorScheme="teal" onClick={handleCreateReport} isLoading={createVetReportMutation.isLoading} borderRadius="md">
              Submit
            </Button>
            <Button variant="outline" onClick={onClose} ml={3} borderRadius="md">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AnimalReport;
