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
  IconButton  
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
  const [newUser, setNewUser] = useState({ email: '', balance: '', leverage: '', userName: '', margin: '' });  

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

  const handleCreateUser = () => {  
    // Logic for creating a new user  
    console.log("New User data:", newUser);  
    // Reset the form or close the modal after creating  
    setOpenCreateModal(false);  
    setNewUser({ email: '', balance: '', leverage: '', userName: '', margin: '' }); // Reset form  
  };  

  const handleEditUser = (user) => {  
    setSelectedUser(user);  
    setOpenEditModal(true);  
  };  

  const handleUpdateUser = () => {  
    // Logic for updating user information  
    console.log("Updated User data:", selectedUser);  
    setOpenEditModal(false);  
    setSelectedUser(null); // Clear selected user  
  };  

  const handleDeleteUser = (user) => {  
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
    <Container style={{ marginTop: '30px',  width: '100%', textAlign: 'center' }}>  
      <Box flexGrow={1} display="flex" flexDirection="column" alignItems="flex-start">  
        <Typography variant="h4" style={{marginLeft: '10%'}}>User Management</Typography>  
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
          <TableContainer component={Paper} style={{width: '100%'}}>  
            <Table style={{ backgroundColor: '#f5f5f5' }}>  
              <TableHead>  
                <TableRow style={{ backgroundColor: 'rgb(13, 191, 150)', color: '#fff' }}>  
                  <TableCell style={{ color: '#fff', textAlign:'center' }}>Account Type</TableCell>  
                  <TableCell style={{ color: '#fff', textAlign:'center' }}>Balance</TableCell>  
                  <TableCell style={{ color: '#fff', textAlign:'center' }}>Equity</TableCell>  
                  <TableCell style={{ color: '#fff', textAlign:'center' }}>UserName</TableCell>  
                  <TableCell style={{ color: '#fff', textAlign:'center' }}>Margin</TableCell>  
                  <TableCell style={{ color: '#fff', textAlign:'center' }}>Actions</TableCell>   
                </TableRow>  
              </TableHead>  
              <TableBody>  
                {accounts && accounts.map((account) => (  
                  <TableRow key={account.id}>  
                    <TableCell style={{ textAlign:'center' }}>{account.email}</TableCell>  
                    <TableCell style={{ textAlign:'center' }}>{account.balance}</TableCell>  
                    <TableCell style={{ textAlign:'center' }}>{account.leverage}</TableCell>  
                    <TableCell style={{ textAlign:'center' }}>{account.userName}</TableCell>  
                    <TableCell style={{ textAlign:'center' }}>{account.margin}</TableCell>  
                    <TableCell style={{ textAlign:'center' }}>  
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
            label="UserName"  
            type="text"  
            fullWidth  
            variant="outlined"  
            value={newUser.userName}  
            onChange={(e) => setNewUser({ ...newUser, userName: e.target.value })}  
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