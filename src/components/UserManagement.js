import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from './config';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const UserManagement = ({ openSidebar }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('adminTrade');
  const [accounts, setAccounts] = useState([]);

  // Modal States  
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({ email: '', balance: '', leverage: '', userName: '', margin: '', password: '', confirmPassword: '', });
  const [errors, setErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setLoading(true);
      navigate("/login");
    } else {
      fetchAccounts();
    }
    setLoading(false);
  }, [token, navigate]);

  const fetchAccounts = async () => {
    await axios.get(`${config.BackendEndpoint}/accounts`, {
      headers: {
        Authorization: token ? token : ""
      }
    })
      .then((res) => {
        setAccounts(res.data.users);
      })
      .catch((err) => {
        console.log("Error fetching accounts", err);
      });
  };

  const validate = () => {
    const tempErrors = {};
    if (!newUser.email || !newUser.email.includes('@')) {
      tempErrors.email = 'Email is required and must include "@"';
    }

    // Check if password is strong  
    if (!newUser.password || newUser.password.length < 8) {
      tempErrors.password = 'Password must be at least 8 characters long';
    }

    // Check if passwords match  
    if (newUser.password !== newUser.confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  }

  const handleCreateUser = async () => {
    if (validate()) {
      // Proceed with user creation  
      console.log('User created:', newUser);
      // Reset the form  
      await axios.post(`${config.BackendEndpoint}/createUser`, { newUser })
        .then((res) => {
        })
        .catch((error) => {
        })
      setOpenCreateModal(false);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setOpenEditModal(true);
  };

  const handleUpdateUser = async () => {
    // Logic for updating user information  
    console.log("Updated User data:", selectedUser);
    await axios.post(`${config.BackendEndpoint}/updateUser`, { newUser })
        .then((res) => {
        })
        .catch((error) => {
        })
      setOpenCreateModal(false);
    setOpenEditModal(false);
    setSelectedUser(null); // Clear selected user  
  };

  const handleDeleteUser = async (user) => {
    await axios.post(`${config.BackendEndpoint}/deleteUser`, { newUser })
        .then((res) => {
        })
        .catch((error) => {
        })
      setOpenCreateModal(false);
    setSelectedUser(user);
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    // Logic for deleting user  
    console.log("Deleted User ID:", selectedUser.id);
    setOpenDeleteModal(false);
    setSelectedUser(null); // Clear selected user  
  };

  return (
    <Container style={{ marginTop: '30px', width: '100%', textAlign: 'center' }}>
      <Box flexGrow={1} display="flex" flexDirection="column" alignItems="flex-start">
        <Typography variant="h4" style={{ marginLeft: '10%' }}>User Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreateModal(true)}
          style={{ marginBottom: '20px', marginTop: '20px' }}
        >
          Create User
        </Button>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} style={{ width: '100%' }}>
            <Table style={{ backgroundColor: '#f5f5f5' }}>
              <TableHead>
                <TableRow style={{ backgroundColor: 'rgb(13, 191, 150)', color: '#fff' }}>
                  <TableCell style={{ color: '#fff', textAlign: 'center' }}>Account Type</TableCell>
                  <TableCell style={{ color: '#fff', textAlign: 'center' }}>Balance</TableCell>
                  <TableCell style={{ color: '#fff', textAlign: 'center' }}>Equity</TableCell>
                  <TableCell style={{ color: '#fff', textAlign: 'center' }}>UserName</TableCell>
                  <TableCell style={{ color: '#fff', textAlign: 'center' }}>Margin</TableCell>
                  <TableCell style={{ color: '#fff', textAlign: 'center' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accounts && accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell style={{ textAlign: 'center' }}>{account.email}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{account.balance}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{account.leverage}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{account.userName}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>{account.margin}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      <IconButton onClick={() => handleEditUser(account)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteUser(account)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Create User Modal */}
      <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)}>
        <DialogTitle>Create User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            margin="dense"
            label="UserName"
            type="text"
            fullWidth
            variant="outlined"
            value={newUser.userName}
            onChange={(e) => setNewUser({ ...newUser, userName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Balance"
            type="number"
            fullWidth
            variant="outlined"
            value={newUser.balance}
            onChange={(e) => setNewUser({ ...newUser, balance: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Equity"
            type="number"
            fullWidth
            variant="outlined"
            value={newUser.leverage}
            onChange={(e) => setNewUser({ ...newUser, leverage: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Margin"
            type="number"
            fullWidth
            variant="outlined"
            value={newUser.margin}
            onChange={(e) => setNewUser({ ...newUser, margin: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            error={!!errors.password}
            helperText={errors.password}
          />
          <TextField
            margin="dense"
            label="Confirm Password"
            type="password"
            fullWidth
            variant="outlined"
            value={newUser.confirmPassword}
            onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateModal(false)} color="secondary">Cancel</Button>
          <Button onClick={handleCreateUser} color="primary">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {selectedUser && <>
            <TextField
              autoFocus
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={selectedUser.email}
              onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label="UserName"
              type="text"
              fullWidth
              required
              variant="outlined"
              value={selectedUser.userName}
              onChange={(e) => setSelectedUser({ ...selectedUser, userName: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Balance"
              type="number"
              fullWidth
              required
              variant="outlined"
              value={selectedUser.balance}
              onChange={(e) => setSelectedUser({ ...selectedUser, balance: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Equity"
              type="number"
              fullWidth
              required
              variant="outlined"
              value={selectedUser.leverage}
              onChange={(e) => setSelectedUser({ ...selectedUser, leverage: e.target.value })}
            />

            <TextField
              margin="dense"
              label="Margin"
              type="number"
              fullWidth
              required
              variant="outlined"
              value={selectedUser.margin}
              onChange={(e) => setSelectedUser({ ...selectedUser, margin: e.target.value })}
            />
          </>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)} color="secondary">Cancel</Button>
          <Button onClick={handleUpdateUser} color="primary">Update</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this user?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)} color="secondary">Cancel</Button>
          <Button onClick={handleConfirmDelete} color="primary">OK</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default UserManagement;