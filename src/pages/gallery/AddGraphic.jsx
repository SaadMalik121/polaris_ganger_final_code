import {
  Autocomplete,
  Banner,
  Box,
  Button,
  Card,
  FormLayout,
  Frame,
  HorizontalStack,
  Icon,
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
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SearchMinor } from "@shopify/polaris-icons";

import Media from "./Media";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FormattedMessage, useIntl } from "react-intl";

function AddGraphic() {
  const { messages } = useIntl();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [categoriesList, setCategoriesList] = useState();

  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isSaveError, setIsSaveError] = useState(false);
  // const [selectedCategory, setSelectedCategory] = useState();
  const [selectedStatus, setSelectedStatus] = useState("Active");
  const [categoryError, setCategoryError] = useState();
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [categoryOptionsList, setCategoryOptionsList] = useState();
  const categoryOptions = categoryOptionsList?.map((category) => {
    return { value: category?.id.toString(), label: category?.title };
  });

  //Auto complete category
  const deselectedOptions = useMemo(
    () => (categoryOptions ? categoryOptions : []),
    [categoryOptions]
  );
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState(deselectedOptions);

  const updateText = useCallback(
    (value) => {
      setInputValue(value);

      if (value === "") {
        setOptions(deselectedOptions);
        return;
      }

      const filterRegex = new RegExp(value, "i");
      const resultOptions = deselectedOptions.filter((option) =>
        option.label.match(filterRegex)
      );
      setOptions(resultOptions);
    },
    [deselectedOptions]
  );

  const updateSelection = useCallback(
    (selected) => {
      const selectedValue = selected.map((selectedItem) => {
        const matchedOption = options.find((option) => {
          return option.value.match(selectedItem);
        });
        return matchedOption && matchedOption.label;
      });

      setSelectedOptions(selected);
      setInputValue(selectedValue[0] || "");
      setCategoryError(false);
    },
    [options]
  );

  const textField = (
    <Autocomplete.TextField
      onChange={updateText}
      label="Select a category"
      value={inputValue}
      prefix={<Icon source={SearchMinor} color="base" />}
      placeholder="Search"
      autoComplete="off"
    />
  );

  const handleTagInputChange = useCallback((value) => {
    setTagInput(value);
  }, []);

  const getCategoriesListWithoutPagination = useCallback(async (value) => {
    const { data } = await axios.post(
      `https://gangr.uforiaprojects.com/api/local/searchCategoryWithoutPagination?shop=kamrandevstore.myshopify.com`
    );
    setCategoryOptionsList(data?.data);
  }, []);

  const getCategoriesList = useCallback(async (pageNum) => {
    const { data } = await axios.post(
      `https://gangr.uforiaprojects.com/api/local/searchCategory?shop=kamrandevstore.myshopify.com&page=${pageNum}`
    );
    setCategoriesList(data?.data);
  }, []);

  // State variables for error messages
  const [tagInputError, setTagInputError] = useState();
  const [filesError, setFilesError] = useState();

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

  const validateCategory = () => {
    if (selectedOptions[0]) {
      setCategoryError(false);
    } else {
      setCategoryError(true);
    }
  };
  useEffect(() => {
    getCategoriesList();
  }, [getCategoriesList]);

  useEffect(() => {
    getCategoriesListWithoutPagination();
  }, [getCategoriesListWithoutPagination]);

  // After fetching categoriesList, set the initial selectedCategory
  // useEffect(() => {
  //   if (categoriesList && categoriesList.data.length > 0) {
  //     setSelectedCategory(categoriesList.data[0].id.toString());
  //   }
  // }, [categoriesList]);

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

  const handleSelectChangeStatus = useCallback(
    (value) => setSelectedStatus(value),
    []
  );

  const saveGraphic = async () => {
    try {
      validateFiles();
      validateTagInput();
      validateCategory();
      if (
        filesError === false &&
        tagInputError === false &&
        categoryError === false
      ) {
        setIsSaveLoading(true);
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formData.append("files[]", files[i]);
        }
        formData.append("tags", tags.toString());
        formData.append("active", selectedStatus === "Active" ? true : false);
        // formData.append("category_id", parseInt(selectedCategory));
        formData.append("category_id", parseInt(selectedOptions[0]));
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

  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "InActive", value: "InActive" },
  ];

  return categoriesList ? (
    <Frame>
      <Box padding={"10"}>
        {isSaveError && (
          <Banner
            title="Erorr while saving gallery"
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
            content="Error while saving gallery"
            onDismiss={() => setIsSaveError(false)}
          />
        )}

        <Page
          backAction={{ content: "GalleryListing", url: "/gallery-listing" }}
          title={<FormattedMessage id="addGraphicsTitle" />}
        >
          <Layout>
            <Layout.AnnotatedSection
              id="selectCategory"
              title={<FormattedMessage id="selectCategoryLabel" />}
              description={<FormattedMessage id="selectCategoryDescription" />}
            >
              <Card sectioned>
                <FormLayout>
                  <Autocomplete
                    options={options}
                    selected={selectedOptions}
                    onSelect={updateSelection}
                    textField={textField}
                  />

                  {categoryError && (
                    <InlineError
                      message={<FormattedMessage id="categoryError" />}
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
                  {<FormattedMessage id="mediaLabel" />}
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
                title={<FormattedMessage id="addTagsLabel" />}
                description={<FormattedMessage id="addTagsDescription" />}
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
                        label={<FormattedMessage id="addTagsLabel" />}
                        value={tagInput}
                        onChange={handleTagInputChange}
                        placeholder={"Add a tag"}
                      />
                    </div>
                    <Button onClick={handleAddTag}>
                      {<FormattedMessage id="addTagBtn" />}
                    </Button>
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
                title={<FormattedMessage id="graphicsStatusLabel" />}
                description={
                  <FormattedMessage id="graphicsStatusDescription" />
                }
              >
                <Card sectioned>
                  <FormLayout>
                    <Select
                      label={<FormattedMessage id="statusSelectLabel" />}
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
                {<FormattedMessage id="saveBtn" />}
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
