import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Button, CardActions, CardContent, Divider, Grid, Menu, MenuItem, Typography } from '@mui/material';

// project imports
import BajajAreaChartCard from './BajajAreaChartCard';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';
import { HOST_NAME } from 'config';

// assets
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

// library
import axios from 'axios';

// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //

const TopSaleCard = ({ isLoading }) => {
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = useState(null);
    const [ranking, setRanking] = useState([]);
    const [differences, setDifferences] = useState([
        {
            state: 'Profit',
            difference: 0
        }
    ]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const sortByMonth = async () => {
        try {
            const currentMonth = new Date().getMonth() + 1;
            const currentYear = new Date().getFullYear();

            const getCurrentMonthRevenue = async () => {
                const res = await axios.post(`http://${HOST_NAME}:3010/v1/api/tastie/admin/get-top-provider-by-revenue`, {
                    start_month: currentMonth,
                    end_month: currentMonth,
                    year: currentYear,
                    limit: 5
                });

                return res.data.response;
            };
            const getPreviousMonthRevenue = async () => {
                const res = await axios.post(`http://${HOST_NAME}:3010/v1/api/tastie/admin/get-top-provider-by-revenue`, {
                    start_month: currentMonth - 1,
                    end_month: currentMonth - 1,
                    year: currentYear,
                    limit: 5
                });

                return res.data.response;
            };
            const res1 = getCurrentMonthRevenue();
            const res2 = getPreviousMonthRevenue();

            Promise.all([res1, res2]).then((values) => {
                setRanking(values[0]);
                if (values[1].length > 0) {
                    setDifferences(
                        values[0].map((value, index) => ({
                            state: value.revenue > values[1][index].revenue ? 'Profit' : 'Loss',
                            difference: Math.abs(value.revenue - values[1][index].revenue)
                        }))
                    );
                } else {
                    setDifferences(
                        values[0].map((value, index) => ({
                            state: 'Profit',
                            difference: parseFloat(value.revenue.toFixed(2))
                        }))
                    );
                }
            });

            // if (res.data.status) {
            //     setRanking(res.data.response);
            // }
        } catch (error) {
            console.error('Cannot sort by month', error);
        } finally {
            console.log(differences);
        }
    };

    const sortByYear = async () => {
        try {
            const currentYear = new Date().getFullYear();
            const res = await axios.post(`http://${HOST_NAME}:3010/v1/api/tastie/admin/get-top-provider-by-revenue`, {
                start_month: 1,
                end_month: 12,
                year: currentYear,
                limit: 5
            });
            if (res.data.status) {
                setRanking(res.data.response);
            }
        } catch (error) {
            console.error('Cannot sort by month', error);
        } finally {
            setAnchorEl(null);
        }
    };

    const LoadSaleRanking = async (startMonth, endMonth, year, limit) => {
        try {
            const res = await axios.post(`http://${HOST_NAME}:3010/v1/api/tastie/admin/get-top-provider-by-sales`, {
                start_month: startMonth,
                end_month: endMonth,
                year,
                limit
            });
            if (res.data.status) {
                setRanking(res.data.response);
            }
        } catch (error) {
            console.error('Cannot get top sale', error);
        } finally {
            setAnchorEl(null);
        }
    };

    useEffect(() => {
        LoadSaleRanking(3, 6, 2022, 5);
        // sortByMonth();
        // sortByYear();
        return () => {
            setRanking([]);
        };
    }, []);

    return (
        <>
            {isLoading ? (
                <SkeletonPopularCard />
            ) : (
                <MainCard content={false}>
                    <CardContent>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <Grid container alignContent="center" justifyContent="space-between">
                                    <Grid item>
                                        <Typography variant="h4">Top Sale</Typography>
                                    </Grid>
                                    <Grid item>
                                        <MoreHorizOutlinedIcon
                                            fontSize="small"
                                            sx={{
                                                color: theme.palette.primary[200],
                                                cursor: 'pointer'
                                            }}
                                            aria-controls="menu-popular-card"
                                            aria-haspopup="true"
                                            onClick={handleClick}
                                        />
                                        <Menu
                                            id="menu-popular-card"
                                            anchorEl={anchorEl}
                                            keepMounted
                                            open={Boolean(anchorEl)}
                                            onClose={handleClose}
                                            variant="selectedMenu"
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right'
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right'
                                            }}
                                        >
                                            <MenuItem onClick={handleClose}> Today</MenuItem>
                                            <MenuItem onClick={() => sortByMonth()}> This Month</MenuItem>
                                            <MenuItem onClick={() => sortByYear()}> This Year </MenuItem>
                                        </Menu>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sx={{ pt: '16px !important' }}>
                                <BajajAreaChartCard
                                    merchantName={ranking.length > 0 ? ranking[0].merchant_name : 'Unknown'}
                                    revenu={ranking.length > 0 ? ranking[0].num_sales : 0.0}
                                    revenueList={[{ data: ranking.map((r) => r.num_sales) }]}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                {ranking.map((item, index) => (
                                    <div key={index}>
                                        <Grid container direction="column">
                                            <Grid item>
                                                <Grid container alignItems="center" justifyContent="space-between">
                                                    <Grid item>
                                                        <Typography variant="subtitle1" color="inherit" sx={{ fontSize: 'small' }}>
                                                            {index + 1}. {item.merchant_name ?? 'Unknown'}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item>
                                                        <Grid container alignItems="center" justifyContent="space-between">
                                                            <Grid item>
                                                                <Typography variant="subtitle1" color="inherit">
                                                                    {item.num_sales ?? 0} sales
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item>
                                                                <Avatar
                                                                    variant="rounded"
                                                                    sx={{
                                                                        width: 16,
                                                                        height: 16,
                                                                        borderRadius: '5px',
                                                                        backgroundColor: theme.palette.success.light,
                                                                        color: theme.palette.success.dark,
                                                                        ml: 2
                                                                    }}
                                                                >
                                                                    <KeyboardArrowUpOutlinedIcon fontSize="small" color="inherit" />
                                                                </Avatar>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item>
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{
                                                        color:
                                                            differences[index]?.state === 'Profit'
                                                                ? 'success.dark'
                                                                : theme.palette.orange.dark
                                                    }}
                                                >
                                                    ${differences[index]?.difference} {differences[index]?.state}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Divider sx={{ my: 1.5 }} />
                                    </div>
                                ))}
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
                        <Button size="small" disableElevation>
                            View All
                            <ChevronRightOutlinedIcon />
                        </Button>
                    </CardActions>
                </MainCard>
            )}
        </>
    );
};

TopSaleCard.propTypes = {
    isLoading: PropTypes.bool
};

export default TopSaleCard;
