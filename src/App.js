import React from 'react';
import "./App.css";
import Form from "./components/form";
import Latlong from "./components/latlong";
// import {MessageNotification} from './components/messageNotification';
// import Page from "./components/page";

function App() {
  return (
    <>
    {/* <MessageNotification /> */}
      <Form />
      <Latlong />
      {/* <Page /> */}
    </>
  );
}

export default App;
