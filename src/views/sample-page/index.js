import React, { useEffect, useState } from 'react';

// material-ui
import { Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// libraries
import axios from 'axios';

// ==============================|| SAMPLE PAGE ||============================== //

const columns = [
    { field: 'user_id', headerName: 'User ID', width: 100 },
    { field: 'first_name', headerName: 'First Name', width: 100, editable: true },
    { field: 'last_name', headerName: 'Last Name', width: 100, editable: true },
    { field: 'gender', headerName: 'Gender', width: 100, editable: true },
    { field: 'birthday', headerName: 'Birthday', width: 100, editable: true },
    { field: 'email', headerName: 'Email', width: 100, editable: true },
    { field: 'phone', headerName: 'Phone', width: 100, editable: true },
    { field: 'password', headerName: 'Password', width: 100, editable: true },
    { field: 'role', headerName: 'Role', width: 100, editable: true },
    { field: 'user_token', headerName: 'User Token', width: 100, editable: true },
    { field: 'register_at', headerName: 'Register at', width: 100, editable: true },
    { field: 'update_at', headerName: 'Update at', width: 100, editable: true },
    { field: 'delete_at', headerName: 'Delete at', width: 100, editable: true },
    { field: 'avatar', headerName: 'Avatar', width: 100, editable: true }
];

const rows = [
    {
        user_id: 1,
        first_name: 'John',
        last_name: 'Doe',
        gender: 'Male',
        birthday: '20/02/2000',
        email: 'johndoe@gmail.com',
        phone: 1234567890,
        password: 'ioasudfhbiawuehfioawusdfcqwefq',
        role: 3,
        user_token: 'ajshkdfquiawyebgquiwyebgqu',
        register_at: '20/02/2022',
        update_at: null,
        delete_at: null,
        avatar: 'https://localhost:3000/avatar.png'
    },
    {
        user_id: 2,
        first_name: 'John',
        last_name: 'Doe',
        gender: 'Male',
        birthday: '20/02/2000',
        email: 'johndoe@gmail.com',
        phone: 1234567890,
        password: 'ioasudfhbiawuehfioawusdfcqwefq',
        role: 3,
        user_token: 'ajshkdfquiawyebgquiwyebgqu',
        register_at: '20/02/2022',
        update_at: null,
        delete_at: null,
        avatar: 'https://localhost:3000/avatar.png'
    }
];

const SamplePage = () => {
    const [rows, setRows] = useState([]);

    const GetAllUser = async (offset, limit) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const res = await axios.post(
                'http://localhost:3010/v1/api/tastie/admin/get-all-user',
                {
                    limit,
                    offset
                },
                config
            );

            if (res.data.status) {
                setRows(res.data.response);
            }
        } catch (error) {
            console.error('Cannot get all user', error);
        }
    };

    useEffect(() => {
        GetAllUser(1, 39130);
    }, []);

    return (
        <MainCard title="User list">
            <Typography variant="body2">
                Lorem ipsum dolor sit amen, consenter nipissing eli, sed do elusion tempos incident ut laborers et doolie magna alissa. Ut
                enif ad minim venice, quin nostrum exercitation illampu laborings nisi ut liquid ex ea commons construal. Duos aube grue
                dolor in reprehended in voltage veil esse colum doolie eu fujian bulla parian. Exceptive sin ocean cuspidate non president,
                sunk in culpa qui officiate descent molls anim id est labours.
            </Typography>
            {/* <DataGrid
                rows={rows}
                columns={columns}
                pageSize={50}
                // rowsPerPageOptions={[40]}
                checkboxSelection
                disableSelectionOnClick
                getRowId={(row) => row.user_id}
                sx={{ width: '100%', height: 500 }}
                // onPageChange={(page) => alert(page)}
            /> */}
        </MainCard>
    );
};

export default SamplePage;
