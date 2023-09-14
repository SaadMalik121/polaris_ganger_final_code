import React, { useCallback, useEffect, useState } from "react";
import ordersApi from "../../api/orders";
import { Box, Page } from "@shopify/polaris";
import OrdersIndexTable from "../../components/orders/OrdersIndexTable";

function OrdersListing() {
  // async function getData() {
  //     const data = await ordersApi.getOrdersListing();
  //     console.log(data);
  //     setOrderData(data);
  //   }

  return (
    <Box padding={5}>
      <Page title="Orders" subtitle="View All your Ganger Orders">
        <OrdersIndexTable />
      </Page>
    </Box>
  );
}

export default OrdersListing;
