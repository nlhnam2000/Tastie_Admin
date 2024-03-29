import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';

// material-ui
import { Box, Card, Grid, Button, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { AccountCircle, Search, SearchOffOutlined, SearchOffRounded } from '@mui/icons-material';

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
    const [numberProvider, setNumberProvider] = useState(0);
    const [showRemovedButton, setShowRemovedButton] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState([]);
    const [loading, setLoading] = useState(true);
    const [offset, setOffset] = useState(1);

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
                setNumberProvider(res.data.response.total_provider);
                // setRows(res.data.response.list_provider.filter((item) => item.status !== 3));
                setRows(res.data.response.list_provider);
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

    const SearchProvider = async (name) => {
        setLoading(true);
        try {
            const res = await axios.get(`http://${HOST_NAME}:3010/v1/api/tastie/admin/filter-provider-by-keyword/${name}`);
            if (res.data.status) {
                setRows(res.data.response);
            }
        } catch (error) {
            console.error('Cannot filter user', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        GetAllProvider(offset, 50);
    }, [offset]);

    useEffect(() => {
        setShowRemovedButton(selectedProvider.length > 0);
    }, [selectedProvider]);
    return (
        <MainCard
            title="Provider List"
            secondary={
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', mr: 2 }}>
                        <Search sx={{ color: 'action.active', mr: 1 }} />
                        <TextField
                            id="input-with-sx"
                            label="Search"
                            variant="standard"
                            onChange={(event) => SearchProvider(event.target.value)}
                        />
                    </Box>
                    {showRemovedButton && (
                        <Button variant="contained" color="error" onClick={() => handleRemoveProvider(selectedProvider)}>
                            Remove provider
                        </Button>
                    )}
                </Box>
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
                rowCount={numberProvider}
                getRowId={(row) => row.provider_id}
                sx={{ width: '100%', height: '70vh' }}
                onSelectionModelChange={(providerList) => {
                    setSelectedProvider(providerList);
                }}
                onPageChange={(page) => setOffset(page + 1)}
                paginationMode="server"
            />
        </MainCard>
    );
};

export default ProviderList;
