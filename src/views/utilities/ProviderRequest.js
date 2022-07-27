import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';

// material-ui
import { Box, Card, Grid, Button, Typography, CardActions, CardContent, CardMedia, Modal } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import { providerColumns } from 'assets/columns/gridData';
import { HOST_NAME } from 'config';

import axios from 'axios';

// ============================|| UTILITIES SHADOW ||============================ //

const wrapperStyle = {
    display: 'flex',
    flexBasis: '1%',
    alignItems: 'center',
    // justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '30px'
};

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '150vh',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    height: '80vh',
    overflowY: 'scroll'
};

const ProviderRequest = () => {
    const theme = useTheme();
    const [rows, setRows] = useState([]);
    const [showButtons, setShowButtons] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openProviderDetail, setOpenProviderDetail] = useState(false);
    const [providerTarget, setProviderTarget] = useState({});

    const handleCloseModal = () => {
        setOpenProviderDetail(false);
    };

    const GetRequiredList = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const res = await axios.get(`http://${HOST_NAME}:3010/v1/api/tastie/admin/get-list-required-provider`);

            if (res.data.status) {
                setRows(res.data.response.filter((item) => item.status === 0));
            }
        } catch (error) {
            console.error('Cannot get all providers', error);
        } finally {
            setLoading(false);
        }
    };

    const HandleAcceptRequest = async (provider) => {
        console.log('Accepted', provider);
        try {
            const res = await axios.post(` http://${HOST_NAME}:3010/v1/api/tastie/admin/respond-to-requests-from-provider`, {
                provider_id: provider.provider_id,
                status: 1 // accept
            });

            if (res.data.status) {
                console.log('Accept successfully');
                await GetRequiredList(); // refresh the list
            }
        } catch (error) {
            console.error('Cannot accept provider request', error);
        }
    };

    const HandleRefuseRequest = async (provider) => {
        console.log('Refused', provider);
        try {
            const res = await axios.post(` http://${HOST_NAME}:3010/v1/api/tastie/admin/respond-to-requests-from-provider`, {
                provider_id: provider.provider_id,
                status: 2 // refused
            });

            if (res.data.status) {
                console.log('Refuse sucessfully');
                await GetRequiredList(); // refresh the list
            }
        } catch (error) {
            console.error('Cannot refuse provider request', error);
        }
    };

    useEffect(() => {
        GetRequiredList();
    }, []);

    useEffect(() => {
        setShowButtons(selectedProvider.length > 0);
    }, [selectedProvider]);
    return (
        <MainCard
            title="Provider request"
            // secondary={
            //     <>
            //         {showButtons && (
            //             <>
            //                 <Button variant="contained" color="error" onClick={() => HandleRefuseRequest(selectedProvider)}>
            //                     Refuse
            //                 </Button>
            //                 <Button
            //                     variant="contained"
            //                     color="primary"
            //                     sx={{ marginLeft: 2 }}
            //                     onClick={() => HandleAcceptRequest(selectedProvider)}
            //                 >
            //                     Accept
            //                 </Button>
            //             </>
            //         )}
            //     </>
            // }
        >
            {/* <DataGrid
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
            /> */}
            <div style={wrapperStyle}>
                {rows.map((provider, index) => (
                    <Card
                        sx={{
                            width: '30%',
                            minHeight: 450,
                            border: '1px solid rgba(230,230,230)',
                            marginBottom: 2,
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}
                        key={index}
                        onClick={() => {
                            setProviderTarget(provider);
                            setOpenProviderDetail(true);
                        }}
                    >
                        <Box>
                            <CardMedia component="img" height="200" image={provider.avatar} alt="green iguana" />
                            <CardContent>
                                <Typography gutterBottom variant="h3" component="div">
                                    {provider.merchant_name}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ display: '-webkit-box', overflow: 'hidden', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3 }}
                                >
                                    {provider.description}
                                </Typography>
                            </CardContent>
                        </Box>

                        <CardActions sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Button
                                sx={{
                                    width: '100%',
                                    border: `1px solid #5e35b1`,
                                    paddingRight: '22px',
                                    paddingLeft: '22px',
                                    paddingTop: '8px',
                                    paddingBottom: '8px',
                                    color: '#5e35b1'
                                }}
                                color="secondary"
                                variant="outline"
                                size="large"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    HandleRefuseRequest(provider);
                                }}
                            >
                                Refuse
                            </Button>
                            <Button
                                onClick={(event) => {
                                    event.stopPropagation();
                                    HandleAcceptRequest(provider);
                                }}
                                sx={{ width: '100%' }}
                                color="secondary"
                                variant="contained"
                                size="large"
                            >
                                Accept
                            </Button>
                        </CardActions>
                    </Card>
                ))}
                <Modal
                    open={openProviderDetail}
                    onClose={handleCloseModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={modalStyle}>
                        <CardMedia component="img" height="500" image={providerTarget.avatar} alt="green iguana" />
                        <CardContent>
                            <Typography gutterBottom variant="h3" component="div">
                                {providerTarget.merchant_name}
                            </Typography>
                            <Typography
                                variant="h5"
                                color="text.secondary"
                                gutterBottom
                                // sx={{ display: '-webkit-box', overflow: 'hidden', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3 }}
                            >
                                {providerTarget.description}
                            </Typography>
                            <Typography
                                gutterBototm
                                variant="body2"
                            >{`Address: ${providerTarget.address} ${providerTarget.road}`}</Typography>
                            <Typography gutterBototm variant="body2">{`Hotline: ${providerTarget.hotline}`}</Typography>
                            <Typography gutterBototm variant="body2">{`Tax Code: ${providerTarget.tax_code}`}</Typography>
                            <Typography gutterBototm variant="body2">{`Keyword: ${providerTarget.keyword}`}</Typography>
                        </CardContent>
                        <CardActions sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Button
                                sx={{
                                    width: '100%',
                                    border: `1px solid #5e35b1`,
                                    paddingRight: '22px',
                                    paddingLeft: '22px',
                                    paddingTop: '8px',
                                    paddingBottom: '8px',
                                    color: '#5e35b1'
                                }}
                                color="secondary"
                                variant="outline"
                                size="large"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    HandleRefuseRequest(providerTarget);
                                }}
                            >
                                Refuse
                            </Button>
                            <Button
                                sx={{ width: '100%' }}
                                color="secondary"
                                variant="contained"
                                size="large"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    HandleAcceptRequest(providerTarget);
                                }}
                            >
                                Accept
                            </Button>
                        </CardActions>
                    </Box>
                </Modal>
            </div>
        </MainCard>
    );
};

export default ProviderRequest;
