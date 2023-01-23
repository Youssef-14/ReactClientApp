import React from 'react';

import { Login } from "./components/Login";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import {Register} from "./components/Register";
import {VerifDemande} from "./components/VerifDemande";
import {Settings} from "./components/Settings";
import {MyDemands} from "./components/MyDemands";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/mydemands',
    element: <MyDemands />
  },
  {
    path: '/fetch-data',
    element: <FetchData />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/verif-demande',
    element: <VerifDemande />
  },
  {
    path: '/settings',
    element: <Settings />
  }
];

export default AppRoutes;
