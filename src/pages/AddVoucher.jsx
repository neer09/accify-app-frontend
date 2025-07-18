import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Heading,
  useColorModeValue,
  Container,
  SimpleGrid,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddVoucher() {
  const bg = useColorModeValue('white', 'gray.800');
  const border = useColorModeValue('gray.200', 'gray.700');

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    voucherType: 'JOURNAL',
    debitAccountType: '',
    debitAmount: '',
    creditAccountType: '',
    creditAmount: '',
    remarks: '',
  });

  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState('success');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post('https://accify-app-backend.onrender.com/api/vouchers', form);
      setMessage('✅ Voucher added successfully!');
      setStatus('success');
      setTimeout(() => {
        setMessage(null);
        navigate('/add-voucher');
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to add voucher.');
      setStatus('error');
      setTimeout(() => setMessage(null), 2000);
    }
  };

  return (
    <Box bg={useColorModeValue('gray.50', 'gray.900')} py={6} minH="100vh">
      <Container maxW="4xl">
        <Box
          bg={bg}
          px={6}
          py={5}
          rounded="md"
          shadow="md"
          border="1px solid"
          borderColor={border}
        >
          <Heading size="md" mb={5} textAlign="center">
            ➕ Add New Voucher
          </Heading>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <FormControl isRequired>
              <FormLabel fontSize="sm">Date</FormLabel>
              <Input type="date" name="date" value={form.date} onChange={handleChange} size="sm" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="sm">Voucher Type</FormLabel>
              <Select name="voucherType" value={form.voucherType} onChange={handleChange} size="sm">
                <option value="JOURNAL">JOURNAL</option>
                <option value="PAYMENT">PAYMENT</option>
                <option value="RECEIPT">RECEIPT</option>
                <option value="SALES">SALES</option>
                <option value="PURCHASE">PURCHASE</option>
                <option value="CONTRA">CONTRA</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="sm">Debit Account</FormLabel>
              <Select name="debitAccountType" value={form.debitAccountType} onChange={handleChange} size="sm">
                <option value="CASH">CASH</option>
                <option value="BANK">BANK</option>
                <option value="PURCHASE">PURCHASE</option>
                <option value="RENT">RENT</option>
                <option value="SALARY">SALARY</option>
                <option value="OFFICE EXPENSES">OFFICE EXPENSES</option>
                <option value="UTILITIES">UTILITIES</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="sm">Debit Amount</FormLabel>
              <Input type="number" name="debitAmount" value={form.debitAmount} onChange={handleChange} size="sm" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="sm">Credit Account</FormLabel>
              <Select name="creditAccountType" value={form.creditAccountType} onChange={handleChange} size="sm">
                <option value="SALES">SALES</option>
                <option value="CREDITORS">CREDITORS</option>
                <option value="OUTPUT GST">OUTPUT GST</option>
                <option value="CAPITAL">CAPITAL</option>
                <option value="LOANS">LOANS</option>
                <option value="BANK">BANK</option>
                <option value="CASH">CASH</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="sm">Credit Amount</FormLabel>
              <Input type="number" name="creditAmount" value={form.creditAmount} onChange={handleChange} size="sm" />
            </FormControl>
          </SimpleGrid>

          <FormControl mt={4}>
            <FormLabel fontSize="sm">Remarks</FormLabel>
            <Textarea
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
              size="sm"
              resize="vertical"
              rows={2}
            />
          </FormControl>

          <Button
            colorScheme="teal"
            size="sm"
            mt={5}
            w="full"
            onClick={handleSubmit}
          >
            Submit Voucher
          </Button>

          {message && (
            <Alert status={status} mt={4} borderRadius="md">
              <AlertIcon />
              {message}
            </Alert>
          )}
        </Box>
      </Container>
    </Box>
  );
}
