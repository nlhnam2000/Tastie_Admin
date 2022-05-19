// import React
import React, { useEffect, useState } from 'react';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContentText,
    DialogTitle,
    DialogContent,
    Typography,
    FormControl,
    FormGroup,
    InputLabel,
    Input
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { userColumns } from 'assets/columns/gridData';
import { HOST_NAME } from 'config';

// import library
import axios from 'axios';

// ==============================|| TYPOGRAPHY ||============================== //

const LIMIT = 100;

const UserList = () => {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [rows, setRows] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openNotification, setOpenNotification] = useState(false);
    const [formData, setFormData] = useState({
        email: null,
        password: null,
        phone: null,
        first_name: null,
        last_name: null,
        role: null
    });
    const [selectedUser, setSelectedUser] = useState([]);
    const [showRemoveButton, setShowRemoveButton] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);

    const GetAllUser = async (offset, limit) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const res = await axios.post(
                `http://${HOST_NAME}:3010/v1/api/tastie/admin/get-all-user`,
                {
                    limit,
                    offset
                },
                config
            );

            if (res.data.status) {
                setRows(res.data.response.filter((item) => item.user_status !== 2));
            }
        } catch (error) {
            console.error('Cannot get all user', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (formData) => {
        try {
            const res = await axios.post(`http://${HOST_NAME}:3010/v1/api/tastie/admin/add-user`, formData);
            if (res.data.status) {
                setOpenDialog(false);
                setOpenNotification(true);
                // await GetAllUser(1, 1000000);
            }
        } catch (error) {
            console.error('Cannot add new user', error);
        }
    };

    const handleRemoveUser = async (userIdList) => {
        // this function get the array of user_id to be removed => remove multiple users

        try {
            const removeUser = async (userId) => {
                const res = await axios.put(`http://${HOST_NAME}:3010/v1/api/tastie/admin/remove-user/${userId}`);

                return res.data;
            };
            const queryList = [];
            userIdList.forEach((userId) => {
                queryList.push(removeUser(userId)); // get the query list of removing users
            });
            Promise.all(queryList).then((values) => {
                console.log('Response from removing users', values);
                GetAllUser(currentPage + 1, LIMIT); // reload the screen with new data
            });
        } catch (error) {
            console.error('Cannot remove users', error);
        }
    };

    useEffect(() => {
        GetAllUser(1, 99);
    }, []);

    useEffect(() => {
        setShowRemoveButton(selectedUser.length > 0);
    }, [selectedUser]);

    useEffect(() => {
        const FetchNewUser = async () => {
            setLoading(true);
            await GetAllUser(currentPage + 1, LIMIT);
        };

        FetchNewUser();
    }, [currentPage]);

    return (
        <MainCard
            title="User list"
            secondary={
                <>
                    {showRemoveButton && (
                        <Button
                            disableElevation
                            variant="contained"
                            onClick={() => handleRemoveUser(selectedUser)}
                            sx={{
                                marginRight: 2,
                                color: 'white'
                            }}
                            color="error"
                        >
                            Remove User
                        </Button>
                    )}
                    <Button disableElevation variant="contained" onClick={() => setOpenDialog(true)} sx={{ color: 'white' }}>
                        Add User
                    </Button>
                </>
            }
        >
            <DataGrid
                // initialState={{
                //     sorting: {
                //         sortModel: [{ field: 'user_id', sort: 'asc' }] // set descending order as default
                //     }
                // }}
                loading={loading}
                rows={rows}
                columns={userColumns}
                checkboxSelection
                disableSelectionOnClick
                getRowId={(row) => row.user_id}
                sx={{ width: '100%', height: '70vh' }}
                onPageChange={(page) => {
                    setCurrentPage(page);
                }}
                onSelectionModelChange={(userIdList, _) => {
                    console.log(userIdList);
                    setSelectedUser(userIdList);
                }}
                pageSize={100}
                paginationMode="server"
                rowCount={30000}
                rowsPerPageOptions={[100]}
            />
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" sx={{ width: '100%', alignItems: 'center' }}>
                    <Typography variant="h3">Add new User</Typography>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" sx={{ marginRight: 20 }}>
                        Please enter all these required information for the new user
                    </DialogContentText>
                    <FormControl sx={{ width: '100%', py: 2 }}>
                        <FormGroup
                            sx={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-around'
                            }}
                            row
                        >
                            <FormControl sx={{ width: '40%' }}>
                                <InputLabel htmlFor="email">Email</InputLabel>
                                <Input
                                    id="email"
                                    aria-describedby="my-helper-text"
                                    onChange={(event) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            [event.target.id]: event.target.value
                                        }))
                                    }
                                />
                            </FormControl>
                            <FormControl sx={{ width: '40%' }}>
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <Input
                                    id="password"
                                    aria-describedby="my-helper-text"
                                    type="password"
                                    onChange={(event) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            [event.target.id]: event.target.value
                                        }))
                                    }
                                />
                            </FormControl>
                        </FormGroup>

                        <FormGroup
                            sx={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-around',
                                marginTop: 5
                            }}
                            row
                        >
                            <FormControl sx={{ width: '40%' }}>
                                <InputLabel htmlFor="phone">Phone number</InputLabel>
                                <Input
                                    id="phone"
                                    aria-describedby="my-helper-text"
                                    onChange={(event) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            [event.target.id]: parseFloat(event.target.value)
                                        }))
                                    }
                                />
                            </FormControl>
                            <FormControl sx={{ width: '40%' }}>
                                <InputLabel htmlFor="first_name">First Name</InputLabel>
                                <Input
                                    id="first_name"
                                    aria-describedby="my-helper-text"
                                    onChange={(event) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            [event.target.id]: event.target.value
                                        }))
                                    }
                                />
                            </FormControl>
                        </FormGroup>

                        <FormGroup
                            sx={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-around',
                                marginTop: 5
                            }}
                            row
                        >
                            <FormControl sx={{ width: '40%' }}>
                                <InputLabel htmlFor="last_name">Last Name</InputLabel>
                                <Input
                                    id="last_name"
                                    aria-describedby="my-helper-text"
                                    onChange={(event) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            [event.target.id]: event.target.value
                                        }))
                                    }
                                />
                            </FormControl>
                            <FormControl sx={{ width: '40%' }}>
                                <InputLabel htmlFor="role">Role</InputLabel>
                                <Input
                                    id="role"
                                    aria-describedby="my-helper-text"
                                    onChange={(event) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            [event.target.id]: parseFloat(event.target.value)
                                        }))
                                    }
                                />
                            </FormControl>
                        </FormGroup>

                        {/* <Button
                                variant="contained"
                                color="primary"
                                sx={{ margin: 'auto', marginTop: 10 }}
                                onClick={(event) => {
                                    event.preventDefault();
                                    handleAddEcoupon(formData);
                                }}
                            >
                                Add Ecoupon
                            </Button> */}
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={() => handleAddUser(formData)} autoFocus>
                        Apply
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Notification dialog */}
            <Dialog
                open={openNotification}
                onClose={() => setOpenNotification(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Add new user successfully</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">The new user has been added in the database</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setOpenDialog(false);
                            GetAllUser(1, 1000000);
                        }}
                    >
                        Got it
                    </Button>
                </DialogActions>
            </Dialog>
        </MainCard>
    );
};

export default UserList;
