import { Box, Flex, Link, VStack, Image, Button } from '@chakra-ui/react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/accify.png';

const Layout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <Flex minH="100vh" bg="gray.50">
      {/* Sidebar */}
      <Box
        bg="white"
        w="220px"
        p={5}
        color="black"
        boxShadow="md"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Box>
          <Image src={logo} alt="Accify Logo" mb={6} maxH="50px" objectFit="contain" />

          <VStack align="start" spacing={4}>
            <Link as={NavLink} to="/" _activeLink={{ fontWeight: 'bold', color: 'blue.500' }}>
              Home
            </Link>
            <Link as={NavLink} to="/vouchers" _activeLink={{ fontWeight: 'bold', color: 'blue.500' }}>
              All Vouchers
            </Link>
            <Link as={NavLink} to="/add-voucher" _activeLink={{ fontWeight: 'bold', color: 'blue.500' }}>
              Add Voucher
            </Link>
            <Link as={NavLink} to="/ledger" _activeLink={{ fontWeight: 'bold', color: 'blue.500' }}>
              Ledger Summary
            </Link>
            <Link as={NavLink} to="/trial-balance" _activeLink={{ fontWeight: 'bold', color: 'blue.500' }}>
              Trial Balance
            </Link>
            <Link as={NavLink} to="/profit-loss" _activeLink={{ fontWeight: 'bold', color: 'blue.500' }}>
              Profit & Loss
            </Link>
            <Link as={NavLink} to="/balance-sheet" _activeLink={{ fontWeight: 'bold', color: 'blue.500' }}>
              Balance Sheet
            </Link>
          </VStack>
        </Box>

        <Button colorScheme="blue" variant="solid" onClick={handleLogout} mt={10}>
          Logout
        </Button>
      </Box>

      {/* Main Content */}
      <Box flex={1} p={6} overflow="auto">
        {children}
      </Box>
    </Flex>
  );
};

export default Layout;
