import {
  Box,
  Frame,
  InlineError,
  Modal,
  Page,
  Select,
  TextField,
  Toast,
} from "@shopify/polaris";
import React, { useCallback, useEffect, useState } from "react";
import GraphicsIndexTable from "./GraphicsIndexTable";

import axios from "axios";
import { useIntl } from "react-intl";

function GalleryListing() {
  const getCategoriesList = useCallback(async (pageNum) => {
    setIsLoadingCategories(true);
    const { data } = await axios.post(
      `https://gangr.uforiaprojects.com/api/local/searchCategory?shop=kamrandevstore.myshopify.com&page=${pageNum}`
    );
    setCategoriesList(data.data);
    setIsLoadingCategories(false);
  }, []);
  const { messages } = useIntl();

  const [selectedActiveStatus, setSelectedActiveStatus] = useState(true);
  const [isCategoryModelShow, setIsCategoryModelShow] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState();
  const [isNewCategoryError, setIsNewCategoryError] = useState(false); //if submit form with empty category
  const [isSuccessCategoryAdded, setIsSuccessCategoryAdded] = useState(false);
  const [categoriesList, setCategoriesList] = useState();
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingDuringSave, setIsLoadingDuringSave] = useState(false); //while saving categories
  const [isSaveCategoryError, setIsSaveCategoryError] = useState(false);

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
    try {
      setIsLoadingDuringSave(true);
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
      setIsLoadingDuringSave(false);

      if (data) {
        getCategoriesList();
      }
    } catch (error) {
      setIsLoadingDuringSave(false);
      setIsSaveCategoryError(true);
    }
  };

  //Modal Change
  const handleChange = useCallback(
    () => setIsCategoryModelShow(!isCategoryModelShow),
    [isCategoryModelShow, setIsCategoryModelShow]
  );

  useEffect(() => {
    getCategoriesList();
  }, [getCategoriesList]);

  return (
    <Box padding={5}>
      <Frame>
        <Page
          title={messages.graphicListingPageTitle}
          subtitle={messages.graphicListingPageSubtitle}
          primaryAction={{
            content: messages.addGraphicButton,
            url: "/add-graphic",
          }}
          secondaryActions={[
            {
              content: messages.addGraphicCategoryButton,
              onAction: () => {
                setIsCategoryModelShow(true);
              },
            },
          ]}
          divider={true}
        >
          <GraphicsIndexTable
            categoryList={categoriesList}
            setCategoriesList={setCategoriesList}
            getCategories={getCategoriesList}
            isLoadingCategories={isLoadingCategories}
            messages={messages}
          />

          {isCategoryModelShow && (
            <Modal
              open={isCategoryModelShow}
              onClose={handleChange}
              title={messages.addCategoryModalTitle}
              primaryAction={{
                content: messages.addCategoryModalTitle,
                loading: isLoadingDuringSave,
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
                  placeholder={messages.categoryNamePlaceholder}
                  value={newCategoryTitle}
                  onChange={(e) => setNewCategoryTitle(e)}
                />
                {isNewCategoryError && (
                  <InlineError message={messages.categoryNameError} />
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
              content={messages.successCategoryAddedToast}
              duration={2000}
              onDismiss={() => setIsSuccessCategoryAdded(false)}
            />
          )}
          {isSaveCategoryError && (
            <Toast
              content={messages.successCategoryErrorToast}
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
