import { useEffect, useState } from 'react';
import {
  Box, Heading, Spinner, VStack, Text, Container, Button, Flex
} from '@chakra-ui/react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 
import * as XLSX from 'xlsx';

export default function ProfitLoss() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8080/api/reports/profit-loss')
      .then((res) => setData(res.data))
      .catch(console.error);
  }, []);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet([{
      "Total Income": data.totalIncome,
      "Total Expenses": data.totalExpenses,
      "Net Profit": data.netProfitOrLoss
    }]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ProfitLoss");
    XLSX.writeFile(wb, "ProfitLoss.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Profit & Loss Report", 14, 10);

    autoTable(doc, {
      startY: 20,
      head: [['Label', 'Amount']],
      body: [
        ['Total Income', `${data.totalIncome}`],
        ['Total Expenses', `${data.totalExpenses}`],
        ['Net Profit', `${data.netProfitOrLoss}`],
      ],
    });

    doc.save("ProfitLoss.pdf");
  };

  return (
    <Container maxW="3xl" py={6}>
      <Heading mb={6} textAlign="center">📈 Profit & Loss</Heading>

      {!data ? <Spinner /> : (
        <Box bg="white" p={6} rounded="md" shadow="md">
          <Flex justify="flex-end" mb={4}>
            <Button size="sm" colorScheme="teal" mr={2} onClick={exportToExcel}>Export Excel</Button>
            <Button size="sm" colorScheme="orange" onClick={exportToPDF}>Export PDF</Button>
          </Flex>
          <VStack spacing={4} align="start">
            <Text><strong>Total Income:</strong> ₹{data.totalIncome}</Text>
            <Text><strong>Total Expenses:</strong> ₹{data.totalExpenses}</Text>
            <Text><strong>Net Profit:</strong> ₹{data.netProfitOrLoss}</Text>
          </VStack>
        </Box>
      )}
    </Container>
  );
}
