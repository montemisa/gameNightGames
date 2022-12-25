import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Chameleon from './components/Chameleon';
import CreateChameleonGame from './components/Chameleon/CreateChameleonGame';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import  store  from './store';
import SocketHandler from './components/SocketHandler'
import ChameleonGamePlay from './components/Chameleon/ChameleonGamePlay';

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements
} from "react-router-dom";
import ChameleonLobby from './components/Chameleon/ChameleonLobby';
import Home from './components/Home';
import Scorekeeper from './components/Scorekeeper';


const router =  createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Home />}>
      <Route index element={<App />} />
      <Route path='/chameleon' element={<Chameleon />}  />
      <Route path="/chameleon/:gameId"  element={<ChameleonLobby />} />
      <Route path="/chameleon/:gameId/play" element={<ChameleonGamePlay/>}  />
      <Route path="/scorekeeper" element={<Scorekeeper />} />
      </Route>))

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     children: [

    
  
//   {
//     path: "/chameleon",
//     element: <Chameleon />,
//   },
//   {
//     path: "chameleon/create",
//     element: <CreateChameleonGame />,
//   },
//   {
//     path: "chameleon/:gameId",
//     element: <ChameleonLobby />
//   },
//   {
//     path: "chameleon/play",
//     element: <ChameleonGamePlay />
//   }]},
// ]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <SocketHandler />
      <RouterProvider router={router} />
    </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
