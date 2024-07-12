import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "../components/Home/Home";
import Login from "../components/Login/Login";
import { AuthRequired } from "../middleware/AuthRequired";
import Customers from "../components/Customers/Customers";
import PDFRootComponent from "../components/PdfComponent/PDFRootComponent";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Navigate to="/customers" />} />
        <Route exact path="/login" element={<Login />} />
        <Route
          path="/home"
          element={
            <AuthRequired>
              <Home />
            </AuthRequired>
          }
        />
        <Route
          path="/home/:customerId"
          element={
            <AuthRequired>
              <Home />
            </AuthRequired>
          }
        />
        <Route
          path="/home/:customerId/pdf"
          element={
            <AuthRequired>
              <PDFRootComponent />
            </AuthRequired>
          }
        />
        <Route
          path="/customers"
          element={
            <AuthRequired>
              <Customers />
            </AuthRequired>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
