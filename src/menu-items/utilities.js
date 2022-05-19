// assets
import { IconUsers, IconToolsKitchen, IconReceipt, IconTicket } from '@tabler/icons';

// constant
const icons = {
    IconUsers,
    IconToolsKitchen,
    IconReceipt,
    IconTicket
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
    id: 'utilities',
    title: 'Utilities',
    type: 'group',
    children: [
        {
            id: 'util-typography',
            title: 'Users',
            type: 'item',
            url: '/utils/util-typography',
            icon: icons.IconUsers,
            breadcrumbs: false
        },

        {
            id: 'util-shadow',
            title: 'Provider',
            type: 'item',
            url: '/utils/util-shadow',
            icon: icons.IconToolsKitchen,
            breadcrumbs: false
        },
        // {
        //     id: 'util-color',
        //     title: 'Order',
        //     type: 'item',
        //     url: '/utils/util-color',
        //     icon: icons.IconReceipt,
        //     breadcrumbs: false
        // },
        {
            id: 'icons',
            title: 'Ecoupon',
            type: 'collapse',
            icon: icons.IconTicket,
            children: [
                {
                    id: 'tabler-icons',
                    title: 'Ecoupon List',
                    type: 'item',
                    url: '/ecoupons/ecoupon-list',
                    breadcrumbs: false
                },
                {
                    id: 'material-icons',
                    title: 'Add an Ecoupon',
                    type: 'item',
                    url: '/ecoupons/add-ecoupon',
                    breadcrumbs: false
                }
            ]
        }
    ]
};

export default utilities;
