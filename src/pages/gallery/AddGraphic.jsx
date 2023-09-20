import {
  Banner,
  Box,
  Button,
  Card,
  FormLayout,
  Frame,
  HorizontalStack,
  InlineError,
  Layout,
  Page,
  Select,
  Spinner,
  Tag,
  Text,
  TextField,
  Toast,
} from "@shopify/polaris";
import React, { useCallback, useEffect, useState } from "react";
import Media from "./Media";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useIntl } from "react-intl";

function AddGraphic() {
  const { messages } = useIntl();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [categoriesList, setCategoriesList] = useState();

  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isSaveError, setIsSaveError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedStatus, setSelectedStatus] = useState("Active");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const handleTagInputChange = useCallback((value) => {
    setTagInput(value);
  }, []);

  const getCategoriesList = useCallback(async (pageNum) => {
    const { data } = await axios.post(
      `https://gangr.uforiaprojects.com/api/local/searchCategory?shop=kamrandevstore.myshopify.com&page=${pageNum}`
    );
    setCategoriesList(data.data);
  }, []);

  // State variables for error messages
  const [categoryError, setCategoryError] = useState();
  const [tagInputError, setTagInputError] = useState();
  const [filesError, setFilesError] = useState();

  // Validation function for category selection
  const validateCategory = (value) => {
    if (!value) {
      setCategoryError(true);
    } else {
      setCategoryError(false);
    }
  };

  // Validation function for tag input
  const validateTagInput = () => {
    if (tags.length === 0) {
      setTagInputError(true);
    } else {
      setTagInputError(false);
    }
  };

  // Validation function for files selection
  const validateFiles = () => {
    if (files?.length === 0) {
      setFilesError(true);
    } else {
      setFilesError(false);
    }
  };

  useEffect(() => {
    getCategoriesList();
  }, [getCategoriesList]);

  // After fetching categoriesList, set the initial selectedCategory
  useEffect(() => {
    if (categoriesList && categoriesList.data.length > 0) {
      setSelectedCategory(categoriesList.data[0].id.toString());
    }
  }, [categoriesList]);

  useEffect(() => {
    if (files.length > 0) {
      setFilesError(false);
    }
  }, [files]);

  const handleAddTag = useCallback(() => {
    if (tagInput.trim() !== "") {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
      setTagInputError(false);
    }
  }, [tags, tagInput]);

  const handleRemoveTag = useCallback(
    (indexToRemove) => {
      const updatedTags = tags.filter((tag, index) => index !== indexToRemove);
      setTags(updatedTags);
    },
    [tags]
  );
  const handleSelectChangeCategory = useCallback((value) => {
    setSelectedCategory(value);
    validateCategory(value);
  }, []);

  const handleSelectChangeStatus = useCallback(
    (value) => setSelectedStatus(value),
    []
  );

  const saveGraphic = async () => {
    try {
      validateFiles();
      validateTagInput();
      if (filesError === false && tagInputError === false) {
        setIsSaveLoading(true);
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formData.append("files[]", files[i]);
        }
        formData.append("tags", tags.toString());
        formData.append("active", selectedStatus === "Active" ? true : false);
        formData.append("category_id", parseInt(selectedCategory));
        const { data } = await axios.post(
          `https://gangr.uforiaprojects.com/api/local/saveGallery?shop=kamrandevstore.myshopify.com`,
          formData
        );
        setIsSaveLoading(false);
        navigate("/gallery-listing");
      }
    } catch (err) {
      console.log(err);
      setIsSaveLoading(false);
      setIsSaveError(true);
    }
  };

  const categoryOptions = categoriesList?.data.map((category) => {
    return { value: category?.id.toString(), label: category?.title };
  });

  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "InActive", value: "InActive" },
  ];

  return categoriesList ? (
    <Frame>
      <Box padding={"10"}>
        {isSaveError && (
          <Banner
            title="Erorr while saving graphic"
            status="critical"
            onDismiss={() => {
              setIsSaveError(false);
            }}
          >
            <p>Unexpected error occour. Kindly try again</p>
          </Banner>
        )}
        {isSaveError && (
          <Toast
            content="Error while saving graphic"
            onDismiss={() => setIsSaveError(false)}
          />
        )}

        <Page
          backAction={{ content: "GalleryListing", url: "/gallery-listing" }}
          title={messages.addGraphicsTitle}
        >
          <Layout>
            <Layout.AnnotatedSection
              id="selectCategory"
              title={messages.selectCategoryLabel}
              description={messages.selectCategoryDescription}
            >
              <Card sectioned>
                <FormLayout>
                  <Select
                    label={messages.selectCategoryLabel}
                    options={categoryOptions}
                    onChange={handleSelectChangeCategory}
                    value={selectedCategory}
                  />
                  {categoryError && (
                    <InlineError
                      message="At least one media must be added"
                      fieldID="myFieldID"
                    />
                  )}
                </FormLayout>
              </Card>
            </Layout.AnnotatedSection>
          </Layout>

          <Box style={{ marginTop: "10px" }}>
            <Card>
              <Box style={{ marginBottom: "15px" }}>
                <Text as="h4" fontWeight="bold">
                  {messages.mediaLabel}
                </Text>
              </Box>
              <Media files={files} setFiles={setFiles} />
              {filesError && (
                <InlineError
                  message="At least one media must be added"
                  fieldID="myFieldID"
                />
              )}
            </Card>
          </Box>

          <Box style={{ marginTop: "35px" }}>
            <Layout>
              <Layout.AnnotatedSection
                id="addTags"
                title={messages.addTagsLabel}
                description={messages.addTagsDescription}
              >
                <Card sectioned>
                  <FormLayout>
                    <div
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddTag();
                        }
                      }}
                    >
                      <TextField
                        label={messages.addTagsLabel}
                        value={tagInput}
                        onChange={handleTagInputChange}
                        placeholder={messages.addTagPlaceholder}
                      />
                    </div>
                    <Button onClick={handleAddTag}>{messages.addTagBtn}</Button>
                    {tags.length > 0 && (
                      <Box>
                        <HorizontalStack>
                          {tags.map((tag, index) => (
                            <Box
                              style={{ marginRight: "10px", marginTop: "10px" }}
                              key={index}
                            >
                              <Tag onRemove={() => handleRemoveTag(index)}>
                                {tag}
                              </Tag>
                            </Box>
                          ))}
                        </HorizontalStack>
                      </Box>
                    )}
                    {tagInputError && (
                      <InlineError message="At least one tag must be provided" />
                    )}
                  </FormLayout>
                </Card>
              </Layout.AnnotatedSection>
            </Layout>
          </Box>

          <Box style={{ marginTop: "35px" }}>
            <Layout>
              <Layout.AnnotatedSection
                id="graphicsStatus"
                title={messages.graphicsStatusLabel}
                description={messages.graphicsStatusDescription}
              >
                <Card sectioned>
                  <FormLayout>
                    <Select
                      label={messages.statusSelectLabel}
                      options={statusOptions}
                      onChange={handleSelectChangeStatus}
                      value={selectedStatus}
                    />
                  </FormLayout>
                </Card>
              </Layout.AnnotatedSection>
            </Layout>
          </Box>

          <HorizontalStack align="end">
            <Box style={{ marginBottom: "10px" }}>
              <Button primary onClick={saveGraphic} loading={isSaveLoading}>
                {messages.saveBtn}
              </Button>
            </Box>
          </HorizontalStack>
        </Page>
      </Box>
    </Frame>
  ) : (
    <Box padding={10}>
      <HorizontalStack align="center">
        <Spinner />
      </HorizontalStack>
    </Box>
  );
}

export default AddGraphic;
