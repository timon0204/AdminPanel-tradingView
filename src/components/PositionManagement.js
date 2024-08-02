import React, { useEffect, useState } from 'react';  
import axios from 'axios';  
import config from './config';  
import { useNavigate } from 'react-router-dom';  
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, Box, CircularProgress } from '@mui/material';  

const PositionManagement = ({ openSidebar }) => {  
  const navigate = useNavigate();  
  const [loading, setLoading] = useState(false);  
  const token = localStorage.getItem('adminTrade');  
  const [accounts, setAccounts] = useState([]);  
  
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

  return (  
    <Container style={{ marginTop: '30px',  width: '100%', textAlign: 'center' }}>  
      <Box flexGrow={1}>  
        <Typography variant="h4" style={{marginLeft: '10%'}}>Position Management</Typography>  
        {loading ? (  
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">  
            <CircularProgress />  
          </Box>  
        ) : (  
          <TableContainer component={Paper} style={{width: '100%'}}>  
            <Table style={{ backgroundColor: '#f5f5f5' }}>  
              <TableHead>  
                <TableRow style={{ backgroundColor: 'rgb(13, 191, 150)', color: '#fff' }}>  
                  <TableCell style={{ color: '#fff' }}>Account Type</TableCell>  
                  <TableCell>Balance</TableCell>  
                  <TableCell>Equity</TableCell>  
                  <TableCell>UserName</TableCell>  
                  <TableCell>Margin</TableCell>  
                </TableRow>  
              </TableHead>  
              <TableBody>  
                {accounts && accounts.map((account) => (  
                  <TableRow key={account.id}>  
                    <TableCell>{account.email}</TableCell>  
                    <TableCell>{account.balance}</TableCell>  
                    <TableCell>{account.leverage}</TableCell>  
                    <TableCell>{account.userName}</TableCell>  
                    <TableCell>{account.margin}</TableCell>  
                  </TableRow>  
                ))}  
              </TableBody>  
            </Table>  
          </TableContainer>  
        )}  
      </Box>  
    </Container>  
  );  
};  

export default PositionManagement;