import React from "react";
import { Box, Heading, Text, Flex, useColorModeValue } from "@chakra-ui/react";

const EmployeeDashboard = () => {
  const bgGradient = useColorModeValue(
    "linear(to-br, teal.100, teal.200, teal.300)",
    "linear(to-br, gray.800, gray.700, gray.600)"
  );
  const boxBg = useColorModeValue("white", "gray.700");

  return (
    <Flex
      align="center"
      justify="center"
      minH="100vh"
      bgGradient={bgGradient}
      px={4}
    >
      <Box
        w={{ base: "100%", md: "600px" }}
        p={8}
        bg={boxBg}
        borderRadius="lg"
        boxShadow="lg"
        textAlign="center"
      >
        <Heading color="teal.500" mb={4}>
          Bienvenue, employee!
        </Heading>
        <Text fontSize="lg" color="gray.500">
          Vous êtes connecté à votre tableau de bord. Gérez vos tâches et
          explorez les fonctionnalités disponibles.
        </Text>
      </Box>
    </Flex>
  );
};

export default EmployeeDashboard;
