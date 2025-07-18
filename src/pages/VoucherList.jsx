import {
  Box, Text, Heading, Container, HStack, VStack, Spinner,
  IconButton, useToast, useDisclosure, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalCloseButton, ModalBody,
  ModalFooter, Button, Input, FormControl, FormLabel,
  AlertDialog, AlertDialogOverlay, AlertDialogContent,
  AlertDialogHeader, AlertDialogBody, AlertDialogFooter
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const columnLabels = {
  id: 'ID',
  date: 'Date',
  voucherType: 'Type',
  debitAccountType: 'Debit A/C',
  debitAmount: 'Debit ₹',
  creditAccountType: 'Credit A/C',
  creditAmount: 'Credit ₹',
  remarks: 'Remarks',
};

export default function VoucherList() {
  const [vouchers, setVouchers] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [voucherToDelete, setVoucherToDelete] = useState(null);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: isDeleteOpen,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  const cancelRef = useRef();

  const fetchVouchers = () => {
    axios.get('https://accify-app-backend.onrender.com/api/vouchers')
      .then((res) => {
        const data = res.data;
        setVouchers(data);
        if (data.length > 0) setColumns(Object.keys(data[0]));
        setLoading(false);
      })
      .catch(() => {
        toast({ title: 'Failed to fetch vouchers', status: 'error', duration: 3000 });
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const confirmDelete = () => {
    if (!voucherToDelete) return;
    axios.delete(`https://accify-app-backend.onrender.com/api/vouchers/${voucherToDelete.id}`)
      .then(() => {
        toast({ title: 'Voucher deleted', status: 'success', duration: 2000 });
        fetchVouchers();
      })
      .catch(() => {
        toast({ title: 'Failed to delete', status: 'error', duration: 2000 });
      })
      .finally(() => {
        setVoucherToDelete(null);
        onCloseDelete();
      });
  };

  const handleEditClick = (voucher) => {
    setSelectedVoucher({ ...voucher });
    onOpen();
  };

  const handleEditSubmit = () => {
    axios.put(`https://accify-app-backend.onrender.com/api/vouchers/${selectedVoucher.id}`, selectedVoucher)
      .then(() => {
        toast({ title: 'Voucher updated', status: 'success', duration: 2000 });
        onClose();
        fetchVouchers();
      })
      .catch(() => {
        toast({ title: 'Failed to update voucher', status: 'error', duration: 2000 });
      });
  };

  const handleChange = (field, value) => {
    setSelectedVoucher((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Box bg="gray.400" minH="100vh" py={6} overflowX="hidden">
      <Container maxW="container.lg">
        <Heading mb={6} textAlign="center" color="white">📋 Vouchers</Heading>

        {loading && <Spinner color="teal.500" size="lg" />}

        <Box border="1px solid" borderColor="gray.300" bg="white" rounded="md" shadow="sm" p={3}>
          <Box overflowX="auto">
            <Box maxH="500px" overflowY="auto" pr={1}>
              <VStack spacing={2} align="stretch" minW="max-content">
                {/* Header */}
                <HStack fontWeight="bold" bg="gray.200" position="sticky" top={0} zIndex={1}>
                  {columns.map(col => (
                    <Box key={col} flex={col === 'remarks' ? 2 : 1} minW={col === 'remarks' ? '200px' : '100px'}>
                      {columnLabels[col]}
                    </Box>
                  ))}
                  <Box minW="100px">Actions</Box>
                </HStack>

                {/* Data */}
                {vouchers.map((v) => (
                  <HStack key={v.id} bg="gray.50" p={2} rounded="md" _hover={{ bg: 'gray.100' }}>
                    {columns.map(col => (
                      <Box key={col} flex={col === 'remarks' ? 2 : 1} minW={col === 'remarks' ? '200px' : '100px'}>
                        {v[col]}
                      </Box>
                    ))}
                    <HStack minW="100px">
                      <IconButton icon={<EditIcon />} size="sm" aria-label="Edit" onClick={() => handleEditClick(v)} />
                      <IconButton
                        icon={<DeleteIcon />}
                        size="sm"
                        aria-label="Delete"
                        colorScheme="red"
                        onClick={() => {
                          setVoucherToDelete(v);
                          onOpenDelete();
                        }}
                      />
                    </HStack>
                  </HStack>
                ))}
              </VStack>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Voucher</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedVoucher && (
              <>
                <FormControl mb={3}>
                  <FormLabel>Date</FormLabel>
                  <Input type="date" value={selectedVoucher.date} onChange={(e) => handleChange('date', e.target.value)} />
                </FormControl>
                <FormControl mb={3}>
                  <FormLabel>Type</FormLabel>
                  <Input value={selectedVoucher.voucherType} onChange={(e) => handleChange('voucherType', e.target.value)} />
                </FormControl>
                <FormControl mb={3}>
                  <FormLabel>Debit A/C</FormLabel>
                  <Input value={selectedVoucher.debitAccountType} onChange={(e) => handleChange('debitAccountType', e.target.value)} />
                </FormControl>
                <FormControl mb={3}>
                  <FormLabel>Debit ₹</FormLabel>
                  <Input type="number" value={selectedVoucher.debitAmount} onChange={(e) => handleChange('debitAmount', e.target.value)} />
                </FormControl>
                <FormControl mb={3}>
                  <FormLabel>Credit A/C</FormLabel>
                  <Input value={selectedVoucher.creditAccountType} onChange={(e) => handleChange('creditAccountType', e.target.value)} />
                </FormControl>
                <FormControl mb={3}>
                  <FormLabel>Credit ₹</FormLabel>
                  <Input type="number" value={selectedVoucher.creditAmount} onChange={(e) => handleChange('creditAmount', e.target.value)} />
                </FormControl>
                <FormControl mb={3}>
                  <FormLabel>Remarks</FormLabel>
                  <Input value={selectedVoucher.remarks} onChange={(e) => handleChange('remarks', e.target.value)} />
                </FormControl>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleEditSubmit}>Save</Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onCloseDelete}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Voucher
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this voucher? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCloseDelete}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
