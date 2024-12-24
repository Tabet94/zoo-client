import React from "react";
import { Box, Text, Image, VStack } from "@chakra-ui/react";

const AnimalDetail = ({ animal }) => {
  const latestVetVisit = animal.vetInfo[animal.vetInfo.length - 1];

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      _hover={{ boxShadow: "lg", transition: "all 0.3s" }}
    >
      <Image src={animal.images[0]} alt={animal.name} h="150px" w="full" mb={4} />
      <Text fontWeight="bold" fontSize="lg">
        {animal.name} ({animal.species})
      </Text>
      <Text mt={2} fontSize="sm">
        <strong>État :</strong> {latestVetVisit.state}
      </Text>
      <Text fontSize="sm">
        <strong>Nourriture :</strong> {latestVetVisit.food} ({latestVetVisit.foodWeight})
      </Text>
      <Text fontSize="sm">
        <strong>Dernière visite :</strong> {latestVetVisit.visitDate}
      </Text>
      <Text fontSize="sm" mt={2}>
        <strong>Détails :</strong> {latestVetVisit.details || "Aucun détail fourni."}
      </Text>
    </Box>
  );
};

export default AnimalDetail;
