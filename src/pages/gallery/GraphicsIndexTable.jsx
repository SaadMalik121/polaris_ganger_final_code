import {
  IndexTable,
  IndexFilters,
  useSetIndexFiltersMode,
  useIndexResourceState,
  Badge,
  Thumbnail,
  Spinner,
  Box,
  Toast,
  Pagination,
} from "@shopify/polaris";
import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CategoryModal from "./CategoryModal";

function GraphicsIndexTable({ refetch }) {
  const navigate = useNavigate();
  const [listingData, setListingData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [selected, setSelected] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [queryValue, setQueryValue] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [editCategoryData, setEditCategoryData] = useState();
  const [isSuccessCategoryEdited, setIsSuccessCategoryEdited] = useState(false);

  //Delete Category
  const [showCategoryDeletedAlert, setShowCategoryDeletedAlert] =
    useState(false);

  const [itemStrings] = useState(["Gallery", "Categories"]);

  const tabs = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => {},
    id: `${item}-${index}`,
    isLocked: index === 0,
  }));

  const handleEditCategory = useCallback(async (data) => {
    setEditCategoryData(data);

    setShowCategoryModal(true);
  }, []);

  const getListingData = async () => {
    let url =
      selected === 0
        ? `https://gangr.uforiaprojects.com/api/local/searchGallery?page=${currentPage}&shop=kamrandevstore.myshopify.com`
        : `https://gangr.uforiaprojects.com/api/local/searchCategory?page=${currentPage}&shop=kamrandevstore.myshopify.com`;
    setIsLoading(true);

    await axios
      .post(url, { keyword: queryValue })
      .then((res) => {
        if (res.status === 200) {
          setIsLoading(false);
          const { data, prev_page_url, next_page_url } = res.data.details;
          setListingData(data);
          next_page_url ? setHasNext(true) : setHasNext(false);
          prev_page_url ? setHasPrevious(true) : setHasPrevious(false);
        }
      })
      .catch((err) => console.log(err));
  };

  const { mode, setMode } = useSetIndexFiltersMode();
  const onHandleCancel = () => {
    setQueryValue("");
  };

  const handleFiltersQueryChange = useCallback(async (value) => {
    setQueryValue(value);
  }, []);

  const handleQueryValueRemove = useCallback(() => setQueryValue(""), []);
  const handleFiltersClearAll = useCallback(() => {
    handleQueryValueRemove();
  }, [handleQueryValueRemove]);

  const filters = [];

  const resourceName = {
    singular: "graphic",
    plural: "graphics",
  };

  let { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(listingData);

  const rowMarkup =
    selected === 0
      ? listingData.map(({ file, category, active, tags, id }) => (
          <IndexTable.Row
            id={id}
            key={id}
            selected={selectedResources.includes(id)}
            onClick={() => navigate(`/edit-graphic/${id}`)}
          >
            <IndexTable.Cell>
              <Thumbnail source={file} size="small" alt="img" />
            </IndexTable.Cell>
            <IndexTable.Cell>{category?.title}</IndexTable.Cell>
            <IndexTable.Cell>{tags}</IndexTable.Cell>
            <IndexTable.Cell>
              <Badge status={!active ? "critical" : "success"}>
                {active ? "Active" : "Inactive"}
              </Badge>
            </IndexTable.Cell>
          </IndexTable.Row>
        ))
      : listingData?.map(({ id, title, active }) => (
          <IndexTable.Row
            id={id}
            key={id}
            selected={selectedResources.includes(id)}
            onClick={() => {
              handleEditCategory({ id, title, active });
            }}
          >
            <IndexTable.Cell></IndexTable.Cell>
            <IndexTable.Cell>{title}</IndexTable.Cell>
            <IndexTable.Cell>
              <Badge status={active === 0 ? "critical" : "success"}>
                {active === 0 ? "InActive" : "Active"}
              </Badge>
            </IndexTable.Cell>
          </IndexTable.Row>
        ));

  useEffect(() => {
    if (queryValue.length === 0 || queryValue.length > 2) {
      getListingData();
    }
  }, [queryValue]);

  useEffect(() => {
    setCurrentPage(1);
    getListingData();
  }, [selected]);

  useEffect(() => {
    getListingData();
  }, [currentPage, refetch, isSuccessCategoryEdited, showCategoryDeletedAlert]);

  return (
    <>
      {showCategoryModal && (
        <CategoryModal
          // show={showCategoryModal}
          onHide={() => setShowCategoryModal(false)}
          editCategoryData={editCategoryData}
          savedCategory={editCategoryData}
          onSuccess={() => setIsSuccessCategoryEdited(true)}
          onDelete={() => setShowCategoryDeletedAlert(true)}
        />
      )}
      <IndexFilters
        queryValue={queryValue}
        queryPlaceholder="Searching in all"
        onQueryChange={handleFiltersQueryChange}
        onQueryClear={() => {
          setQueryValue("");
        }}
        cancelAction={{
          onAction: onHandleCancel,
          disabled: false,
          loading: false,
        }}
        tabs={tabs}
        selected={selected}
        onSelect={setSelected}
        canCreateNewView={false}
        filters={filters}
        onClearAll={handleFiltersClearAll}
        mode={mode}
        setMode={setMode}
      />
      {isLoading ? (
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
      ) : (
        <IndexTable
          resourceName={resourceName}
          itemCount={listingData.length}
          selectedItemsCount={
            allResourcesSelected ? "All" : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          headings={
            selected === 0
              ? [
                  { title: "" },
                  { title: "Category" },
                  { title: "Tags" },
                  { title: "Status" },
                ]
              : [{ title: "" }, { title: "Category" }, { title: "Status" }]
          }
        >
          {rowMarkup}
        </IndexTable>
      )}

      {/* Delete Category Confirmation Modal */}
      {showCategoryDeletedAlert && (
        <Toast
          content="Category Deleted Successfully"
          duration={2000}
          onDismiss={() => setShowCategoryDeletedAlert(false)}
        />
      )}

      {isSuccessCategoryEdited && (
        <Toast
          content="Category Edited Successful"
          duration={2000}
          onDismiss={() => setIsSuccessCategoryEdited(false)}
        />
      )}

      {/* Pagination for category tab */}
      {(hasNext || hasPrevious) && (
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "30px",
          }}
        >
          <Pagination
            hasPrevious={hasPrevious}
            onPrevious={() => {
              setCurrentPage(currentPage - 1);
            }}
            hasNext={hasNext}
            onNext={() => {
              setCurrentPage(currentPage + 1);
            }}
          />
        </Box>
      )}
    </>
  );
}

export default GraphicsIndexTable;
