import {
  IndexTable,
  LegacyCard,
  IndexFilters,
  useSetIndexFiltersMode,
  useIndexResourceState,
  ChoiceList,
  Badge,
  Pagination,
  Spinner,
  HorizontalStack,
  Box,
  Text,
} from "@shopify/polaris";
import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ordersApi from "../../api/orders";

function OrdersIndexTable() {
  const appliedFilters = [];

  const [selectedOrderStatus, setSelectedOrderStatus] = useState();
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [selected, setSelected] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [queryValue, setQueryValue] = useState("");
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState();

  const getData = useCallback(async (params) => {
    setIsLoadingOrders(true);

    const data = await ordersApi.getOrdersListing({
      pageNum: params?.pageNum,
      payload: params?.payload,
    });
    setOrderData(data);
    setIsLoadingOrders(false);
    setIsLoading(false);
  }, []);

  const handleOrderStatusChange = useCallback(
    (value) => {
      setOrderStatus(value);
      getData({
        payload: {
          type: value,
        },
      });
    },
    [getData]
  );

  const handleDateStatusChange = useCallback((value) => {
    setDateStatus(value);
  }, []);

  useEffect(() => {
    //All Tab selected
    if (selected === 0) {
      handleOrderStatusChange([]);
      getData();
    }
    //Pending Tab selected
    else if (selected === 1) {
      handleOrderStatusChange(["Pending"]);
      setSelectedOrderStatus("Pending");
      getData({
        payload: {
          type: ["Pending"],
        },
      });
    }
    //Approved Tab Selected
    else if (selected === 2) {
      handleOrderStatusChange(["Approved"]);

      setSelectedOrderStatus("Approved");

      getData({
        payload: {
          type: ["Approved"],
        },
      });
    }
    //Disapproved Tab Selected
    else if (selected === 3) {
      handleOrderStatusChange(["Disapproved"]);

      setSelectedOrderStatus("Disapproved");

      getData({
        payload: {
          type: ["Disapproved"],
        },
      });
    }
    //Resubmitted Tab Selected
    else if (selected === 4) {
      handleOrderStatusChange(["Resubmitted"]);

      setSelectedOrderStatus("Resubmitted");

      getData({
        payload: {
          type: ["Resubmitted"],
        },
      });
    }
  }, [selected, getData, handleOrderStatusChange]);
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  //Tabs
  const [itemStrings, setItemStrings] = useState([
    "All",
    "Pending",
    "Approved",
    "Disapproved",
    "ReSubmitted",
  ]);

  // const deleteView = (index) => {
  //   const newItemStrings = [...itemStrings];
  //   newItemStrings.splice(index, 1);
  //   setItemStrings(newItemStrings);
  //   setSelected(0);
  // };

  // const duplicateView = async (name) => {
  //   setItemStrings([...itemStrings, name]);
  //   setSelected(itemStrings.length);
  //   await sleep(1);
  //   return true;
  // };

  const tabs = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => {},
    id: `${item}-${index}`,
    isLocked: index === 0,
    // actions:
    //   index === 0
    //     ? []
    //     : [
    //         {
    //           type: "rename",
    //           onAction: () => {},
    //           onPrimaryAction: async (value) => {
    //             const newItemsStrings = tabs.map((item, idx) => {
    //               if (idx === index) {
    //                 return value;
    //               }
    //               return item.content;
    //             });
    //             await sleep(1);
    //             setItemStrings(newItemsStrings);
    //             return true;
    //           },
    //         },
    //         {
    //           type: "duplicate",
    //           onPrimaryAction: async (value) => {
    //             await sleep(1);
    //             duplicateView(value);
    //             return true;
    //           },
    //         },
    //         {
    //           type: "edit",
    //         },
    //         {
    //           type: "delete",
    //           onPrimaryAction: async () => {
    //             await sleep(1);
    //             deleteView(index);
    //             return true;
    //           },
    //         },
    //       ],
  }));
  const onCreateNewView = async (value) => {
    await sleep(500);
    setItemStrings([...itemStrings, value]);
    setSelected(itemStrings.length);
    return true;
  };
  const sortOptions = [
    { label: "Order", value: "order asc", directionLabel: "Ascending" },
    { label: "Order", value: "order desc", directionLabel: "Descending" },
    { label: "Customer", value: "customer asc", directionLabel: "A-Z" },
    { label: "Customer", value: "customer desc", directionLabel: "Z-A" },
    { label: "Date", value: "date asc", directionLabel: "A-Z" },
    { label: "Date", value: "date desc", directionLabel: "Z-A" },
    { label: "Total", value: "total asc", directionLabel: "Ascending" },
    { label: "Total", value: "total desc", directionLabel: "Descending" },
  ];
  const [sortSelected, setSortSelected] = useState(["order asc"]);
  const { mode, setMode } = useSetIndexFiltersMode();
  const onHandleCancel = () => {
    handleFiltersClearAll();
  };

  // const onHandleSave = async () => {
  //   await sleep(1);
  //   return true;
  // };

  // const primaryAction =
  //   selected === 0
  //     ? {
  //         type: "save-as",
  //         onAction: onCreateNewView,
  //         disabled: false,
  //         loading: false,
  //       }
  //     : {
  //         type: "save",
  //         onAction: onHandleSave,
  //         disabled: false,
  //         loading: false,
  //       };
  const [orderStatus, setOrderStatus] = useState();
  const [dateStatus, setDateStatus] = useState();
  //   const [taggedWith, setTaggedWith] = useState("");

  //   const handleMoneySpentChange = useCallback(
  //     (value) => setMoneySpent(value),
  //     []
  //   );
  //   const handleTaggedWithChange = useCallback(
  //     (value) => setTaggedWith(value),
  //     []
  //   );
  const handleFiltersQueryChange = useCallback(
    (value) => {
      setQueryValue(value);
      if (value.length >= 3) {
        setIsLoading(true);
        getData({
          payload: {
            type: selectedOrderStatus,
            keyword: value,
          },
        });
      } else if (value.trim() === "") {
        getData();
      }
    },
    [getData, selectedOrderStatus]
  );
  const handleOrderStatusRemove = useCallback(() => {
    if (selected === 1) {
      setOrderStatus(["Pending"]);
      getData({ payload: { type: ["Pending"] } });
    } else if (selected === 2) {
      setOrderStatus(["Approved"]);
      getData({ payload: { type: ["Approved"] } });
    } else if (selected === 3) {
      setOrderStatus(["Disapproved"]);
      getData({ payload: { type: ["Disapproved"] } });
    } else if (selected === 4) {
      setOrderStatus(["Resubmitted"]);
      getData({ payload: { type: ["Resubmitted"] } });
    } else {
      setOrderStatus([]);
      getData();
    }
  }, [getData, selected]);
  const hadleDateStatusRemove = useCallback(() => setDateStatus(undefined), []);
  //   const handleTaggedWithRemove = useCallback(() => setTaggedWith(""), []);
  const handleQueryValueRemove = useCallback(() => setQueryValue(""), []);
  const handleFiltersClearAll = useCallback(() => {
    handleOrderStatusRemove();
    hadleDateStatusRemove();
    // handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [
    handleOrderStatusRemove,
    hadleDateStatusRemove,
    handleQueryValueRemove,
    // handleTaggedWithRemove,
  ]);

  const filters = [
    {
      key: "order_status",
      label: "Order status",
      filter: (
        <ChoiceList
          title="Order status"
          titleHidden
          choices={[
            { label: "Pending", value: "Pending" },
            { label: "Print Queue", value: "Print Queue" },
            { label: "Printed", value: "Printed" },
            { label: "Dispatched", value: "Dispatched" },
            { label: "On Hold", value: "On Hold" },
            { label: "Cancelled", value: "Cancelled" },
            { label: "Refunded", value: "Refunded" },
            { label: "Ready For Collection", value: "Ready For Collection" },
          ]}
          selected={orderStatus || []}
          onChange={handleOrderStatusChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: "Date",
      label: "Date",
      filter: (
        <>
          <ChoiceList
            title="Date"
            titleHidden
            choices={[
              { label: "Today", value: "Today" },
              { label: "Last 7 Days", value: "Last 7 Days" },
              { label: "Last 30 Days", value: "Last 30 Days" },
              { label: "Last 90 Days", value: "Last 90 Days" },
              { label: "Last 12 Months", value: "Last 12 Months" },
              { label: "Custom", value: "Custom" },
            ]}
            selected={dateStatus || []}
            onChange={handleDateStatusChange}
          />
          {dateStatus?.includes("Custom") && (
            <div>
              <Text>Starting</Text>
              <input
                type="date"
                placeholder="Custom Start Date"
                style={{
                  width: "100%",
                  padding: "8px",
                  margin: "10px 0px",
                }}
              />
              <Text>Ending</Text>

              <input
                type="date"
                placeholder="Custom End Date"
                style={{
                  width: "100%",
                  padding: "8px",
                  margin: "10px 0px",
                }}
              />
            </div>
          )}
        </>
      ),
      shortcut: true,
    },
  ];

  if (orderStatus && !isEmpty(orderStatus)) {
    const key = "order_status";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, orderStatus),
      onRemove: handleOrderStatusRemove,
    });
  }
  if (dateStatus) {
    const key = "Date";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, dateStatus),
      onRemove: hadleDateStatusRemove,
    });
  }
  //   if (!isEmpty(taggedWith)) {
  //     const key = "taggedWith";
  //     appliedFilters.push({
  //       key,
  //       label: disambiguateLabel(key, taggedWith),
  //       onRemove: handleTaggedWithRemove,
  //     });
  //   }

  const resourceName = {
    singular: "order",
    plural: "orders",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(orderData?.orders?.data);

  let rowMarkup = orderData?.orders?.data?.map(
    (
      {
        customer,
        id,
        shopify_order_number,
        updated_at,
        price,
        sheets_download_status,
        quantity_of_sheets,
        order_status,
        has_low_dpi,
      },
      index
    ) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
        onClick={() => navigate(`/order-details/${id}`)}
      >
        <IndexTable.Cell>{shopify_order_number}</IndexTable.Cell>
        <IndexTable.Cell>
          {JSON.stringify(new Date(updated_at).getHours() % 12) < 10
            ? 0 + JSON.stringify(new Date(updated_at).getHours() % 12)
            : JSON.stringify(new Date(updated_at).getHours() % 12)}
          :
          {JSON.stringify(new Date(updated_at).getMinutes() % 60) < 10
            ? 0 + JSON.stringify(new Date(updated_at).getMinutes() % 60)
            : JSON.stringify(new Date(updated_at).getMinutes() % 60)}
          {JSON.stringify(new Date(updated_at).getHours() > 12) ? "am" : "pm"}
        </IndexTable.Cell>
        <IndexTable.Cell>{customer?.name}</IndexTable.Cell>
        <IndexTable.Cell>{price}</IndexTable.Cell>
        {/* <IndexTable.Cell>{sheets_download_status}</IndexTable.Cell> */}
        <IndexTable.Cell>
          <HorizontalStack align="center">
            <Badge
              status={
                sheets_download_status
                  ? "critical"
                  : "warning-strong-experimental"
              }
            >
              {sheets_download_status ? sheets_download_status : "Rendering"}
            </Badge>
          </HorizontalStack>
        </IndexTable.Cell>
        <IndexTable.Cell>{quantity_of_sheets}</IndexTable.Cell>
        <IndexTable.Cell>{order_status}</IndexTable.Cell>
        <IndexTable.Cell>
          {JSON.stringify(new Date(updated_at).getHours() % 12) < 10
            ? 0 + JSON.stringify(new Date(updated_at).getHours() % 12)
            : JSON.stringify(new Date(updated_at).getHours() % 12)}
          :
          {JSON.stringify(new Date(updated_at).getMinutes() % 60) < 10
            ? 0 + JSON.stringify(new Date(updated_at).getMinutes() % 60)
            : JSON.stringify(new Date(updated_at).getMinutes() % 60)}
          {JSON.stringify(new Date(updated_at).getHours() > 12) ? "am" : "pm"}
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Badge status={has_low_dpi === 0 ? "critical" : "success"}>
            {has_low_dpi === 0 ? "Yes" : "No"}
          </Badge>
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  return (
    <>
      <LegacyCard>
        <IndexFilters
          sortOptions={sortOptions}
          sortSelected={sortSelected}
          queryValue={queryValue}
          queryPlaceholder="Searching in all"
          onQueryChange={handleFiltersQueryChange}
          onQueryClear={() => {
            setQueryValue("");
          }}
          onSort={setSortSelected}
          // primaryAction={primaryAction}
          cancelAction={{
            onAction: onHandleCancel,
            disabled: false,
            loading: false,
          }}
          tabs={tabs}
          selected={selected}
          onSelect={setSelected}
          canCreateNewView={false}
          onCreateNewView={onCreateNewView}
          filters={filters}
          appliedFilters={appliedFilters}
          onClearAll={handleFiltersClearAll}
          mode={mode}
          setMode={setMode}
        />
        {isLoadingOrders ? (
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100px",
            }}
          >
            <Spinner />
          </Box>
        ) : !isLoading ? (
          <IndexTable
            resourceName={resourceName}
            itemCount={orderData?.orders ? orderData?.orders?.data?.length : 1}
            selectedItemsCount={
              allResourcesSelected ? "All" : selectedResources.length
            }
            onSelectionChange={handleSelectionChange}
            headings={[
              { title: "Orders" },
              { title: "Last Status Updated" },
              { title: "Customer" },
              { title: "Price" },
              { title: "Sheets Generation Status" },
              { title: "Qty of Sheets" },
              { title: "Sheets Status" },
              { title: "Last Status Update" },
              { title: "Has Low DPI" },
              { title: "" },
            ]}
          >
            {rowMarkup}
          </IndexTable>
        ) : (
          <HorizontalStack align="center">
            <Spinner accessibilityLabel="Spinner example" size="large" />
          </HorizontalStack>
        )}
      </LegacyCard>
      {/* Pagination */}
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "30px",
        }}
      >
        <Pagination
          hasPrevious={orderData?.orders?.current_page > 1}
          onPrevious={() => {
            getData({
              pageNum:
                orderData?.orders?.current_page > 1 &&
                orderData.orders.current_page - 1,
            });
          }}
          hasNext={
            orderData?.orders?.current_page < orderData?.orders?.last_page
          }
          onNext={async () => {
            getData({
              pageNum:
                orderData?.orders?.current_page <
                  orderData?.orders?.last_page &&
                orderData.orders.current_page + 1,
            });
          }}
        />
      </Box>
    </>
  );

  function disambiguateLabel(key, value) {
    switch (key) {
      //   case "moneySpent":
      //     return `Money spent is between $${value[0]} and $${value[1]}`;
      //   case "taggedWith":
      //     return `Tagged with ${value}`;
      case "order_status":
        return value.map((val) => `Customer ${val}`).join(", ");
      default:
        return value;
    }
  }

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === "" || value == null;
    }
  }
}

export default OrdersIndexTable;
