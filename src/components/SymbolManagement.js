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
    Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const SymbolManagement = ({ openSidebar }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('adminTrade');
    const [symbols, setSymbol] = useState([]);

    // Modal States
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newUser, setNewUser] = useState({
        name: '',
        type: '',
        code: '',
        pipSize: '',
    });
    const [errors, setErrors] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setLoading(true);
            navigate('/login');
        } else {
            fetchSymbols();
        }
        setLoading(false);
    }, [token]);

    const fetchSymbols = async () => {
        await axios
            .get(`${config.BackendEndpoint}/getSymbols`, {
                headers: {
                    Authorization: token ? token : '',
                },
            })
            .then((res) => {
                setSymbol(res.data.symbols);
            })
            .catch((err) => {
                console.log('Error fetching symbols', err);
            });
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toISOString().split('T')[0];
    };

    const validate = () => {
        // const tempErrors = {};
        // if (!newUser.email || !newUser.email.includes('@')) {
        //     tempErrors.email = 'Email is required and must include "@"';
        // }

        // Check if password is strong
        // if (!newUser.password || newUser.password.length < 8) {
        //     tempErrors.password = 'Password must be at least 8 characters long';
        // }

        // Check if passwords match
        // if (newUser.password !== newUser.confirmPassword) {
        //     tempErrors.confirmPassword = 'Passwords do not match';
        // }

        // setErrors(tempErrors);
        // return Object.keys(tempErrors).length === 0;
        return true;
    };

    const handleCreateUser = async () => {
        if (validate()) {
            // Reset the form
            await axios
                .post(`${config.BackendEndpoint}/createSymbol`, newUser, {
                    headers: {
                        Authorization: token ? token : '',
                    },
                })
                .then((res) => {
                    fetchSymbols();
                })
                .catch((error) => {});
            setOpenCreateModal(false);
        }
    };

    const handleEditUser = (user) => {
        console.log('adsfadsfadsf', user);
        user = { ...user, symbolId: user.id };
        setSelectedUser(user);
        setOpenEditModal(true);
    };

    const handleUpdateUser = async () => {
        // Logic for updating user information
        await axios
            .post(`${config.BackendEndpoint}/updateSymbol`, selectedUser, {
                headers: {
                    Authorization: token ? token : '',
                },
            })
            .then((res) => {
                fetchSymbols();
            })
            .catch((error) => {});
        setOpenCreateModal(false);
        setOpenEditModal(false);
        setSelectedUser(null); // Clear selected user
    };

    const handleDeleteUser = async () => {
        await axios
            .post(
                `${config.BackendEndpoint}/deleteSymbol`,
                { symbolId: selectedUser.id },
                {
                    headers: {
                        Authorization: token ? token : '',
                    },
                }
            )
            .then((res) => {
                fetchSymbols();
                setOpenDeleteModal(false);
            })
            .catch((error) => {});
        setOpenCreateModal(false);
    };

    const handleConfirmDelete = (user) => {
        // Logic for deleting user
        setSelectedUser(user);
        setOpenDeleteModal(true);
    };

    return (
        <Container
            style={{ marginTop: '30px', width: '100%', textAlign: 'center' }}
        >
            <Box
                flexGrow={1}
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
            >
                <Typography
                    variant="h4"
                    style={{
                        marginLeft: '20vw',
                        color: 'white',
                        fontFamily: 'nycd',
                        fontWeight: '1000',
                    }}
                >
                    Symbol Management
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenCreateModal(true)}
                    style={{ marginBottom: '20px', marginTop: '20px' }}
                >
                    Create Symbol
                </Button>

                {loading ? (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="200px"
                    >
                        <CircularProgress />
                    </Box>
                ) : symbols.length > 0 ? ( // Ensure accounts is not empty
                    <TableContainer component={Paper} style={{ width: '100%' }}>
                        <Table style={{ backgroundColor: '#f5f5f5' }}>
                            <TableHead>
                                <TableRow
                                    style={{
                                        backgroundColor: 'rgb(13, 191, 150)',
                                        color: '#fff',
                                    }}
                                >
                                    <TableCell style={{ color: '#fff' }}>
                                        Name
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                        Type
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                        Code
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                        PipSize
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                        CreateAt
                                    </TableCell>
                                    <TableCell style={{ color: '#fff' }}>
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {symbols.map((symbol) => (
                                    <TableRow key={symbol.id}>
                                        <TableCell>{symbol.name}</TableCell>
                                        <TableCell>{symbol.type}</TableCell>
                                        <TableCell>{symbol.code}</TableCell>
                                        <TableCell>{symbol.pip_size}</TableCell>
                                        <TableCell>
                                            {formatDate(symbol.createdAt)}
                                        </TableCell>
                                        <TableCell
                                            style={{ textAlign: 'center' }}
                                        >
                                            <IconButton
                                                onClick={() =>
                                                    handleEditUser(symbol)
                                                }
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={() =>
                                                    handleConfirmDelete(symbol)
                                                }
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography variant="h6" style={{ color: 'white' }}>
                        No users found.
                    </Typography>
                )}
            </Box>

            {/* Create User Modal */}
            <Dialog
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
            >
                <DialogTitle>Create Symbol</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newUser.name}
                        onChange={(e) =>
                            setNewUser({ ...newUser, name: e.target.value })
                        }
                        error={!!errors.email}
                        helperText={errors.email}
                        required
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Type"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newUser.type}
                        onChange={(e) =>
                            setNewUser({ ...newUser, type: e.target.value })
                        }
                        error={!!errors.email}
                        helperText={errors.email}
                        required
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Code"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newUser.code}
                        onChange={(e) =>
                            setNewUser({ ...newUser, code: e.target.value })
                        }
                        error={!!errors.email}
                        helperText={errors.email}
                        required
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="PipSize"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newUser.pip_size}
                        onChange={(e) =>
                            setNewUser({ ...newUser, pip_size: e.target.value })
                        }
                        error={!!errors.email}
                        helperText={errors.email}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenCreateModal(false)}
                        color="secondary"
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleCreateUser} color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit User Modal */}
            <Dialog
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
            >
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Name"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={selectedUser.name}
                                onChange={(e) =>
                                    setSelectedUser({
                                        ...selectedUser,
                                        name: e.target.value,
                                    })
                                }
                                error={!!errors.email}
                                helperText={errors.email}
                                required
                            />
                            <TextField
                                margin="dense"
                                label="Type"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={selectedUser.type}
                                onChange={(e) =>
                                    setSelectedUser({
                                        ...selectedUser,
                                        type: e.target.value,
                                    })
                                }
                                error={!!errors.email}
                                helperText={errors.email}
                                required
                            />
                            <TextField
                                margin="dense"
                                label="Code"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={selectedUser.code}
                                onChange={(e) =>
                                    setSelectedUser({
                                        ...selectedUser,
                                        code: e.target.value,
                                    })
                                }
                                error={!!errors.email}
                                helperText={errors.email}
                                required
                            />
                            <TextField
                                margin="dense"
                                label="PipSize"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={selectedUser.pip_size}
                                onChange={(e) =>
                                    setSelectedUser({
                                        ...selectedUser,
                                        pip_size: e.target.value,
                                    })
                                }
                                error={!!errors.email}
                                helperText={errors.email}
                                required
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenEditModal(false)}
                        color="secondary"
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleUpdateUser} color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this symbol?
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenDeleteModal(false)}
                        color="secondary"
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteUser} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default SymbolManagement;
