import React from 'react';  
import { List, ListItem, ListItemIcon, ListItemText, Drawer, IconButton, Box } from '@mui/material';  
import DashboardIcon from '@mui/icons-material/Dashboard';  
import { Group, EuroSymbol, MoneyTwoTone } from '@mui/icons-material';  
import ExitToApp from '@mui/icons-material/ExitToApp';  
import { useLocation, useNavigate } from 'react-router-dom';  
import { useDispatch } from 'react-redux';  
import { logout } from '../features/authSlice';  
import CloseIcon from '@mui/icons-material/Close';   

const Sidebar = ({ open, onClose }) => {  
    const location = useLocation();  
    const dispatch = useDispatch();  
    const navigate = useNavigate();  

    // Determine selected item based on current location  
    const selectedItem = location.pathname;  

    const handleNavigation = (path) => {  
        navigate(path); // Navigate to the new path using react-router  
        // Commented out to keep sidebar open  
        // onClose(); // If you want to close it, leave this line uncommented  
    };  

    const handleLogout = () => {  
        dispatch(logout());  
        localStorage.removeItem('adminTrade');  
        navigate("/login");  
    };  

    return (  
        <Drawer  
            variant="persistent"  
            anchor="left"  
            open={open}  
            sx={  
                open ? {  
                    width: 240,  
                    '& .MuiDrawer-paper': {  
                        width: 240,  
                        boxSizing: 'border-box',  
                    },  
                } : ''  
            }  
        >  
            <Box display="flex" alignItems="center" justifyContent="flex-start" p={2}>  
                <IconButton onClick={onClose}>  
                    <CloseIcon />  
                </IconButton>  
            </Box>  
            <List>  
                <ListItem onClick={() => handleNavigation('/dashboard')} selected={selectedItem === '/dashboard'}>  
                    <ListItemIcon><DashboardIcon /></ListItemIcon>  
                    <ListItemText primary="Dashboard" style={{ fontWeight: selectedItem === '/dashboard' ? 'bold' : 'normal' }} />  
                </ListItem>  
                <ListItem onClick={() => handleNavigation('/userManagement')} selected={selectedItem === '/userManagement'}>  
                    <ListItemIcon><Group /></ListItemIcon>  
                    <ListItemText primary="Users" style={{ fontWeight: selectedItem === '/userManagement' ? 'bold' : 'normal' }} />  
                </ListItem>  
                <ListItem onClick={() => handleNavigation('/symbolManagement')} selected={selectedItem === '/symbolManagement'}>  
                    <ListItemIcon><EuroSymbol /></ListItemIcon>  
                    <ListItemText primary="Symbol" style={{ fontWeight: selectedItem === '/symbolManagement' ? 'bold' : 'normal' }} />  
                </ListItem>  
                <ListItem onClick={() => handleNavigation('/positionManagement')} selected={selectedItem === '/positionManagement'}>  
                    <ListItemIcon><MoneyTwoTone /></ListItemIcon>  
                    <ListItemText primary="Position" style={{ fontWeight: selectedItem === '/positionManagement' ? 'bold' : 'normal' }} />  
                </ListItem>  
                <ListItem onClick={handleLogout}>  
                    <ListItemIcon><ExitToApp /></ListItemIcon>  
                    <ListItemText primary="Logout" />  
                </ListItem>  
            </List>  
        </Drawer>  
    );  
};  

export default Sidebar;