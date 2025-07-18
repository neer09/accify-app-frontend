import {
  Box,
  Image,
  Icon,
  Text,
  VStack,
  SimpleGrid,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react';
import {
  AddIcon,
  ViewIcon,
  RepeatClockIcon,
  CalendarIcon,
} from '@chakra-ui/icons';
import { MdShowChart } from 'react-icons/md';         
import { FaMoneyBillWave } from 'react-icons/fa';   
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const features = [
  {
    title: 'Add Voucher',
    description: 'Quickly create accounting vouchers',
    icon: AddIcon,
    route: '/add-voucher',
  },
  {
    title: 'View Vouchers',
    description: 'Track all recorded vouchers',
    icon: ViewIcon,
    route: '/vouchers',
  },
  {
    title: 'Ledger Reports',
    description: 'View account-wise ledgers and balances',
    icon: RepeatClockIcon,
    route: '/ledger',
  },
  {
    title: 'Trial Balance',
    description: 'View summary of total debits and credits',
    icon: CalendarIcon,
    route: '/trial-balance',
  },
  {
    title: 'Profit & Loss',
    description: 'Check business income vs expenses',
    icon: MdShowChart,
    route: '/profit-loss',
  },
  {
    title: 'Balance Sheet',
    description: 'View assets, liabilities, capital',
    icon: FaMoneyBillWave,
    route: '/balance-sheet',
  },
];

export default function Dashboard() {
  const cardBg = useColorModeValue('white', 'gray.800');
  const navigate = useNavigate();

  return (
    <Flex direction="column" minH="90vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Box flex="1" py={8}>
        <VStack mb={12}>
          <Image src={logo} alt="SHIVAM LOGISTICS" maxH="60px" objectFit="contain" />
        </VStack>

        <Flex justify="center">
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={8} maxW="6xl">
            {features.map((feature) => (
              <Box
                key={feature.title}
                p={6}
                bg={cardBg}
                rounded="md"
                shadow="md"
                cursor="pointer"
                textAlign="center"
                _hover={{
                  shadow: 'lg',
                  transform: 'scale(1.03)',
                  bg: useColorModeValue('gray.100', 'gray.700'),
                }}
                transition="all 0.2s ease-in-out"
                onClick={() => navigate(feature.route)}
              >
                <VStack spacing={3}>
                  <Icon as={feature.icon} boxSize={8} color="teal.500" />
                  <Text fontSize="lg" fontWeight="bold">{feature.title}</Text>
                  <Text fontSize="sm" color="gray.600">{feature.description}</Text>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </Flex>
      </Box>

      <Box as="footer" py={4} textAlign="center" color="gray.500">
        © {new Date().getFullYear()} Accify 1.0
      </Box>
    </Flex>
  );
}
