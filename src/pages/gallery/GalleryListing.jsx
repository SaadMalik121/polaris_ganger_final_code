import {
  Box,
  Frame,
  InlineError,
  Modal,
  Page,
  Pagination,
  Select,
  TextField,
  Toast,
} from "@shopify/polaris";
import React, { useCallback, useEffect, useState } from "react";
import GraphicsIndexTable from "./GraphicsIndexTable";

import axios from "axios";
import OrdersIndexTable from "../../components/orders/OrdersIndexTable";

function GalleryListing() {
  const [selectedActiveStatus, setSelectedActiveStatus] = useState(true);
  const [isCategoryModelShow, setIsCategoryModelShow] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState();
  const [isNewCategoryError, setIsNewCategoryError] = useState(false); //if submit form with empty category
  const [isSuccessCategoryAdded, setIsSuccessCategoryAdded] = useState(false);
  const [categoriesList, setCategoriesList] = useState();
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const handleStatusChange = useCallback(
    (value) => {
      setSelectedActiveStatus(value === "true" ? true : false);
    },
    [setSelectedActiveStatus]
  );

  const activeOptions = [
    { label: "Active", value: true },
    { label: "InActive", value: false },
  ];

  const handleSaveCategory = async () => {
    const { data } = await axios.post(
      "https://gangr.uforiaprojects.com/api/local/saveCategory?shop=kamrandevstore.myshopify.com",
      {
        active: selectedActiveStatus,
        title: newCategoryTitle,
        id: null,
      }
    );

    setIsNewCategoryError(false);
    setIsSuccessCategoryAdded(true);
    setIsCategoryModelShow(false);
    setNewCategoryTitle("");
    if (data) {
      getCategoriesList();
    }
  };

  //Modal Change
  const handleChange = useCallback(
    () => setIsCategoryModelShow(!isCategoryModelShow),
    [isCategoryModelShow, setIsCategoryModelShow]
  );

  const getCategoriesList = useCallback(async (pageNum) => {
    setIsLoadingCategories(true);
    const { data } = await axios.post(
      `https://gangr.uforiaprojects.com/api/local/searchCategory?shop=kamrandevstore.myshopify.com&page=${pageNum}`
    );
    setCategoriesList(data.data);
    setIsLoadingCategories(false);
  }, []);

  useEffect(() => {
    getCategoriesList();
  }, [getCategoriesList]);

  return (
    <Box padding={5}>
      <Frame>
        <Page
          title="Graphics"
          subtitle="Upload your Graphics so that your customers can see them."
          primaryAction={{
            content: "Add Graphics",
            url: "/add-graphic",
          }}
          secondaryActions={[
            {
              content: "Add Graphics Category",
              onAction: () => {
                setIsCategoryModelShow(true);
              },
            },
          ]}
          divider={true}
        >
          <GraphicsIndexTable
            categoryList={categoriesList}
            getCategories={getCategoriesList}
            isLoadingCategories={isLoadingCategories}
          />

          {isCategoryModelShow && (
            <Modal
              open={isCategoryModelShow}
              onClose={handleChange}
              title={"Add Category"}
              primaryAction={{
                content: "Add Category",
                onAction: () => {
                  if (newCategoryTitle) {
                    handleSaveCategory();
                  } else {
                    setIsNewCategoryError(true);
                  }
                },
              }}
            >
              <Modal.Section>
                <TextField
                  placeholder="Enter Category Name"
                  value={newCategoryTitle}
                  onChange={(e) => setNewCategoryTitle(e)}
                />
                {isNewCategoryError && (
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
          )}

          {isSuccessCategoryAdded && (
            <Toast
              content="Category Added Successful"
              duration={2000}
              onDismiss={() => setIsSuccessCategoryAdded(false)}
            />
          )}
        </Page>
      </Frame>
    </Box>
  );
}

export default GalleryListing;
