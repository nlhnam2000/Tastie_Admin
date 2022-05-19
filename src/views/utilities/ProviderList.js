import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';

// material-ui
import { Box, Card, Grid, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import { providerColumns } from 'assets/columns/gridData';
import { HOST_NAME } from 'config';

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
    const [showRemovedButton, setShowRemovedButton] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState([]);
    const [loading, setLoading] = useState(true);

    const GetAllProvider = async (offset, limit) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const res = await axios.post(
                `http://${HOST_NAME}:3010/v1/api/tastie/admin/get-all-provider`,
                {
                    limit,
                    offset
                },
                config
            );

            if (res.data.status) {
                setRows(res.data.response.filter((item) => item.status !== 3));
            }
        } catch (error) {
            console.error('Cannot get all providers', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveProvider = async (providerList) => {
        // this function get the array of provider_id to be removed => remove multiple providers
        try {
            const removeUser = async (providerId) => {
                const res = await axios.put(`http://${HOST_NAME}:3010/v1/api/tastie/admin/remove-provider/${providerId}`);

                return res.data;
            };
            const queryList = [];
            providerList.forEach((providerId) => {
                queryList.push(removeUser(providerId)); // get the query list of removing providers
            });
            Promise.all(queryList).then((values) => {
                console.log('Response from removing providers', values);
                GetAllProvider(1, 10000000); // reload the screen with new data
            });
        } catch (error) {
            console.error('Cannot remove providers', error);
        }
    };

    useEffect(() => {
        GetAllProvider(1, 100000000);
    }, []);

    useEffect(() => {
        setShowRemovedButton(selectedProvider.length > 0);
    }, [selectedProvider]);

    const login = async () => {
        try {
            const res = await axios.post(
                `http://157.230.243.92:3010/v1/api/tastie/admin/sign-in`,
                {
                    email: 'admin1@gmail.com',
                    password: 'admin123'
                },
                {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log(res.data);
        } catch (error) {
            console.error('Cannot sign in', error);
        }
    };

    return (
        <MainCard
            title="Provider List"
            secondary={
                <>
                    {showRemovedButton && (
                        <Button variant="contained" color="error" onClick={() => handleRemoveProvider(selectedProvider)}>
                            Remove provider
                        </Button>
                    )}
                    <Button onClick={() => login()} variant="contained">
                        Login
                    </Button>
                </>
            }
        >
            <DataGrid
                rows={rows}
                columns={providerColumns}
                loading={loading}
                pageSize={50}
                // rowsPerPageOptions={[40]}
                checkboxSelection
                disableSelectionOnClick
                getRowId={(row) => row.provider_id}
                sx={{ width: '100%', height: '70vh' }}
                onSelectionModelChange={(providerList) => {
                    setSelectedProvider(providerList);
                }}
            />
        </MainCard>
    );
};

export default ProviderList;
