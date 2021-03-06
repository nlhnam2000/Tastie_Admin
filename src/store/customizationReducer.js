// project imports
import { config, HOST_NAME } from 'config';

// action - state management
import * as actionTypes from './actions';
import io from 'socket.io-client';

export const initialState = {
    isOpen: [], // for active default menu
    fontFamily: config.fontFamily,
    borderRadius: config.borderRadius,
    opened: true,
    currentChart: 1, // 1: total revenue, 2: total sale
    account: {
        name: null,
        email: null,
        isAuth: false
    },
    socket: null
};

// ==============================|| CUSTOMIZATION REDUCER ||============================== //

const customizationReducer = (state = initialState, action) => {
    let id;
    switch (action.type) {
        case actionTypes.MENU_OPEN:
            id = action.id;
            return {
                ...state,
                isOpen: [id]
            };
        case actionTypes.SET_MENU:
            return {
                ...state,
                opened: action.opened
            };
        case actionTypes.SET_FONT_FAMILY:
            return {
                ...state,
                fontFamily: action.fontFamily
            };
        case actionTypes.SET_BORDER_RADIUS:
            return {
                ...state,
                borderRadius: action.borderRadius
            };
        case actionTypes.SHOW_CURRENT_CHART: {
            console.log(action.currentChart);
            return {
                ...state,
                currentChart: action.currentChart
            };
        }
        case actionTypes.RETRIEVE_ACCOUNT: {
            return {
                ...state,
                account: {
                    ...state.account,
                    name: action.account.name,
                    email: action.account.email,
                    isAuth: action.account.isAuth
                }
            };
        }
        case actionTypes.SIGN_IN: {
            return {
                ...state,
                account: {
                    ...state.account,
                    name: action.account.name,
                    email: action.account.email,
                    isAuth: action.account.isAuth
                }
            };
        }
        case actionTypes.SIGN_OUT: {
            return {
                ...state,
                account: {
                    ...state.account,
                    name: null,
                    email: null,
                    isAuth: false
                }
            };
        }
        case actionTypes.CONNECT_SOCKET: {
            return {
                ...state,
                socket: io(`http://${HOST_NAME}:3015`)
            };
        }
        case actionTypes.DISCONNECT_SOCKET: {
            return {
                ...state,
                socket: null
            };
        }
        default:
            return state;
    }
};

export default customizationReducer;
