import { Box, Card, HorizontalStack, Select, Text } from "@shopify/polaris";
import React, { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";

function Navigation() {
  return (
    <Box
      style={{
        backgroundColor: "green",
      }}
    >
      <HorizontalStack align="space-evenly">
        <Box>
          <NavLink
            to={"/"}
            style={{
              textDecoration: "none",
              color: "white",
              padding: "2px ",
            }}
          >
            <Text>DashBoard</Text>
          </NavLink>
        </Box>
        <Box>
          <NavLink
            to={"/gallery-listing"}
            style={{
              textDecoration: "none",
              color: "white",
              padding: "2px ",
            }}
          >
            <Text>Gallery</Text>
          </NavLink>
        </Box>
        <Box>
          <NavLink
            to={"/order-listing"}
            style={{
              textDecoration: "none",
              color: "white",
              padding: "2px ",
            }}
          >
            <Text>Orders</Text>
          </NavLink>
        </Box>
      </HorizontalStack>
    </Box>
  );
}

export default Navigation;
