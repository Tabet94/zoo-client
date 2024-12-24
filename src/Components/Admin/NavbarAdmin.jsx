// src/components/Navbar.js
import React, { useContext } from 'react';
import { Box, Flex, Heading, Text, Spacer, Avatar, VStack, useColorModeValue } from '@chakra-ui/react';
import { AuthContext } from '../../Context/AuthContext';
import Logo from '../../assets/logo.jpg';

const NavbarAdmin = () => {
  const { user } = useContext(AuthContext);
  const bgGradient = useColorModeValue(
    'linear(to-r, #94c973, #3b7a57)', // Green gradients for light mode
    'linear(to-r, #3b7a57, #2f4f4f)' // Darker greens for dark mode
  );
  const textColor = useColorModeValue('#2f4f4f', 'white');
  const logoBorderColor = useColorModeValue('#94c973', '#3b7a57');

  return (
    <Box bgGradient={bgGradient} px={6} py={2} boxShadow="lg">
      <Flex alignItems="center">
        {/* Logo Section */}
        <Box display="flex" alignItems="center">
          <img
            src={Logo}
            alt="Zoo Logo"
            style={{
              height: '80px',
              borderRadius: '50%',
              border: `2px solid ${logoBorderColor}`,
              padding: '5px',
            }}
          />
          <Heading size="lg" color={textColor} ml={3}>
            Zoo Admin Panel
          </Heading>
        </Box>
        <Spacer />
        {/* User Info Section */}
        <VStack spacing={1} align="center">
          <Avatar
            size="md"
            src="https://bit.ly/broken-link"
            borderColor={logoBorderColor}
            borderWidth={2}
            _hover={{ borderColor: '#ffa500' }} // Orange hover effect
            transition="border-color 0.3s ease"
          />
          <Text color={textColor} fontWeight="bold">
            {user.name || 'Admin'}
          </Text>
        </VStack>
      </Flex>
    </Box>
  );
};

export default NavbarAdmin;
