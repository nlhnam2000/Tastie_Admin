import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';

// material-ui
import { Box, Card, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import { providerColumns } from 'assets/columns/gridData';

import axios from 'axios';

// ===============================|| SHADOW BOX ||=============================== //

const ShadowBox = ({ shadow }) => (
    <Card sx={{ mb: 3, boxShadow: shadow }}>
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                py: 4.5,
                bgcolor: 'primary.light',
                color: 'grey.800'
            }}
        >
            <Box sx={{ color: 'inherit' }}>boxShadow: {shadow}</Box>
        </Box>
    </Card>
);

ShadowBox.propTypes = {
    shadow: PropTypes.string.isRequired
};

// ============================|| UTILITIES SHADOW ||============================ //

const ProviderList = () => {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        const GetAllProvider = async (offset, limit) => {
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                const res = await axios.post(
                    'http://localhost:3010/v1/api/tastie/admin/get-all-provider',
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
                console.error('Cannot get all providers', error);
            }
        };

        GetAllProvider(1, 50);
    }, []);

    return (
        <MainCard title="Provider List" secondary={<SecondaryAction link="https://next.material-ui.com/system/shadows/" />}>
            <DataGrid
                rows={rows}
                columns={providerColumns}
                pageSize={50}
                // rowsPerPageOptions={[40]}
                checkboxSelection
                disableSelectionOnClick
                getRowId={(row) => row.provider_id}
                sx={{ width: '100%', height: 500 }}
                // onPageChange={(page) => alert(page)}
            />
        </MainCard>
    );
};

export default ProviderList;
