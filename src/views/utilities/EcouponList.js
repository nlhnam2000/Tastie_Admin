import React, { useEffect, useState } from 'react';

import { styled } from '@mui/material/styles';
import { Card, Dialog, DialogActions, DialogContentText, DialogTitle, DialogContent, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { ecouponColumns } from 'assets/columns/gridData';
import { HOST_NAME } from 'config';
import { CONNECT_SOCKET, DISCONNECT_SOCKET } from 'store/actions';

// assets
import LinkIcon from '@mui/icons-material/Link';

// libraries
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

// styles
const IFrameWrapper = styled('iframe')(({ theme }) => ({
    height: 'calc(100vh - 210px)',
    border: '1px solid',
    borderColor: theme.palette.primary.light
}));

// =============================|| TABLER ICONS ||============================= //

const EcouponList = () => {
    const [rows, setRows] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [formData, setFormData] = useState({});

    const formatDate = (date) => {
        const d = new Date(date);
        let month = (d.getMonth() + 1).toString();
        let day = d.getDate().toString();
        const year = d.getFullYear();

        if (month.length < 2) month = `0${month}`;
        if (day.length < 2) day = `0${day}`;

        return [year, month, day].join('-'); // 2022-05-04
    };

    // const socket = io(`http://${HOST_NAME}:3015`);

    const GetAllEcoupon = async (offset, limit) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const res = await axios.post(
                `http://${HOST_NAME}:3010/v1/api/tastie/admin/get-all-ecoupon`,
                {
                    limit,
                    offset
                },
                config
            );

            if (res.data.status) {
                const clone = [...res.data.response];
                setRows(
                    clone.map((item) => ({
                        ...item,
                        // update_at: new Date(item.update_at).toLocaleString('vi-VI'),
                        // start_date: new Date(item.start_date).toLocaleString('vi-VI'),
                        // expire_date: new Date(item.expire_date).toLocaleString('vi-VI')
                        update_at: formatDate(item.update_at),
                        start_date: formatDate(item.start_date),
                        expire_date: formatDate(item.expire_date)
                    }))
                );
            }
        } catch (error) {
            console.error('Cannot get all ecoupons', error);
        }
    };

    const handleUpdateRow = async (formData) => {
        try {
            const res = await axios.post(`http://${HOST_NAME}:3010/v1/api/tastie/admin/update-ecoupon`, formData);
            if (res.data.status) {
                await GetAllEcoupon(1, 50);
            }
        } catch (error) {
            console.error('Cannot update ecoupon', error);
        } finally {
            setOpenModal(false);
        }
    };

    useEffect(() => {
        // socket.emit('admin', 'hello from admin');
        GetAllEcoupon(1, 50);
    }, []);

    useEffect(() => {
        console.log(formData);
    }, [formData]);

    return (
        <MainCard
            title="Ecoupon List"
            // secondary={
            //     <Button variant="contained" onClick={() => addCoupon()}>
            //         SOCKET
            //     </Button>
            // }
        >
            {/* <Card sx={{ overflow: 'hidden' }}>
            <IFrameWrapper title="Tabler Icons" width="100%" src="https://tablericons.com/" />
        </Card> */}
            <DataGrid
                rows={rows}
                columns={ecouponColumns}
                pageSize={50}
                checkboxSelection
                disableSelectionOnClick
                getRowId={(row) => row.ecoupon_id}
                sx={{ width: '100%', height: '70vh' }}
                // onPageChange={(page) => alert(page)}
                onCellEditCommit={(event) => {
                    const rowEdited = rows.find((row) => row.ecoupon_id === event.id);
                    setFormData((prev) => ({
                        ...prev,
                        ...rowEdited,
                        start_date: formatDate(rowEdited.start_date),
                        expire_date: formatDate(rowEdited.expire_date),
                        update_at: formatDate(rowEdited.update_at),
                        [event.field]: event.value
                    }));
                    setOpenModal(true);
                    // const formData = {
                    //     ...rowEdited,
                    //     [event.field]: event.value
                    // };
                    // console.log(formData);
                    // handleUpdateRow(formData);
                }}
            />
            <div>
                <Dialog
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Are you sure to apply the changes ?</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            This action will change the original record. Would you like to apply change ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenModal(false)}>Cancel</Button>
                        <Button onClick={() => handleUpdateRow(formData)} autoFocus>
                            Apply
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </MainCard>
    );
};

export default EcouponList;
