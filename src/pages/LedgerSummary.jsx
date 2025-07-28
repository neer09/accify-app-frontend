import { useEffect, useState } from 'react';
import {
  Box, Heading, Select, Table, Thead, Tbody, Tr, Th, Td,
  Spinner, Container, Button, Flex
} from '@chakra-ui/react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function LedgerSummary() {
  const [account, setAccount] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSummary = async () => {
    if (!account) return;
    setLoading(true);
    try {
      const res = await axios.get(`https://accify-app.onrender.com/api/ledgers/${account}`);
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch ledger summary', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSummary();
  }, [account]);

  const exportToExcel = () => {
    if (!data) return;
    const ws = XLSX.utils.json_to_sheet(data.entries);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ledger");
    XLSX.writeFile(wb, `LedgerSummary_${account}.xlsx`);
  };

  const exportToPDF = () => {
    if (!data) return;
    const doc = new jsPDF();
    doc.text(`Ledger Summary: ${account}`, 14, 10);
    autoTable(doc, {
      startY: 20,
      head: [['Date', 'Type', 'Debit', 'Credit', 'Remarks']],
      body: data.entries.map(e => [e.date, e.type, e.debit, e.credit, e.remarks])
    });
    doc.save(`LedgerSummary_${account}.pdf`);
  };

  return (
    <Container maxW="6xl">
      <Heading mb={10} textAlign="center">📒 Ledger Summary</Heading>
      <Select placeholder="Select account" value={account} onChange={(e) => setAccount(e.target.value)} mb={5}>
        <option value="CASH">CASH</option>
        <option value="BANK">BANK</option>
        <option value="PURCHASE">PURCHASE</option>
        <option value="RENT">RENT</option>
        <option value="SALARY">SALARY</option>
        <option value="OFFICE EXPENSES">OFFICE EXPENSES</option>
        <option value="UTILITIES">UTILITIES</option>
        <option value="SALES">SALES</option>
        <option value="CREDITORS">CREDITORS</option>
        <option value="OUTPUT GST">OUTPUT GST</option>
        <option value="CAPITAL">CAPITAL</option>
        <option value="LOANS">LOANS</option>
      </Select>

      {loading ? <Spinner /> : data && (
        <Box bg="white" rounded="md" shadow="sm" p={4}>
          <Flex justify="space-between" align="center" mb={3}>
            <Box>
              <strong>Total Debit:</strong> ₹{data.totalDebit} | <strong>Total Credit:</strong> ₹{data.totalCredit}
            </Box>
            <Box>
              <Button size="sm" onClick={exportToExcel} colorScheme="teal" mr={2}>Export Excel</Button>
              <Button size="sm" onClick={exportToPDF} colorScheme="orange">Export PDF</Button>
            </Box>
          </Flex>

          <Box maxH="400px" overflowY="auto">
            <Table variant="simple" size="sm">
              <Thead position="sticky" top={0} bg="gray.100" zIndex={1}>
                <Tr>
                  <Th>Date</Th><Th>Type</Th><Th>Debit</Th><Th>Credit</Th><Th>Remarks</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.entries.map((entry, idx) => (
                  <Tr key={idx}><Td>{entry.date}</Td><Td>{entry.type}</Td><Td>₹{entry.debit}</Td><Td>₹{entry.credit}</Td><Td>{entry.remarks}</Td></Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      )}
    </Container>
  );
}
