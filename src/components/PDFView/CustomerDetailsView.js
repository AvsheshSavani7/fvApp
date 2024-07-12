import { Page, StyleSheet, Text, View, Image } from "@react-pdf/renderer";
import React from "react";

const CustomerDetailsView = ({ customerDetails1 }) => {
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
    heading: {
      backgroundColor: "#D8D8D8",
      padding: "6px",
      height: 40,
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "start",
      marginTop: 10,
    },
    heading_title: {
      color: "black",
      fontSize: 20,
      textAlign: "start",
    },
  });

  let allQuestions =
    Object.keys(customerDetails1 || {}).length > 0
      ? [...customerDetails1?.fv_data?.customer?.buildingType?.subQuestion]
      : [];

  const question1 = allQuestions.find(
    (question) => question.question === "Confirmation of 220V Power Source ?"
  );
  const question2 = allQuestions.find(
    (question) =>
      question.question === "Discussed 220w/ customer & included in Scope"
  );
  const question3 = allQuestions.find(
    (question) => question.question === "COI Required for Project"
  );
  const question4 = allQuestions.find(
    (question) => question.question === "Apt Parking instructions:"
  );
  const question5 = allQuestions.find(
    (question) =>
      question.question ===
      "Are there any Metal Doors where wood will be scored?"
  );
  const question6 = allQuestions.find(
    (question) => question.question === "Floor Level of Apartment building"
  );

  return (
    <View style={styles.heading}>
      <Text style={styles.heading_title}>Customer Details</Text>
    </View>
  );
};

export default CustomerDetailsView;
