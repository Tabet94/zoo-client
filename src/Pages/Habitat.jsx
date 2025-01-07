import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Image,
  Grid,
  GridItem,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";
import HabitatDetail from "../Components/Client/HabitatDetail"; 
import habitatService from "../Services/habitatService";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const Habitat = () => {
  const [selectedHabitat, setSelectedHabitat] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
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


  const handleHabitatClick = (habitat) => {
    setSelectedHabitat(habitat);
    onOpen();
  };

  return (
    <Box p={6}>
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        Vue globale des habitats
      </Text>

      <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }} gap={6}>
        {habitats.map((habitat) => (
          <GridItem key={habitat.id}>
            <Box
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              cursor="pointer"
              onClick={() => handleHabitatClick(habitat)}
              _hover={{ transform: "scale(1.05)", transition: "all 0.3s" }}
            >
              <Image  src={habitat.imagesUrl[0]} alt={habitat.name} h="200px" w="full" />
              <Text p={4} fontWeight="bold" textAlign="center">
                {habitat.name}
              </Text>
            </Box>
          </GridItem>
        ))}
      </Grid>

      {/* Modal pour afficher les détails d'un habitat */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent maxWidth="90%" px={10} py={8}>
    <ModalHeader fontSize="2xl" fontWeight="bold">Habitat Details</ModalHeader>
    <ModalBody fontSize="lg">
      {selectedHabitat ? (
        <HabitatDetail habitatId={selectedHabitat._id} />
      ) : (
        <Text>No habitat selected</Text>
      )}
    </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Habitat;
