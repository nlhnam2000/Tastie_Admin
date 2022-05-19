import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import { RETRIEVE_ACCOUNT } from 'store/actions';

// ==============================|| APP ||============================== //

const App = () => {
    const customization = useSelector((state) => state.customization);
    const navigate = useNavigate();
    const dispacth = useDispatch();

    const retrieveAccount = () => {
        const auth = localStorage.getItem('@authentication');

        if (auth) {
            const data = JSON.parse(auth);
            dispacth({ type: RETRIEVE_ACCOUNT, account: { name: 'Admin', email: data.email, isAuth: true } });
        } else {
            dispacth({ type: RETRIEVE_ACCOUNT, account: { name: null, email: null, isAuth: false } });
            navigate('/free/pages/login/login3');
        }
    };

    useEffect(() => {
        // retrieveAccount();
        // if (!customization.account.isAuth) {
        //     navigate('/free/pages/login/login3');
        // }
        retrieveAccount();
    }, []);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themes(customization)}>
                <CssBaseline />
                <NavigationScroll>
                    <Routes />
                </NavigationScroll>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;
