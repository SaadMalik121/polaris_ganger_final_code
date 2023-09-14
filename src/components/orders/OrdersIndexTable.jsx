import {
  TextField,
  IndexTable,
  LegacyCard,
  IndexFilters,
  useSetIndexFiltersMode,
  useIndexResourceState,
  // Text,
  // ChoiceList,
  // RangeSlider,
  Badge,
  Thumbnail,
  Spinner,
  Box,
  HorizontalStack,
  InlineError,
  Toast,
  Pagination,
} from "@shopify/polaris";
//   import type {IndexFiltersProps, TabProps} from '@shopify/polaris';
import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AppModal from "../AppModal";
import { editCategoryValue } from "../../store/GallerySlice";
import ordersApi from "../../api/orders";

function OrdersIndexTable() {
  const [selectedOrderStatus, setSelectedOrderStatus] = useState();
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.gallery.categories);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [selected, setSelected] = useState(0);

  const [isGraphicLoaded, setIsGraphicLoaded] = useState(false);
  const galleryFromStore = useSelector((state) => state.gallery.gallery);
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
  }, []);

  useEffect(() => {
    // Filter the galleryFromStore based on the queryValue
    let filteredGalleryList = [...galleryFromStore];
    if (queryValue.trim() !== "" && queryValue.length >= 3) {
      setIsLoading(true);

      filteredGalleryList = galleryFromStore.filter((product) => {
        const lowerQuery = queryValue.toLowerCase();
        const lowerCategory = product.category.toLowerCase();

        return (
          lowerCategory.includes(lowerQuery) ||
          product.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
        );
      });
    }
  }, [galleryFromStore, queryValue]);

  useEffect(() => {
    if (selected === 0) {
      getData();
    }

    if (selected === 1) {
      setSelectedOrderStatus("Pending");
      getData({
        payload: {
          type: "Pending",
        },
      });
    }
    if (selected === 2) {
      setSelectedOrderStatus("Approved");

      getData({
        payload: {
          type: "Approved",
        },
      });
    }
    if (selected === 3) {
      setSelectedOrderStatus("Disapproved");

      getData({
        payload: {
          type: "Disapproved",
        },
      });
    }
    if (selected === 4) {
      setSelectedOrderStatus("Resubmitted");

      getData({
        payload: {
          type: "Resubmitted",
        },
      });
    }
  }, [selected, getData]);
  // const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const [itemStrings] = useState([
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
  // const onCreateNewView = async (value) => {
  //   await sleep(500);
  //   setItemStrings([...itemStrings, value]);
  //   setSelected(itemStrings.length);
  //   return true;
  // };
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
  const onHandleCancel = () => {};

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
  const [accountStatus, setAccountStatus] = useState();
  const [moneySpent, setMoneySpent] = useState();
  const [taggedWith, setTaggedWith] = useState("");

  // const handleAccountStatusChange = useCallback(
  //   (value) => setAccountStatus(value),
  //   []
  // );
  // const handleMoneySpentChange = useCallback(
  //   (value) => setMoneySpent(value),
  //   []
  // );
  // const handleTaggedWithChange = useCallback(
  //   (value) => setTaggedWith(value),
  //   []
  // );
  const handleFiltersQueryChange = useCallback((value) => {
    setQueryValue(value);
    if (value.length >= 3) {
      setIsLoading(true);
      getData({
        payload: {
          type: selectedOrderStatus,
          keyword: value,
        },
      });
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  }, []);
  const handleAccountStatusRemove = useCallback(
    () => setAccountStatus(undefined),
    []
  );
  const handleMoneySpentRemove = useCallback(
    () => setMoneySpent(undefined),
    []
  );
  const handleTaggedWithRemove = useCallback(() => setTaggedWith(""), []);
  const handleQueryValueRemove = useCallback(() => setQueryValue(""), []);
  const handleFiltersClearAll = useCallback(() => {
    handleAccountStatusRemove();
    handleMoneySpentRemove();
    handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [
    handleAccountStatusRemove,
    handleMoneySpentRemove,
    handleQueryValueRemove,
    handleTaggedWithRemove,
  ]);

  const filters = [];

  const appliedFilters = [];
  if (accountStatus && !isEmpty(accountStatus)) {
    const key = "accountStatus";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, accountStatus),
      onRemove: handleAccountStatusRemove,
    });
  }
  if (moneySpent) {
    const key = "moneySpent";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, moneySpent),
      onRemove: handleMoneySpentRemove,
    });
  }
  if (!isEmpty(taggedWith)) {
    const key = "taggedWith";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, taggedWith),
      onRemove: handleTaggedWithRemove,
    });
  }

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
          // onCreateNewView={onCreateNewView}
          filters={filters}
          // appliedFilters={appliedFilters}
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
      case "moneySpent":
        return `Money spent is between $${value[0]} and $${value[1]}`;
      case "taggedWith":
        return `Tagged with ${value}`;
      case "accountStatus":
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
