import React from 'react'
import {BiTask} from "react-icons/bi";
import {BsFillGrid3X3GapFill} from "react-icons/bs";

import {FaBars} from "react-icons/fa";
import * as RiIcons from "react-icons/ri";


export const SidebarData = [
    {
        title: 'Dashboard',
        path : '/dashboard',
        icon : <FaBars/>,
        cName: 'nav-text'
    },
    {
        title: 'Task board',
        path : '/task-board',
        icon : <BiTask/>,
        cName: 'nav-text'
    },
    // {
    //     title: 'Forms',
    //     path : '/forms',
    //     icon : <CgFileDocument/>,
    //     cName: 'nav-text'
    // },
    {
        title: 'Doc hub',
        path : '/doc-hub',
        icon : <BsFillGrid3X3GapFill/>,
        cName: 'nav-text'
    },
    {
        title: 'Payments',
        path : '/payments',
        icon : <RiIcons.RiSecurePaymentFill/>,
        cName: 'nav-text'
    },
    {
        title: 'Contacts',
        path : '/contacts',
        icon : <RiIcons.RiContactsLine/>,
        cName: 'nav-text'
    },
    {
        title: 'Settings',
        path : '/settings',
        icon : <RiIcons.RiListSettingsLine/>,
        cName: 'nav-text'
    }
    ]