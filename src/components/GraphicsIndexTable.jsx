import {
  TextField,
  IndexTable,
  LegacyCard,
  IndexFilters,
  useSetIndexFiltersMode,
  useIndexResourceState,
  Text,
  ChoiceList,
  RangeSlider,
  Badge,
  Thumbnail,
  Spinner,
  Box,
  HorizontalStack,
} from "@shopify/polaris";
//   import type {IndexFiltersProps, TabProps} from '@shopify/polaris';
import React, { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";

function GraphicsIndexTable() {
  const [graphicList, setGraphicList] = useState([]);
  const [isGraphicLoaded, setIsGraphicLoaded] = useState(false);
  const galleryFromStore = useSelector((state) => state.gallery.gallery);
  const [isLoading, setIsLoading] = useState(false);
  const [queryValue, setQueryValue] = useState("");

  useEffect(() => {
    // Filter the galleryFromStore based on the queryValue
    let filteredGalleryList = galleryFromStore;
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

    setGraphicList(filteredGalleryList);
    setIsGraphicLoaded(true);
  }, [galleryFromStore, queryValue]);
  // const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const [itemStrings] = useState(["All", "Categories", "Graphics"]);
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
  const [selected, setSelected] = useState(0);
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

  const handleAccountStatusChange = useCallback(
    (value) => setAccountStatus(value),
    []
  );
  const handleMoneySpentChange = useCallback(
    (value) => setMoneySpent(value),
    []
  );
  const handleTaggedWithChange = useCallback(
    (value) => setTaggedWith(value),
    []
  );
  const handleFiltersQueryChange = useCallback((value) => {
    setQueryValue(value);
    if (value.length >= 3) {
      setIsLoading(true);
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
    singular: "graphic",
    plural: "graphics",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(graphicList);

  const rowMarkup = graphicList.map(
    ({ image, category, status, tags, id }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          {/* if category is selected than dont show image */}
          {selected !== 1 && <Thumbnail source={image[0]} size="small" />}
        </IndexTable.Cell>
        <IndexTable.Cell>{category}</IndexTable.Cell>
        <IndexTable.Cell>
          {selected !== 1
            ? tags.map((tag, index) => (
                <React.Fragment key={tag}>
                  {tag}
                  {tags[index + 1] && ","}
                </React.Fragment>
              ))
            : "-"}
        </IndexTable.Cell>
        <IndexTable.Cell>
          {selected !== 1 ? (
            <Badge status={status === "InActive" ? "critical" : "success"}>
              {status}
            </Badge>
          ) : (
            "-"
          )}
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  return (
    <LegacyCard>
      <IndexFilters
        sortOptions={sortOptions}
        sortSelected={sortSelected}
        queryValue={queryValue}
        queryPlaceholder="Searching in all"
        onQueryChange={handleFiltersQueryChange}
        onQueryClear={() => {}}
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
      {!isGraphicLoaded ? (
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
          itemCount={graphicList.length}
          selectedItemsCount={
            allResourcesSelected ? "All" : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          headings={[
            { title: "" },
            { title: "Category" },
            { title: "Tags" },
            { title: "Status" },
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

export default GraphicsIndexTable;
