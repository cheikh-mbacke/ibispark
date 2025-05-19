import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./store";
import Layout from "./components/layout/Layout";
import AppRoutes from "./routes";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Layout>
          <AppRoutes />
        </Layout>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
