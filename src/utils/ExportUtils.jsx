import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToExcel = (data, filename = 'report') => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([buf], { type: 'application/octet-stream' });
  saveAs(blob, `${filename}.xlsx`);
};

export const exportToPDF = (columns, rows, filename = 'report') => {
  const doc = new jsPDF();
  autoTable(doc, {
    head: [columns],
    body: rows,
  });
  doc.save(`${filename}.pdf`);
};
