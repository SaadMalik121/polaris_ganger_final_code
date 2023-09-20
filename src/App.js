import React, { useCallback, useEffect, useState } from "react";
import MyRouter from "./router";
import Navigation from "./components/Navigation";
import { IntlProvider } from "react-intl";
import { messagesInEnglish, messagesInFrench } from "./utils/Languages";
import { Box, Select } from "@shopify/polaris";

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("selectedLanguage") || "English"
  );

  const handleSelectChange = useCallback((value) => {
    setSelectedLanguage(value);
    localStorage.setItem("selectedLanguage", value);
  }, []);

  const LanguageOptions = [
    { label: "English", value: "English" },
    { label: "French", value: "French" },
  ];

  return (
    <IntlProvider
      locale="en"
      messages={
        selectedLanguage === "French" ? messagesInFrench : messagesInEnglish
      }
    >
      <Navigation />
      <Box padding={2} style={{ width: "10%" }}>
        <Select
          // label="Choose Language"
          options={LanguageOptions}
          onChange={handleSelectChange}
          value={selectedLanguage}
        />
      </Box>
      <MyRouter />
    </IntlProvider>
  );
}

export default App;
