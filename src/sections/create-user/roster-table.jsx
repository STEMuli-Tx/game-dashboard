import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Button,
  Typography,
  Tooltip,
} from '@mui/material';
import { useAuth } from 'src/context/authContext';
import StemuliNavigator from 'src/utils/stemuli-navigator/stemuli-navigator';

const RosterTable = () => {
  const { persistentState } = useAuth();
  const [rosterData, setRosterData] = useState([]);
  const [totalCounts, setTotalCounts] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchRosterData = async () => {
    try {
      const data = await StemuliNavigator.getRosterList(
        persistentState.userId,
        persistentState.tenantId,
        page * rowsPerPage,
        rowsPerPage
      );
      setRosterData(data.list);
      setTotalCounts(data.totalCounts);
    } catch (error) {
      console.error('Error fetching roster data:', error);
    }
  };

  useEffect(() => {
    fetchRosterData();
  }, [persistentState, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper>
      <Button
        onClick={fetchRosterData}
        variant="contained"
        color="primary"
        style={{ margin: '10px' }}
      >
        Refresh
      </Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>File Name</TableCell>
              <TableCell>Uploaded By</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rosterData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.file_name}</TableCell>
                <TableCell>{row.uploaded_by}</TableCell>
                <TableCell>
                  {row.status === 'error' ? (
                    <Tooltip title={row.status_message?.message || 'No error message'}>
                      <span style={{ color: 'red', cursor: 'pointer' }}>{row.status}</span>
                    </Tooltip>
                  ) : (
                    <span style={{ color: row.status === 'sync-completed' ? 'green' : 'inherit' }}>
                      {row.status}
                    </span>
                  )}
                </TableCell>
                <TableCell>{row.created_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={totalCounts}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default RosterTable;
