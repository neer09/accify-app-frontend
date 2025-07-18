import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Image,
} from '@chakra-ui/react';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/accify.png'; // ✅ adjust path if needed

export default function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:8080/api/users/login', {
        userName,
        password,
      });

      if (res.status === 200) {
        toast({
          title: 'Login successful',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });

        localStorage.setItem('userName', userName);
        navigate('/'); // Redirect to dashboard
      }
    } catch (err) {
      toast({
        title: 'Login failed',
        description: 'Invalid username or password',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="md" mt={20}>
      <Box bg="white" p={6} rounded="md" shadow="md">
        {/* ✅ Company Logo */}
        <Image
          src={logo}
          alt="Accify"
          mx="auto"
          mb={6}
          boxSize="180px"
          objectFit="contain"
        />
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your username"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </FormControl>
          <Button colorScheme="blue" width="full" onClick={handleLogin}>
            Login
          </Button>
        </VStack>
      </Box>
    </Container>
  );
}
