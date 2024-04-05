import React, { Fragment, useEffect, useState } from 'react';
import Menu from './menu';
import axios from 'axios';
import numeral from 'numeral';
import { Link } from 'react-router-dom';
import Footer from './footer';
import AdminMenu from './rightMenu';
import AdminTable from './adminTable';

function AdminDashBoard() {
    return (
        <Fragment>
            <AdminMenu />
            <AdminTable />
        </Fragment>
    )
}

export default AdminDashBoard;