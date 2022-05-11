import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, MenuItem, TextField, Typography } from '@mui/material';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// chart data
import chartData from './chart-data/total-growth-bar-chart';

// libraries
import axios from 'axios';

const status = [
    {
        value: 'today',
        label: 'Today'
    },
    {
        value: 'month',
        label: 'This Month'
    },
    {
        value: 'year',
        label: 'This Year'
    }
];

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const TotalGrowthBarChart = ({ isLoading, type }) => {
    const [value, setValue] = useState('today');
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);
    const [data, setData] = useState([]);

    const { navType } = customization;
    const { primary } = theme.palette.text;
    const darkLight = theme.palette.dark.light;
    const grey200 = theme.palette.grey[200];
    const grey500 = theme.palette.grey[500];

    const primary200 = theme.palette.primary[200];
    const primaryDark = theme.palette.primary.dark;
    const secondaryMain = theme.palette.secondary.main;
    const secondaryLight = theme.palette.secondary.light;

    const toMonths = (data) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        return data.map((item) => months[item - 1]);
    };

    const getSum = (data, type) => {
        let sum = 0.0;
        data.forEach((d) => {
            if (type === 1) {
                sum += d.totalRevenue;
            } else if (type === 2) {
                sum += d.numberOrder;
            } else if (type === 3) {
                sum += d.totalRevenue / d.numberOrder;
            }
        });

        return parseFloat(sum).toFixed(2);
    };

    const LoadData = async () => {
        try {
            const res = await axios.get('http://localhost:3010/v1/api/tastie/admin/statics-of-total-revenue-in-the-last-12-month');
            if (res.data.status && res.data.response.length > 0) {
                setData(res.data.response.reverse());
            }
        } catch (error) {
            console.error('Cannot get data of last 12 months');
        } finally {
            console.log(customization);
        }
    };

    useEffect(() => {
        LoadData();
    }, []);

    useEffect(() => {
        const newChartData = {
            ...chartData.options,
            colors: [primary200, primaryDark, secondaryMain, secondaryLight],
            xaxis: {
                labels: {
                    style: {
                        colors: [primary, primary, primary, primary, primary, primary, primary, primary, primary, primary, primary, primary]
                    }
                },
                categories: toMonths([...data].map((item) => item.month))
            },
            yaxis: {
                labels: {
                    style: {
                        colors: [primary]
                    }
                }
            },
            grid: {
                borderColor: grey200
            },
            tooltip: {
                theme: 'light'
            },
            legend: {
                labels: {
                    colors: grey500
                }
            }
            // series: [
            //     {
            //         name: type === 1 ? 'Total revenue' : type === 2 ? 'Total sale' : 'Total sale',
            //         data: [...data].map((item) => {
            //             if (type === 1) {
            //                 return parseFloat(item.totalRevenue).toFixed(2);
            //             } else if (type === 2) {
            //                 return item.numberOrder;
            //             } else if (type === 3) {
            //                 return item.totalRevenue / item.numberOrder;
            //             }
            //         })
            //     }
            // ]
        };

        if (type === 1) {
            newChartData.series = [
                {
                    name: 'Total revenue',
                    data: [...data].map((item) => parseFloat(item.totalRevenue).toFixed(2))
                }
            ];
        } else if (type === 2) {
            newChartData.series = [
                {
                    name: 'Total sale',
                    data: [...data].map((item) => item.numberOrder)
                }
            ];
        } else if (type === 3) {
            newChartData.series = [
                {
                    name: 'Total sale',
                    data: [...data].map((item) => parseFloat(item.totalRevenue / item.numberOrder).toFixed(2))
                }
            ];
        }

        // do not load chart when loading
        if (!isLoading) {
            ApexCharts.exec(`bar-chart`, 'updateOptions', newChartData);
        }
    }, [navType, primary200, primaryDark, secondaryMain, secondaryLight, primary, darkLight, grey200, isLoading, grey500, data, type]);

    return (
        <>
            {isLoading ? (
                <SkeletonTotalGrowthBarChart />
            ) : (
                <MainCard>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                    <Grid container direction="column" spacing={1}>
                                        <Grid item>
                                            {(() => {
                                                switch (type) {
                                                    case 1:
                                                        return <Typography variant="subtitle1">Total revenue</Typography>;
                                                    /* falls through */

                                                    case 2:
                                                        return <Typography variant="subtitle1">Total Sale</Typography>;
                                                    /* falls through */

                                                    case 3:
                                                        return <Typography variant="subtitle1">Sale per order</Typography>;
                                                    /* falls through */

                                                    default:
                                                        return <Typography variant="subtitle1">Total revenue</Typography>;
                                                    /* falls through */
                                                }
                                            })()}
                                        </Grid>
                                        <Grid item>
                                            {(() => {
                                                switch (type) {
                                                    case 1:
                                                        <Typography variant="h3">${getSum(data, 1)}</Typography>;
                                                    /* falls through */
                                                    case 2:
                                                        return <Typography variant="h3">{getSum(data, 2)} orders</Typography>;
                                                    /* falls through */

                                                    case 3:
                                                        return <Typography variant="h3">{getSum(data, 3)} sales per order</Typography>;
                                                    /* falls through */

                                                    default:
                                                        return <Typography variant="h3">${getSum(data, 1)}</Typography>;
                                                    /* falls through */
                                                }
                                            })()}
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <TextField
                                        id="standard-select-currency"
                                        select
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                    >
                                        {status.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Chart {...chartData} />
                        </Grid>
                    </Grid>
                </MainCard>
            )}
        </>
    );
};

TotalGrowthBarChart.propTypes = {
    isLoading: PropTypes.bool
};

export default TotalGrowthBarChart;
