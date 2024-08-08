import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGameService } from 'src/context/gameServiceContext';

export default function AccountManagementPage() {
  const { getAccounts } = useGameService();
  const [accounts, setAccounts] = useState([
    { id: '16651a43-8dee-4a5c-8ce4-145d9629274d', name: 'Stemuli Sandbox', shortname: 'sandbox' },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAccounts() {
      const data = await getAccounts();
      setAccounts(data);
    }
    fetchAccounts();
  }, [getAccounts]);

  const handleRowClick = (id) => {
    navigate(`/account-management/${id}`);
  };

  return (
    <Container>
      <Typography variant="h4" mb={5}>
        Account Management
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Shortname</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map((account) => (
              <TableRow
                key={account.id}
                onClick={() => handleRowClick(account.id)}
                style={{ cursor: 'pointer' }}
              >
                <TableCell>{account.id}</TableCell>
                <TableCell>{account.name}</TableCell>
                <TableCell>{account.shortname}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
