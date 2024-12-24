import React from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  VStack,
  Icon,
  Button,
} from "@chakra-ui/react";
import { FaUtensils, FaTree, FaBusAlt, FaGift } from "react-icons/fa";
import serviceheader from "../assets/service.jpg"


const Services = () => {
  const services = [
    {
      title: "Restaurant & Cafétéria",
      description: "Savourez de délicieux repas et rafraîchissements.",
      icon: FaUtensils,
    },
    {
      title: "Visites Guidées",
      description: "Explorez le zoo avec des guides experts.",
      icon: FaTree,
    },
    {
      title: "Service de Navette",
      description: "Transport pratique à l'intérieur du zoo.",
      icon: FaBusAlt,
    },
    {
      title: "Boutique de Cadeaux",
      description: "Ramenez des souvenirs et des cadeaux.",
      icon: FaGift,
    },
  ];

  return (
    <Box mt="5rem">
      {/* Section En-tête */}
    
      <Box
        bgImage={`url(${serviceheader})`}
        bgSize="cover"
        bgPosition="center"
        py={20}
        px={5}
        color="white"
      >
        <Flex
          direction="column"
          align="center"
          justify="center"
          bg="rgba(0, 0, 0, 0.6)"
          py={10}
          px={5}
          borderRadius="md"
        >
          <Heading fontSize={{ base: "3xl", md: "5xl" }} mb={4}>
            Bienvenue dans Notre Zoo
          </Heading>
          <Text fontSize={{ base: "md", md: "lg" }} maxW="600px" textAlign="center">
            Découvrez un monde merveilleux ! Des expositions interactives aux
            équipements familiaux, il y en a pour tous les goûts.
          </Text>
        </Flex>
      </Box>

      {/* Section Services */}
      <Box py={10} px={5} mb="5rem" mt='5rem'>
        <Heading textAlign="center" mb={8} fontSize="3xl" color="teal.600">
          Nos Services
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          {services.map((service, index) => (
            <Card
              key={index}
              shadow="md"
              borderRadius="md"
              bg="white"
              _hover={{
                shadow: "lg",
                transform: "scale(1.05)",
                transition: "0.3s",
              }}
            >
              <CardBody>
                <VStack spacing={4}>
                  <Box
                    bg="teal.500"
                    color="white"
                    w={16}
                    h={16}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="full"
                  >
                    <Icon as={service.icon} boxSize={8} />
                  </Box>
                  <Heading fontSize="xl" textAlign="center" color="teal.700">
                    {service.title}
                  </Heading>
                  <Text fontSize="sm" textAlign="center" color="gray.600">
                    {service.description}
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
       
      </Box>
    </Box>
  );
};

export default Services;
