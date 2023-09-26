import {
  Autocomplete,
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
  VerticalStack,
} from "@shopify/polaris";
import React, { useCallback, useEffect, useState } from "react";
import { SearchMinor } from "@shopify/polaris-icons";

import Media from "./Media";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FormattedMessage } from "react-intl";

function AddGraphic() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);

  const [loading, setLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Active");
  const [categoryError, setCategoryError] = useState();
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  // State variables for error messages
  const [tagInputError, setTagInputError] = useState();
  const [filesError, setFilesError] = useState();

  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "InActive", value: "InActive" },
  ];

  const getOptions = (data) => data?.map((category) => {
      return { value: category?.id.toString(), label: category?.title };
    });

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);

  const fetchCategoryList = useCallback( (value) => {
     axios.post(
        `https://gangr.uforiaprojects.com/api/local/searchCategory?shop=kamrandevstore.myshopify.com`, {
          keyword: value
         }
    )
         .then(res => {
           if(res.status === 200){
             setLoading(false)
             const { data } = res.data?.details;
             setOptions(getOptions(data));
           }
         })
         .catch(err => console.log(err));
  }, []);

  const updateText = useCallback(
    (value) => {
      setInputValue(value);
      if(value.length < 2) return;
      if (!loading) setLoading(true)

      fetchCategoryList(value);
    },
    []
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

  const validateSubmission = () => {
    const isCategory = selectedOptions[0], isFile = files?.length !== 0, isTag = tags.length !== 0;
    setCategoryError(!isCategory);
    setFilesError(!isFile);
    setTagInputError(!isTag);

    return isCategory && isFile && isTag;
  }

  const saveGraphic = () => {
    const isValidated = validateSubmission();

    if (isValidated) {
      setIsSaveLoading(true);
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files[]", files[i]);
      }
      formData.append("tags", tags.toString());
      formData.append("active", selectedStatus === "Active");
      formData.append("category_id", parseInt(selectedOptions[0]));
      axios.post(
          `https://gangr.uforiaprojects.com/api/local/saveGallery?shop=kamrandevstore.myshopify.com`,
          formData
      )
          .then(res => {
            if(res.status === 200){
              setIsSaveLoading(false);
              navigate("/gallery-listing");
            }
          })
          .catch(err => console.log(err));
    }
  };


  useEffect(() => {
    if (files.length > 0) {
      setFilesError(false);
    }
  }, [files]);

  return (
      <>
        <Frame>
          <Box padding={"10"}>
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
                          loading={loading}
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
                      <FormattedMessage id="mediaLabel" />
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
                        <VerticalStack align="center">
                          <HorizontalStack align="space-between">
                            <div
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleAddTag();
                                  }
                                }}
                                style={{ width: "80%" }}
                            >
                              <TextField
                                  label={<FormattedMessage id="addTagsLabel" />}
                                  value={tagInput}
                                  onChange={handleTagInputChange}
                                  placeholder={"Add a tag"}
                              />
                            </div>
                            <Box style={{ marginTop: "23px" }}>
                              <Button onClick={handleAddTag}>
                                <FormattedMessage id="addTagBtn" />
                              </Button>
                            </Box>
                          </HorizontalStack>
                        </VerticalStack>

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
                    <FormattedMessage id="saveBtn" />
                  </Button>
                </Box>
              </HorizontalStack>
            </Page>
          </Box>
        </Frame>
      </>
  );
}

export default AddGraphic;
