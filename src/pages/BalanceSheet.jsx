import { useEffect, useState } from 'react';
import {
  Box, Heading, Spinner, VStack, Text, Container, Flex, Button
} from '@chakra-ui/react';
import axios from 'axios';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import autoTable from 'jspdf-autotable';

export default function BalanceSheet() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('https://accify-app-backend.onrender.com/api/reports/balance-sheet')
      .then((res) => setData(res.data))
      .catch(console.error);
  }, []);

  const capital = data
    ? parseFloat(data.totalAssets) - parseFloat(data.totalLiabilities)
    : 0;

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet([
      { 'Total Assets': data.totalAssets, 'Total Liabilities': data.totalLiabilities, Capital: capital }
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "BalanceSheet");
    XLSX.writeFile(wb, "BalanceSheet.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Balance Sheet", 14, 10);
    autoTable(doc, {
      startY: 20,
      body: [
        ['Total Assets', data.totalAssets],
        ['Total Liabilities', data.totalLiabilities],
        ['Capital', capital],
      ]
    });
    doc.save("BalanceSheet.pdf");
  };

  return (
    <Container maxW="3xl" py={6}>
      <Heading mb={6} textAlign="center">💰 Balance Sheet</Heading>

      {!data ? (
        <Spinner />
      ) : (
        <Box bg="white" p={6} rounded="md" shadow="md">
          <Flex justify="flex-end" mb={4}>
            <Button size="sm" colorScheme="teal" mr={2} onClick={exportToExcel}>Export Excel</Button>
            <Button size="sm" colorScheme="orange" onClick={exportToPDF}>Export PDF</Button>
          </Flex>
          <VStack spacing={4} align="start">
            <Text><strong>Total Assets:</strong> ₹{data.totalAssets}</Text>
            <Text><strong>Total Liabilities:</strong> ₹{data.totalLiabilities}</Text>
            <Text><strong>Capital:</strong> ₹{capital}</Text>
          </VStack>
        </Box>
      )}
    </Container>
  );
}
