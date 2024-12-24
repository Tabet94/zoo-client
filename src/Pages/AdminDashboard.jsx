import { Box, Flex, TabPanels, TabPanel, useColorModeValue, Tabs, Text } from '@chakra-ui/react';
import { useState } from 'react';


import Sidebar from '../Components/Admin/SidebarAdmin';
import RegisterVet from '../Components/Admin/RegisterVet';

import ListServices from '../Components/Admin/ZooServices/ListServices';
import Animals from '../Components/Admin/Animals/ListAnimals'
import ListHabitat from '../Components/Admin/Habitat/ListHabitats';
import NavbarAdmin from '../Components/Admin/NavbarAdmin';


const AdminDashboard = () => {
  const bg = useColorModeValue('#f9f9f9', '#1a202c');
  const panelBg = useColorModeValue('#ffffff', '#4a5568');

  // State to manage the active tab
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Flex direction="column" minH="100vh" bg={bg}>
     <NavbarAdmin/>
      <Flex flex="1" direction={{ base: 'column', md: 'row' }} minH="calc(100vh - 60px)">
        
        {/* Sidebar with TabList */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content with TabPanels */}
        <Box flex="1" px={8} py={6} bg={bg}>
          <Tabs index={activeTab} onChange={setActiveTab} variant="soft-rounded" isFitted>
            <TabPanels bg={panelBg} borderRadius="lg" boxShadow="xl" p={6}>
              <TabPanel>
               <RegisterVet />
              </TabPanel>
              <TabPanel>
                <ListServices/>
              </TabPanel>
              
              <TabPanel>
               <Animals />
              </TabPanel>
              <TabPanel>
               <ListHabitat />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    </Flex>
  );
};

export default AdminDashboard;