import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Text,
  Flex,
  Heading,
  Spinner,
  Avatar,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { FaDog } from 'react-icons/fa';
import habitatService from '../../Services/habitatService';

const HabitatDetail = ({ habitatId }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['habitatById', habitatId],
    queryFn: () => habitatService.getHabitatById(habitatId),
    enabled: !!habitatId,
  });

  if (isLoading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );
  }

  if (isError || !data) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Text color="red.500" fontSize="xl">
          Error fetching habitat details
        </Text>
      </Flex>
    );
  }

  return (
    <Box maxW="7xl" mx="auto" p={8} bg="gray.50" borderRadius="lg" shadow="lg">
      {/* Habitat Overview */}
      <Flex direction="column" align="start" justify="space-between" mb={6}>
        <Box>
          <Heading as="h1" size="xl" color="teal.600" mb={2}>
            {data.name}
          </Heading>
          <Text fontSize="lg" color="gray.700" mb={4}>
            {data.description}
          </Text>
        </Box>
      </Flex>

      {/* Animals Section */}
      <Box mt={6}>
        <Heading as="h2" size="lg" color="teal.600" mb={4}>
          Animals in this Habitat
        </Heading>
        {data.animals && data.animals.length > 0 ? (
          <Grid templateColumns="repeat(auto-fit, minmax(120px, 1fr))" gap={4}>
            {data.animals.map((animal) => (
              <GridItem
                key={animal._id}
                textAlign="center"
                bg="white"
                borderRadius="md"
                p={4}
                shadow="sm"
                _hover={{ shadow: 'md', bg: 'gray.100' }}
              >
                <Avatar
                  name={animal.name}
                  src={animal.imagesUrl[0] || 'https://via.placeholder.com/180'}
                  size="lg"
                  mb={2}
                />
                <Text fontSize="md" color="gray.800" fontWeight="medium">
                  {animal.name}
                </Text>
              </GridItem>
            ))}
          </Grid>
        ) : (
          <Text color="gray.500" fontSize="lg" textAlign="center">
            No animals found in this habitat.
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default HabitatDetail;
