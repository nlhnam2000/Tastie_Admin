import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Menu, MenuItem, Typography, Button } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';
import { SHOW_CURRENT_CHART } from 'store/actions';
import { HOST_NAME } from '../../../config';

// assets
import EarningIcon from 'assets/images/icons/earning.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import GetAppTwoToneIcon from '@mui/icons-material/GetAppOutlined';
import FileCopyTwoToneIcon from '@mui/icons-material/FileCopyOutlined';
import PictureAsPdfTwoToneIcon from '@mui/icons-material/PictureAsPdfOutlined';
import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveOutlined';

// libraries
import axios from 'axios';
import { useDispatch } from 'react-redux';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.dark,
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: theme.palette.secondary[800],
        borderRadius: '50%',
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
        width: 210,
        height: 210,
        background: theme.palette.secondary[800],
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

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

const EarningCard = ({ isLoading }) => {
    const theme = useTheme();
    const dispatch = useDispatch();

    const [anchorEl, setAnchorEl] = useState(null);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [timeValue, setTimeValue] = useState('Month');
    const [isHigher, setIsHigher] = useState(true);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChangeTime = (event, newTimeValue) => {
        event.stopPropagation();
        setTimeValue(newTimeValue);
    };

    const GetTotalRevenue = async (startMonth, endMonth, year) => {
        // try {
        //     const res = await axios.post('http://HOST_NAME:3010/v1/api/tastie/admin/get-total-revenue-by-time', {
        //         start_month: startMonth,
        //         end_month: endMonth,
        //         year
        //     });
        //     if (res.data.status && res.data.response.length > 0) {
        //         setTotalRevenue(res.data.response[0].total_revenue);
        //     }
        // } catch (error) {
        //     console.error(error);
        // }
        const res = await axios.post(`http://${HOST_NAME}:3010/v1/api/tastie/admin/get-total-revenue-by-time`, {
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
            // GetTotalRevenue(currentMonth, currentMonth, currentYear);
            const getPreviousMonth = GetTotalRevenue(4, 4, currentYear);
            const getCurrentMonth = GetTotalRevenue(5, 5, currentYear);
            Promise.all([getPreviousMonth, getCurrentMonth]).then((values) => {
                setTotalRevenue(values[1].total_revenue);
                setIsHigher(values[0] < values[1]);
            });
        } else {
            const getPreviousMonth = GetTotalRevenue(1, 12, currentYear - 1);
            const getCurrentMonth = GetTotalRevenue(1, 12, currentYear);
            Promise.all([getPreviousMonth, getCurrentMonth]).then((values) => {
                console.log(values);
                setTotalRevenue(values[1].total_revenue);
                setIsHigher(values[0] < values[1]);
            });
        }
    }, [timeValue]);

    return (
        <>
            {isLoading ? (
                <SkeletonEarningCard />
            ) : (
                <CardWrapper border={false} content={false} onClick={() => dispatch({ type: SHOW_CURRENT_CHART, currentChart: 1 })}>
                    <Box sx={{ p: 2.25 }}>
                        <Grid container direction="column">
                            <Grid item>
                                <Grid container justifyContent="space-between">
                                    <Grid item>
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                ...theme.typography.largeAvatar,
                                                backgroundColor: theme.palette.secondary[800],
                                                mt: 1
                                            }}
                                        >
                                            <img src={EarningIcon} alt="Notification" />
                                        </Avatar>
                                    </Grid>
                                    {/* <Grid item>
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                ...theme.typography.mediumAvatar,
                                                backgroundColor: theme.palette.secondary.dark,
                                                color: theme.palette.secondary[200],
                                                zIndex: 1
                                            }}
                                            aria-controls="menu-earning-card"
                                            aria-haspopup="true"
                                            onClick={handleClick}
                                        >
                                            <MoreHorizIcon fontSize="inherit" />
                                        </Avatar>
                                        <Menu
                                            id="menu-earning-card"
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
                                            <MenuItem onClick={handleClose}>
                                                <Typography>This Month</Typography>
                                            </MenuItem>
                                            <MenuItem>
                                                <Typography>This year</Typography>
                                            </MenuItem>
                                        </Menu>
                                    </Grid> */}
                                    <Grid item>
                                        <Button
                                            disableElevation
                                            variant={timeValue === 'Month' ? 'contained' : 'text'}
                                            size="small"
                                            sx={{ color: 'inherit', zIndex: 1 }}
                                            onClick={(e) => handleChangeTime(e, 'Month')}
                                        >
                                            Month
                                        </Button>
                                        <Button
                                            disableElevation
                                            variant={timeValue === 'Year' ? 'contained' : 'text'}
                                            size="small"
                                            sx={{ color: 'inherit', zIndex: 1 }}
                                            onClick={(e) => handleChangeTime(e, 'Year')}
                                        >
                                            Year
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container alignItems="center">
                                    <Grid item>
                                        <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>
                                            ${totalRevenue ? totalRevenue.toFixed(2) : 0.0}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Avatar
                                            sx={{
                                                cursor: 'pointer',
                                                ...theme.typography.smallAvatar,
                                                backgroundColor: theme.palette.secondary[200],
                                                color: theme.palette.secondary.dark
                                            }}
                                        >
                                            {isHigher ? (
                                                <ArrowUpwardIcon fontSize="inherit" sx={{ transform: 'rotate3d(1, 1, 1, 45deg)' }} />
                                            ) : (
                                                <ArrowDownwardIcon fontSize="inherit" sx={{ transform: 'rotate3d(1, 1, 1, 45deg)' }} />
                                            )}
                                        </Avatar>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item sx={{ mb: 1.25 }}>
                                <Typography
                                    sx={{
                                        fontSize: '1rem',
                                        fontWeight: 500,
                                        color: theme.palette.secondary[200]
                                    }}
                                >
                                    Total Revenue
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

EarningCard.propTypes = {
    isLoading: PropTypes.bool
};

export default EarningCard;
