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

const habitats = [
  {
    id: 1,
    name: "Savane Africaine",
    images: ["/images/savane.jpg"],
    description:
      "La savane africaine abrite une faune variée, dont des lions, éléphants, et antilopes.",
    animals: [
      {
        id: 1,
        name: "Simba",
        species: "Lion",
        images: ["/images/lion.jpg"],
        vetInfo: [
          {
            state: "En bonne santé",
            food: "Viande",
            foodWeight: "5 kg",
            visitDate: "2024-12-01",
            details: "Énergique et actif.",
          },
        ],
      },
      {
        id: 2,
        name: "Dumbo",
        species: "Éléphant",
        images: ["/images/elephant.jpg"],
        vetInfo: [
          {
            state: "Fatigué",
            food: "Herbe",
            foodWeight: "50 kg",
            visitDate: "2024-12-03",
            details: "Besoin de repos.",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Forêt Tropicale",
    images: ["/images/foret.jpg"],
    description: "Un habitat luxuriant qui abrite des singes, oiseaux tropicaux et reptiles.",
    animals: [],
  },
];

const Habitat = () => {
  const [selectedHabitat, setSelectedHabitat] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

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
              <Image src={habitat.images[0]} alt={habitat.name} h="200px" w="full" />
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
        <ModalContent>
          <ModalHeader>{selectedHabitat?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedHabitat && <HabitatDetail habitat={selectedHabitat} />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Habitat;
