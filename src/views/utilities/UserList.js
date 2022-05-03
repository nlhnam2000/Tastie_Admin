// import React
import React, { useEffect, useState } from 'react';

import { Grid, Link } from '@mui/material';
import MuiTypography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import { userColumns } from 'assets/columns/gridData';

// import library
import axios from 'axios';

// ==============================|| TYPOGRAPHY ||============================== //

const UserList = () => {
    const [rows, setRows] = useState([]);

    useEffect(() => {
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

        GetAllUser(1, 39130);
    }, []);

    return (
        <MainCard title="User list" secondary={<SecondaryAction link="https://next.material-ui.com/system/typography/" />}>
            <DataGrid
                rows={rows}
                columns={userColumns}
                // pageSize={50}
                // rowsPerPageOptions={[40]}
                checkboxSelection
                disableSelectionOnClick
                getRowId={(row) => row.user_id}
                sx={{ width: '100%', height: 500 }}
                // onPageChange={(page) => alert(page)}
            />
        </MainCard>
    );
};

export default UserList;
