import { Box, VStack, Divider, Icon, Image, Button } from '@chakra-ui/react';
import { AiOutlineUser, AiOutlineHome } from 'react-icons/ai';
import { RiServiceLine } from 'react-icons/ri';
import { FaPaw } from 'react-icons/fa';
import Logo from '../../assets/logo.jpg';

const Sidebar = ({ activeTab, setActiveTab }) => {
  // Updated list of tab links
  const TabLinks = [
    { label: 'Vet Register', icon: AiOutlineUser },
    { label: 'Services', icon: RiServiceLine },
    { label: 'Animals', icon: FaPaw },
    { label: 'Habitat', icon: AiOutlineHome },
  ];

  return (
    <Box
      bg="#ffffff"
      w="240px"
      p={4}
      minH="100vh"
      position="sticky"
      top="0"
      boxShadow="sm"
      borderRight="1px solid #eaeaea"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <VStack align="stretch" spacing={4} mt={4} color="black">
        {TabLinks.map((tab, index) => (
          <Button
          key={tab.label}
          onClick={() => setActiveTab(index)}
          leftIcon={<Icon as={tab.icon} />}
          variant="ghost"
          justifyContent="flex-start"
          fontWeight="bold"
          isActive={activeTab === index}
          _active={{
            bgGradient: "linear(to-r, #38a169, #68d391)", // Green gradient
            color: "white" // Text color when active
          }}
          _hover={{ bg: "gray.100" }}
        >
          {tab.label}
        </Button>
        
        ))}
      </VStack>

      {/* Footer with Logo */}
      <Box mt={8} mb={4} alignContent="center">
        <VStack>
          <Divider borderColor="brand" borderWidth="1px" />
          <Image src={Logo} alt="Logo" boxSize="150px" mx="auto" />
        </VStack>
      </Box>
    </Box>
  );
};

export default Sidebar;
