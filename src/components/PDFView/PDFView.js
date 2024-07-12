import { Page, StyleSheet, Text, View, Image } from "@react-pdf/renderer";
import React from "react";
import CustomerDetailsView from "./CustomerDetailsView";

const PDFView = ({ customerDetails1 }) => {
  const styles = StyleSheet.create({
    page: {
      flexDirection: "row",
      backgroundColor: "white",
      fontSize: 10,
      zIndex: 10000,
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    title: {
      fontSize: 20,
      textAlign: "center",
      marginBottom: 5,
    },
    description: {
      fontSize: 15,
      textAlign: "start",
      margin: "6px 0",
    },
    image: {
      margin: "10px 0",
      width: "100%",
      alignSelf: "center",
    },
  });
  return (
    <Page size="A4" style={styles.page}>
      <CustomerDetailsView customerDetails1={customerDetails1} />
    </Page>
  );
};

export default PDFView;
