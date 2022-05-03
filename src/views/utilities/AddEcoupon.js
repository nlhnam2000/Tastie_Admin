import React, { useEffect, useState } from 'react';

import { styled } from '@mui/material/styles';
import { Card, FormControl, FormGroup, InputLabel, FormHelperText, Input, Button } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';

// library
import axios from 'axios';

// styles
const IFrameWrapper = styled('iframe')(({ theme }) => ({
    height: 'calc(100vh - 210px)',
    border: '1px solid',
    borderColor: theme.palette.primary.light
}));

// ============================|| MATERIAL ICONS ||============================ //

const AddEcoupon = () => {
    const [formData, setFormData] = useState({
        ecoupon_code: null,
        ecoupon_name: null,
        ecoupon_value: null,
        ecoupon_description: null,
        min_order_value: null,
        max_discount_value: null,
        start_date: null,
        expire_date: null,
        payment_method_id: null,
        limited_offer: null,
        weekly_usage_limit_per_user: null,
        delivery_mode: null
    });

    // useEffect(() => {
    //     console.log(formData);
    // }, [formData]);

    const handleAddEcoupon = async (formData) => {
        try {
            const res = await axios.post('http://localhost:3010/v1/api/tastie/admin/add-ecoupon', formData);

            if (res.data.status) {
                alert('Success');
            }
        } catch (error) {
            console.error('Cannot add an ecoupon', error);
        }
    };

    return (
        <MainCard title="Add an Ecoupon" secondary={<SecondaryAction link="https://next.material-ui.com/components/material-icons/" />}>
            <FormControl sx={{ width: '100%' }}>
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
                        <InputLabel htmlFor="ecoupon_code">Ecoupon Code</InputLabel>
                        <Input
                            id="ecoupon_code"
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
                        <InputLabel htmlFor="ecoupon_name">Ecoupon Name</InputLabel>
                        <Input
                            id="ecoupon_name"
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
                        <InputLabel htmlFor="ecoupon_value">Ecoupon value</InputLabel>
                        <Input
                            id="ecoupon_value"
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
                        <InputLabel htmlFor="ecoupon_description">Ecoupon description</InputLabel>
                        <Input
                            id="ecoupon_description"
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
                        <InputLabel htmlFor="min_order_value">Min order value</InputLabel>
                        <Input
                            id="min_order_value"
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
                        <InputLabel htmlFor="max_discount_value">Max discount value</InputLabel>
                        <Input
                            id="max_discount_value"
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
                        <InputLabel htmlFor="start_date">Start date</InputLabel>
                        <Input
                            id="start_date"
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
                        <InputLabel htmlFor="expire_date">Expire date</InputLabel>
                        <Input
                            id="expire_date"
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
                        <InputLabel htmlFor="payment_method_id">Payment method ID</InputLabel>
                        <Input
                            id="payment_method_id"
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
                        <InputLabel htmlFor="limited_offer">Limited offer</InputLabel>
                        <Input
                            id="limited_offer"
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
                        <InputLabel htmlFor="weekly_usage_limit_per_user">weekly usage limit per user</InputLabel>
                        <Input
                            id="weekly_usage_limit_per_user"
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
                        <InputLabel htmlFor="delivery_mode">Delivery mode</InputLabel>
                        <Input
                            id="delivery_mode"
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
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ margin: 'auto', marginTop: 10 }}
                    onClick={() => handleAddEcoupon(formData)}
                >
                    Add Ecoupon
                </Button>
            </FormControl>
        </MainCard>
    );
};

export default AddEcoupon;
