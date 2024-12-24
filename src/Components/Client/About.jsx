import {
  Container,
  Box,
  Stack,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Flex,
  useColorModeValue,
  keyframes,
  VStack,
  Divider,
} from '@chakra-ui/react';
import { GiHealthPotion, GiFarmTractor, GiPawPrint } from 'react-icons/gi';
import { motion } from 'framer-motion';
import zooImage1 from '../../assets/zoo6.jpg';
import zooImage2 from '../../assets/zoo3.jpg';
import zooImage3 from '../../assets/zoo4.jpg';

// Création d'un composant animé avec Framer Motion
const MotionBox = motion(Box);

// Animation pour un effet de fondu
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Composant pour afficher une caractéristique (feature)
const Feature = ({ text, icon, iconBg }) => (
  <MotionBox
    whileHover={{ scale: 1.05 }} // Animation au survol
    transition={{ duration: 0.3 }} // Durée de l'animation
    p={6}
    bg={useColorModeValue('white', 'gray.800')} // Couleur de fond selon le mode clair/sombre
    borderRadius="xl"
    boxShadow="lg"
    _hover={{ transform: 'translateY(-8px)', cursor: 'pointer' }} // Effet au survol
    animation={`${fadeIn} 0.5s ease-in-out`} // Animation de fondu
  >
    <Flex align="center" mb={4} direction="column" justify="center">
      {/* Icône avec style */}
      <Box
        bg={iconBg} // Couleur de fond de l'icône
        color="white"
        p={4}
        borderRadius="full"
        mb={3}
        boxShadow="md"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {icon}
      </Box>
      {/* Texte principal */}
      <Text fontSize="xl" fontWeight="bold" color={useColorModeValue('gray.800', 'white')} mb={2}>
        {text}
      </Text>
      {/* Description */}
      <Text fontSize="md" color="gray.500" textAlign="center">
        Nous nous engageons à offrir les meilleurs soins, la préservation et une expérience inoubliable pour nos animaux et nos visiteurs.
      </Text>
    </Flex>
  </MotionBox>
);

// Composant principal "About"
const About = () => {
  return (
    <Container maxW="8xl" py={16} px={{ base: 4, lg: 8 }}>
      {/* Section héroïque avec titre et description */}
      <Box
        bgGradient="linear(to-r, #D78B3C, #9C7A3A)" // Dégradé pour le fond
        p={12}
        borderRadius="xl"
        mb={12}
        width={{ base: '100%', sm: '80%', md: '60%' }} // Largeur adaptée selon la taille de l'écran
        mx="auto"
      >
        <VStack spacing={8} align="center">
          <Heading as="h2" fontSize="3xl" color="white" textAlign="center">
            À propos de Zoo Arcadia
          </Heading>
          <Text fontSize="lg" color="white" textAlign="center" maxW="xl">
            Arcadia est un zoo situé en France près de la forêt de Brocéliande, en Bretagne, depuis 1960. Nous possédons une grande
            variété d'animaux, répartis par habitat (savane, jungle, marais), et veillons chaque jour à leur santé avec l'aide de vétérinaires.
            Notre zoo est un lieu d'éducation, de conservation et d'émerveillement.
          </Text>
        </VStack>
      </Box>

      <Divider mb={12} /> {/* Ligne de séparation */}

      {/* Section des caractéristiques */}
      <VStack spacing={8} align="center" mb={12}>
        <Heading as="h2" fontSize="3xl" textAlign="center" color="gray.700">
          Ce qui nous rend spéciaux
        </Heading>
        {/* Affichage des caractéristiques en grille */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} textAlign="center">
          <Feature
            icon={<GiHealthPotion size={30} />} // Icône représentant la santé
            iconBg="green.500"
            text="Santé et Bien-être des Animaux"
          />
          <Feature
            icon={<GiFarmTractor size={30} />} // Icône représentant les pratiques écologiques
            iconBg="blue.500"
            text="Pratiques Écologiques"
          />
          <Feature
            icon={<GiPawPrint size={30} />} // Icône représentant la conservation
            iconBg="orange.500"
            text="Conservation des Animaux"
          />
        </SimpleGrid>
      </VStack>

      <Divider mb={12} /> {/* Ligne de séparation */}

      {/* Section des expositions animales */}
      <Box mt={16}>
        <Heading as="h2" fontSize="3xl" textAlign="center" mb={8} color="gray.700">
          Explorez nos Expositions Animalières
        </Heading>
        {/* Affichage des images des expositions */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          {[zooImage1, zooImage2, zooImage3].map((image, index) => (
            <Box
              key={index}
              bgImage={`url(${image})`} // Image de fond
              bgSize="cover"
              bgPosition="center"
              h="350px"
              borderRadius="xl"
              shadow="xl"
              position="relative"
              _hover={{ transform: 'scale(1.05)', transition: 'all 0.3s ease-in-out' }} // Effet au survol
            >
              {/* Superposition d'un filtre sombre */}
              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                bg="rgba(0, 0, 0, 0.4)"
                borderRadius="xl"
              />
              {/* Texte au centre de l'image */}
              <Stack
                direction="row"
                align="center"
                justify="center"
                h="100%"
                textAlign="center"
                color="white"
                p={4}
                zIndex={1}
              >
                <Text fontSize="lg" fontWeight="bold">Exposition {index + 1}</Text>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      <Divider mb={12} /> {/* Ligne de séparation */}

      {/* Section d'appel à l'action */}
      <Box mt={16} textAlign="center">
        <Heading as="h3" fontSize="2xl" mb={4}>
          Prêt à nous rejoindre ?
        </Heading>
        <Text fontSize="lg" color="gray.500" mb={8}>
          Visitez le Zoo Arcadia aujourd'hui et créez des souvenirs inoubliables avec vos proches !
        </Text>
      </Box>
    </Container>
  );
};

export default About; // Exportation du composant
