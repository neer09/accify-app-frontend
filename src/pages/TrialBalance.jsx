import { useEffect, useState } from 'react';
import {
  Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Spinner,
  Container, Text, Button, Flex
} from '@chakra-ui/react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function TrialBalance() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://accify-app-backend.onrender.com/api/reports/trial-balance');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch trial balance', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getAccounts = () => {
    if (!data) return [];
    const accounts = new Set([
      ...Object.keys(data.totalDebits || {}),
      ...Object.keys(data.totalCredits || {})
    ]);
    return Array.from(accounts);
  };

  const exportToExcel = () => {
    const rows = getAccounts().map(acc => ({
      Account: acc,
      Debit: data.totalDebits?.[acc] || 0,
      Credit: data.totalCredits?.[acc] || 0
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "TrialBalance");
    XLSX.writeFile(wb, "TrialBalance.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Trial Balance", 14, 10);
    autoTable(doc, {
      startY: 20,
      head: [['Account', 'Debit', 'Credit']],
      body: getAccounts().map(acc => [
        acc, data.totalDebits?.[acc] || 0, data.totalCredits?.[acc] || 0
      ])
    });
    doc.save("TrialBalance.pdf");
  };

  return (
    <Container maxW="4xl">
      <Heading mb={6} textAlign="center">📊 Trial Balance</Heading>

      {loading ? <Spinner /> : data ? (
        <Box bg="white" rounded="md" shadow="sm" p={4} overflowX="auto">
          <Flex justify="flex-end" mb={3}>
            <Button size="sm" onClick={exportToExcel} colorScheme="teal" mr={2}>Export Excel</Button>
            <Button size="sm" onClick={exportToPDF} colorScheme="orange">Export PDF</Button>
          </Flex>
          <Table size="sm">
            <Thead bg="gray.100">
              <Tr><Th>Account</Th><Th isNumeric>Debit ₹</Th><Th isNumeric>Credit ₹</Th></Tr>
            </Thead>
            <Tbody>
              {getAccounts().map((acc) => (
                <Tr key={acc}><Td>{acc}</Td><Td isNumeric>{data.totalDebits?.[acc] || 0}</Td><Td isNumeric>{data.totalCredits?.[acc] || 0}</Td></Tr>
              ))}
              <Tr fontWeight="bold">
                <Td>Total</Td>
                <Td isNumeric>₹{data.grandTotalDebit}</Td>
                <Td isNumeric>₹{data.grandTotalCredit}</Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      ) : <Text>No data available</Text>}
    </Container>
  );
}
