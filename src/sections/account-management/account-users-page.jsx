import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { useGameService } from 'src/context/gameServiceContext';

export default function AccountUsersPage() {
  const { id } = useParams();
  const { getUsersByAccountId } = useGameService();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const data = await getUsersByAccountId(id);
      setUsers(data);
    }
    fetchUsers();
  }, [id, getUsersByAccountId]);

  return (
    <Container>
      <Typography variant="h4" mb={5}>
        Users for Account {id}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
