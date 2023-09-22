import {
  TextField,
  IndexTable,
  IndexFilters,
  useSetIndexFiltersMode,
  useIndexResourceState,
  Badge,
  Thumbnail,
  Spinner,
  Box,
  HorizontalStack,
  InlineError,
  Toast,
  Pagination,
  Modal,
  Select,
  Text,
} from "@shopify/polaris";
import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FormattedMessage } from "react-intl";

function GraphicsIndexTable({
  categoryList,
  getCategories,
  isLoadingCategories,
  setCategoriesList,
}) {
  const [isEditCategoryModelDisplay, setIsEditCategoryModelDisplay] =
    useState(false);
  const [editCategory, setEditCategory] = useState();
  const [selectedCategoryValue, setSelectedCategoryValue] = useState("");
  const [isEditCategoryError, setIsEditCategoryError] = useState(false); //if submit form with empty category
  const [isSuccessCategoryEdited, setIsSuccessCategoryEdited] = useState(false);
  const [isGraphicLoaded, setIsGraphicLoaded] = useState(false);
  const [galleryListingData, setGalleryListingData] = useState();
  const [isEditCategoryLoading, setIsEditCategoryLoading] = useState(false);
  const [isEditBtnDisabled, setIsEditBtnDisabled] = useState(true);
  //Delete Category
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [isDeleteError, setIsDeleteError] = useState(false);
  const [isDeleteErrorSuccess, setIsDeleteErrorSuccess] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [queryValue, setQueryValue] = useState("");
  const navigation = useNavigate();
  const [selectedActiveStatus, setSelectedActiveStatus] = useState();

  //Modal
  const handleChange = useCallback(() => {
    setIsEditCategoryModelDisplay(!isEditCategoryModelDisplay);
    setIsEditBtnDisabled(true);
  }, [isEditCategoryModelDisplay, setIsEditCategoryModelDisplay]);

  //Edit Category
  const handleStatusChange = useCallback(
    (value) => {
      setSelectedActiveStatus(value === "true" ? true : false);
      setIsEditBtnDisabled(false);
    },
    [setSelectedActiveStatus]
  );

  const activeOptions = [
    { label: "Active", value: true },
    { label: "InActive", value: false },
  ];

  //Delete Category Modal
  const handleDeleteModalChange = useCallback(
    () => setIsShowDeleteModal(!isShowDeleteModal),
    [isShowDeleteModal, setIsShowDeleteModal]
  );
  const handleEditCategory = useCallback(async () => {
    setIsEditCategoryLoading(true);
    await axios.post(
      "https://gangr.uforiaprojects.com/api/local/saveCategory?shop=kamrandevstore.myshopify.com",
      {
        active: selectedActiveStatus,
        title: editCategory,
        id: selectedCategoryValue?.id,
      }
    );
    setIsEditCategoryError(false);
    setIsEditCategoryLoading(false);
    setIsSuccessCategoryEdited(true);
    setIsEditCategoryModelDisplay(false);
    setEditCategory("");
    setIsEditBtnDisabled(true);
    getCategories();
  }, [
    editCategory,
    selectedActiveStatus,
    selectedCategoryValue,
    getCategories,
  ]);
  async function getGalleryListings(pageNumber) {
    const { data } = await axios.post(
      `https://gangr.uforiaprojects.com/api/local/searchGallery?shop=kamrandevstore.myshopify.com&page=${pageNumber}`
    );
    setGalleryListingData(data);
    setIsGraphicLoaded(true);
  }

  const getCategoriesListing = async () => {
    const { data } = await axios.post(
      "https://gangr.uforiaprojects.com/api/local/searchCategory?shop=kamrandevstore.myshopify.com"
    );
    setCategoriesList(data?.data);
  };

  useEffect(() => {
    if (selected !== 1) {
      getGalleryListings();
    }
    if (selected === 1) {
      getCategoriesListing();
    }
  }, [queryValue, handleDeleteModalChange]);

  const [itemStrings] = useState(["Gallery", "Categories"]);

  const tabs = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => {},
    id: `${item}-${index}`,
    isLocked: index === 0,
  }));
  const [selected, setSelected] = useState(0);

  const { mode, setMode } = useSetIndexFiltersMode();
  const onHandleCancel = () => {
    setQueryValue("");
  };

  const handleFiltersQueryChange = useCallback(
    async (value) => {
      setQueryValue(value);
      if (value.length >= 3 && selected !== 1) {
        setIsLoading(true);

        const formData = new FormData();
        formData.append("tags", value);
        // formData.append("title", value);

        const { data: tagsSearch } = await axios.post(
          "https://gangr.uforiaprojects.com/api/local/searchGallery?shop=kamrandevstore.myshopify.com",
          {
            tags: value,
          }
        );
        const { data: titleSearch } = await axios.post(
          "https://gangr.uforiaprojects.com/api/local/searchGallery?shop=kamrandevstore.myshopify.com",
          {
            title: value,
          }
        );

        setGalleryListingData(
          tagsSearch?.data?.data?.length > 0 ? tagsSearch : titleSearch
        );
        setIsLoading(false);
      } else if (value.length >= 3 && selected === 1) {
        setIsLoading(true);

        const { data } = await axios.post(
          "https://gangr.uforiaprojects.com/api/local/searchCategory?shop=kamrandevstore.myshopify.com",
          {
            title: value,
          }
        );

        setCategoriesList(data?.data);
        if (data) {
          setIsLoading(false);
        }
      }
    },
    [selected, setCategoriesList]
  );

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
    useIndexResourceState(
      selected === 1 ? categoryList?.data : galleryListingData?.data?.data
    );

  const isSelectedTabNotCategory = selected !== 1;
  let rowMarkup;
  // Render rows conditionally based on the selected tab
  // Check if the selected tab is not 1 (i.e., not "Category")
  if (isSelectedTabNotCategory) {
    rowMarkup = galleryListingData?.data?.data?.map(
      ({ file, category, active, tags, id }, indexOuter) => (
        <IndexTable.Row
          id={id}
          key={id}
          selected={selectedResources.includes(id)}
          onClick={() => navigation(`/edit-graphic/${id}`)}
        >
          <IndexTable.Cell>
            <Thumbnail source={file} size="small" />
          </IndexTable.Cell>
          <IndexTable.Cell>{category?.title}</IndexTable.Cell>
          <IndexTable.Cell>{tags}</IndexTable.Cell>
          <IndexTable.Cell>
            <Badge status={!active ? "critical" : "success"}>
              {active ? "Active" : "Inactive"}
            </Badge>
          </IndexTable.Cell>
        </IndexTable.Row>
      )
    );
  } else {
    // Render rows for the "Category" tab
    rowMarkup = categoryList?.data.map((data) => (
      <IndexTable.Row
        id={data?.id}
        key={data?.id}
        selected={selectedResources.includes(data?.id)}
        onClick={() => {
          setIsEditCategoryModelDisplay(true);
          setEditCategory(data?.title);
          setSelectedCategoryValue(data);
          setSelectedActiveStatus(data?.active ? true : false);
        }}
      >
        <IndexTable.Cell></IndexTable.Cell>
        <IndexTable.Cell>{data?.title}</IndexTable.Cell>
        <IndexTable.Cell>
          <Badge status={data?.active === 0 ? "critical" : "success"}>
            {data?.active === 0 ? "InActive" : "Active"}
          </Badge>
        </IndexTable.Cell>
      </IndexTable.Row>
    ));
  }
  return (
    <>
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
      {(selected !== 1 && !isGraphicLoaded) ||
      (selected === 1 && isLoadingCategories) ? (
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
      ) : galleryListingData && //when category is loading
        !isLoading ? ( //when typing more than 3 words (loader display)
        <IndexTable
          resourceName={resourceName}
          itemCount={
            selected !== 1
              ? galleryListingData?.data?.data?.length || 0
              : categoryList?.data?.length || 0
          }
          selectedItemsCount={
            allResourcesSelected ? "All" : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          headings={
            selected !== 1
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
      ) : (
        <Box padding={10}>
          <HorizontalStack align="center">
            <Spinner accessibilityLabel="Spinner example" size="large" />
          </HorizontalStack>
        </Box>
      )}

      {/* Edit Category MODAL */}
      <Modal
        open={isEditCategoryModelDisplay}
        onClose={handleChange}
        title={<FormattedMessage id="editCategoryModalTitle" />}
        primaryAction={{
          loading: isEditCategoryLoading,
          content: <FormattedMessage id="editCategorySaveBtn" />,
          disabled: isEditBtnDisabled,
          onAction: () => {
            if (editCategory) {
              handleEditCategory();
            } else {
              setIsEditCategoryError(true);
            }
          },
        }}
        secondaryActions={{
          content: <FormattedMessage id="editCategoryDeleteBtn" />,
          onAction: () => {
            setIsShowDeleteModal(true);
          },
        }}
      >
        <Modal.Section>
          <TextField
            placeholder="Enter Category Name"
            value={editCategory}
            onChange={(e) => {
              setEditCategory(e);
              setIsEditBtnDisabled(false);
            }}
          />
          {isEditCategoryError && (
            <InlineError message={"Category field can not be empty"} />
          )}
          <Box style={{ marginTop: "20px" }}>
            <Select
              options={activeOptions}
              onChange={handleStatusChange}
              value={selectedActiveStatus}
            />
          </Box>
        </Modal.Section>
      </Modal>

      {/* Delete Category Confirmation Modal */}
      {isDeleteError && (
        <Toast
          content="Error while deleting category"
          duration={2000}
          onDismiss={() => setIsDeleteError(false)}
        />
      )}
      {isDeleteErrorSuccess && (
        <Toast
          content="Category Deleted Successfully"
          duration={2000}
          onDismiss={() => setIsDeleteErrorSuccess(false)}
        />
      )}
      {isShowDeleteModal && (
        <Modal
          open={isShowDeleteModal}
          onClose={handleDeleteModalChange}
          title={<FormattedMessage id="deleteCategoryModalTitle" />}
          primaryAction={{
            content: <FormattedMessage id="deleteCategoryYesBtn" />,
            loading: isLoadingDelete,
            onAction: async () => {
              try {
                setIsLoadingDelete(true);
                await axios.post(
                  `https://gangr.uforiaprojects.com/api/local/deleteCategory/${selectedCategoryValue.id}?shop=kamrandevstore.myshopify.com`
                );
                setIsLoadingDelete(false);
                navigation("/gallery-listing");
                setIsShowDeleteModal(false);
                setIsEditCategoryModelDisplay(false);
                setIsDeleteErrorSuccess(true);
              } catch (error) {
                setIsDeleteError(true);
                setIsLoadingDelete(false);
              }
            },
          }}
        >
          <Modal.Section>
            <Text>{<FormattedMessage id="deleteGraphicDescription" />}</Text>
          </Modal.Section>
        </Modal>
      )}

      {isSuccessCategoryEdited && (
        <Toast
          content="Category Edited Successful"
          duration={2000}
          onDismiss={() => setIsSuccessCategoryEdited(false)}
        />
      )}
      {/* Pagination for category tab */}
      {selected === 1 && categoryList?.last_page > 1 && (
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "30px",
          }}
        >
          <Pagination
            hasPrevious={categoryList?.current_page > 1}
            onPrevious={() => {
              getCategories(categoryList?.current_page - 1);
            }}
            hasNext={categoryList?.current_page < categoryList?.last_page}
            onNext={() => {
              getCategories(categoryList?.current_page + 1);
              selectedResources = [];
            }}
          />
        </Box>
      )}

      {/* Pagination for all/graphic  tab */}
      {selected !== 1 && galleryListingData?.data?.last_page > 1 && (
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "30px",
          }}
        >
          <Pagination
            hasPrevious={galleryListingData?.data?.current_page > 1}
            onPrevious={() => {
              getGalleryListings(galleryListingData?.data?.current_page - 1);
            }}
            hasNext={
              galleryListingData?.data?.current_page <
              galleryListingData?.data?.last_page
            }
            onNext={() => {
              getGalleryListings(galleryListingData?.data?.current_page + 1);
              selectedResources = [];
            }}
          />
        </Box>
      )}
    </>
  );
}

export default GraphicsIndexTable;
