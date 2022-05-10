import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, Button, Grid, Typography } from '@mui/material';

// third-party
import Chart from 'react-apexcharts';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonTotalOrderCard from 'ui-component/cards/Skeleton/EarningCard';

import ChartDataMonth from './chart-data/total-order-month-line-chart';
import ChartDataYear from './chart-data/total-order-year-line-chart';

// assets
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

// libraries
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { SHOW_CURRENT_CHART } from 'store/actions';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.primary.dark,
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    '&>div': {
        position: 'relative',
        zIndex: 5
    },
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: theme.palette.primary[800],
        borderRadius: '50%',
        zIndex: 1,
        top: -85,
        right: -95,
        [theme.breakpoints.down('sm')]: {
            top: -105,
            right: -140
        }
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        zIndex: 1,
        width: 210,
        height: 210,
        background: theme.palette.primary[800],
        borderRadius: '50%',
        top: -125,
        right: -15,
        opacity: 0.5,
        [theme.breakpoints.down('sm')]: {
            top: -155,
            right: -70
        }
    },
    cursor: 'pointer'
}));

// ==============================|| DASHBOARD - TOTAL ORDER LINE CHART CARD ||============================== //

const TotalOrderLineChartCard = ({ isLoading }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const customization = useSelector((state) => state.customization);

    const [timeValue, setTimeValue] = useState('Month');
    const [totalSale, setTotalSale] = useState(0);
    const handleChangeTime = (event, newValue) => {
        event.stopPropagation();
        setTimeValue(newValue);
    };
    const [isHigher, setIsHigher] = useState(true);

    const GetTotalSale = async (startMonth, endMonth, year) => {
        // try {
        //     const res = await axios.post('http://localhost:3010/v1/api/tastie/admin/get-number-order-by-time', {
        //         start_month: startMonth,
        //         end_month: endMonth,
        //         year
        //     });

        //     if (res.data.status && res.data.response.length > 0) {
        //         setTotalSale(res.data.response[0].total_num_orders);
        //     }
        // } catch (error) {
        //     console.error(error);
        // }
        const res = await axios.post('http://localhost:3010/v1/api/tastie/admin/get-number-order-by-time', {
            start_month: startMonth,
            end_month: endMonth,
            year
        });
        return res.data.response[0];
    };

    useEffect(() => {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        if (timeValue === 'Month') {
            const getPreviousMonth = GetTotalSale(currentMonth - 1, currentMonth - 1, currentYear);
            const getCurrentMonth = GetTotalSale(currentMonth, currentMonth, currentYear);
            Promise.all([getPreviousMonth, getCurrentMonth]).then((values) => {
                setTotalSale(values[1].total_num_orders);
                setIsHigher(values[0] < values[1]);
            });
        } else {
            const getPreviousYear = GetTotalSale(1, 12, currentYear - 1);
            const getCurrentYear = GetTotalSale(1, 12, currentYear);
            Promise.all([getPreviousYear, getCurrentYear]).then((values) => {
                setTotalSale(values[1].total_num_orders);
                setIsHigher(values[0] < values[1]);
            });
        }
    }, [timeValue]);

    return (
        <>
            {isLoading ? (
                <SkeletonTotalOrderCard />
            ) : (
                <CardWrapper
                    border={false}
                    content={false}
                    onClick={() => {
                        dispatch({ type: SHOW_CURRENT_CHART, currentChart: 2 });
                    }}
                >
                    <Box sx={{ p: 1.25, px: 2 }}>
                        <Grid container direction="column">
                            <Grid item>
                                <Grid container justifyContent="space-between">
                                    <Grid item>
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                ...theme.typography.largeAvatar,
                                                backgroundColor: theme.palette.primary[800],
                                                color: '#fff',
                                                mt: 1
                                            }}
                                        >
                                            <LocalMallOutlinedIcon fontSize="inherit" />
                                        </Avatar>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            disableElevation
                                            variant={timeValue === 'Month' ? 'contained' : 'text'}
                                            size="small"
                                            sx={{ color: 'inherit' }}
                                            onClick={(e) => handleChangeTime(e, 'Month')}
                                        >
                                            Month
                                        </Button>
                                        <Button
                                            disableElevation
                                            variant={timeValue === 'Year' ? 'contained' : 'text'}
                                            size="small"
                                            sx={{ color: 'inherit' }}
                                            onClick={(e) => handleChangeTime(e, 'Year')}
                                        >
                                            Year
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item sx={{ mb: 0.75 }}>
                                <Grid container alignItems="center">
                                    <Grid item xs={6}>
                                        <Grid container alignItems="center">
                                            <Grid item>
                                                <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>
                                                    ${totalSale.toFixed(2)}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Avatar
                                                    sx={{
                                                        ...theme.typography.smallAvatar,
                                                        cursor: 'pointer',
                                                        backgroundColor: theme.palette.primary[200],
                                                        color: theme.palette.primary.dark
                                                    }}
                                                >
                                                    {isHigher ? (
                                                        <ArrowUpwardIcon
                                                            fontSize="inherit"
                                                            sx={{ transform: 'rotate3d(1, 1, 1, 45deg)' }}
                                                        />
                                                    ) : (
                                                        <ArrowDownwardIcon
                                                            fontSize="inherit"
                                                            sx={{ transform: 'rotate3d(1, 1, 1, 45deg)' }}
                                                        />
                                                    )}
                                                </Avatar>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography
                                                    sx={{
                                                        fontSize: '1rem',
                                                        fontWeight: 500,
                                                        color: theme.palette.primary[200]
                                                    }}
                                                >
                                                    Total Sales
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={6}>
                                        {/* {timeValue ? <Chart {...ChartDataMonth} /> : <Chart {...ChartDataYear} />} */}
                                        {/* <Button
                                            size="large"
                                            variant="contained"
                                            disableElevation
                                            onClick={() => {
                                                dispatch({ type: SHOW_CURRENT_CHART, currentChart: 2 });
                                            }}
                                            sx={{ float: 'right', marginTop: 5 }}
                                        >
                                            View in chart
                                        </Button> */}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

TotalOrderLineChartCard.propTypes = {
    isLoading: PropTypes.bool
};

export default TotalOrderLineChartCard;
