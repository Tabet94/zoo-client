import React from "react";
import { Box, Text, Image, VStack, Grid, GridItem } from "@chakra-ui/react";
import AnimalDetail from "./AnimalDetail"; 

const HabitatDetail = ({ habitat }) => {
  return (
    <Box>
      <Text fontSize="lg" mb={4}>
        {habitat.description}
      </Text>

      <Text fontWeight="bold" fontSize="xl" mb={4}>
        Animaux dans cet habitat :
      </Text>
      {habitat.animals.length > 0 ? (
        <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} gap={4}>
          {habitat.animals.map((animal) => (
            <GridItem key={animal.id}>
              <AnimalDetail animal={animal} />
            </GridItem>
          ))}
        </Grid>
      ) : (
        <Text>Aucun animal dans cet habitat pour le moment.</Text>
      )}
    </Box>
  );
};

export default HabitatDetail;
