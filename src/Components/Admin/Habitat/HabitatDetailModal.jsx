import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Text, Grid, Heading, Card, CardBody, Tab, TabList, TabPanel, TabPanels, Tabs, Spinner, Flex, Button, useBreakpointValue, Stack } from '@chakra-ui/react';
import { FaDog, FaInfoCircle, FaEdit } from 'react-icons/fa';
import habitatService from '../../../Services/habitatService';

const HabitatDetails = ({ habitatId }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['habitatById', habitatId],
    queryFn: () => habitatService.getHabitatById(habitatId),
    enabled: !!habitatId,
    onError: (error) => {
      console.error('Error fetching habitat details:', error);
    },
  });

  const isMobile = useBreakpointValue({ base: true, md: false });

  // Loading state
  if (isLoading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );
  }

  // Error state
  if (isError) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Text color="red.500" fontSize="xl">Error fetching habitat details</Text>
      </Flex>
    );
  }

  // If no data
  if (!data) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Text color="gray.500" fontSize="xl">No habitat details found</Text>
      </Flex>
    );
  }

  return (
    <Box maxW="7xl" mx="auto" p={6} borderRadius="lg" boxShadow="xl" bg="white">
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" color="teal.600" fontWeight="bold">{data.name}</Heading>
        <Button colorScheme="teal" leftIcon={<FaEdit />} size="sm">
          Edit Habitat
        </Button>
      </Flex>

      <Text fontSize="lg" color="gray.600" mb={8}>{data.description}</Text>

      {/* Tabs for Habitat Details */}
      <Tabs isLazy colorScheme="teal" variant="soft-rounded" align="center">
        <TabList>
          <Tab fontWeight="bold" _selected={{ color: "white", bg: "teal.500" }} display="flex" alignItems="center">
            <FaInfoCircle size={22} style={{ marginRight: 8 }} />
            Habitat Info
          </Tab>
          <Tab fontWeight="bold" _selected={{ color: "white", bg: "teal.500" }} display="flex" alignItems="center">
            <FaDog size={22} style={{ marginRight: 8 }} />
            Animals
          </Tab>
        </TabList>

        <TabPanels mt={6}>
          {/* Habitat Information Panel */}
          <TabPanel>
            <Stack spacing={6}>
              <Card borderRadius="lg" boxShadow="md" bg="teal.50" _hover={{ boxShadow: "xl" }} overflow="hidden">
                <CardBody>
                  <Heading size="md" color="teal.600" mb={4}>Habitat Overview</Heading>
                  <Text fontSize="md" color="gray.700">{data.description}</Text>
                </CardBody>
              </Card>

              {/* You can add more habitat-related info cards here */}
            </Stack>
          </TabPanel>

          {/* Animals Panel */}
          <TabPanel>
            <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
              {data.animals && data.animals.length > 0 ? (
                data.animals.map((animal) => (
                  <Card key={animal._id} borderRadius="lg" boxShadow="md" overflow="hidden" bg="gray.50" _hover={{ boxShadow: "lg" }}>
                    <CardBody>
                      <Heading size="sm" color="teal.600" mb={2}>{animal.name}</Heading>
                      <Text fontSize="sm" color="gray.500">Race: {animal.race}</Text>
                    </CardBody>
                  </Card>
                ))
              ) : (
                <Text color="gray.500" fontSize="lg">No animals found for this habitat</Text>
              )}
            </Grid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default HabitatDetails;
