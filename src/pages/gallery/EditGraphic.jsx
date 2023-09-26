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
  Modal,
  Page,
  Select,
  Spinner,
  Tag,
  Text,
  TextField,
  Thumbnail,
  Toast,
  VerticalStack,
} from "@shopify/polaris";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FormattedMessage } from "react-intl";
import { SearchMinor } from "@shopify/polaris-icons";

function EditGraphic() {
  const params = useParams();
  const navigate = useNavigate();
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [savedData, setSavedData] = useState();

  const [loading, setLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState();
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [file, setFile] = useState();
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [tagInputError, setTagInputError] = useState();
  const [isEditDisabled, setIsEditDisabled] = useState(true);
  const [categoryError, setCategoryError] = useState();

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);

  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "InActive", value: "InActive" },
  ];

  const getOptions = (data) => data?.map((category) => {
    return { value: category?.id.toString(), label: category?.title };
  });

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

  //Autocomplete End

  const getGalleryDetails = useCallback( () => {
    axios.post(
      `https://gangr.uforiaprojects.com/api/local/getGallery/${parseInt(params.id)}?shop=kamrandevstore.myshopify.com`
    ).then(res => {
      if(res.status === 200){
        const { category, tags, file, active } = res.data.data;
        setSavedData(res.data.data);
        setSelectedOptions([category.id.toString()]);
        setInputValue(category.title);
        setTags(tags?.split(","));
        setFile(file);
        setSelectedStatus(active === 0 ? "InActive" : "Active");
        setTagInputError(false);
      }
    })
        .catch(err => console.log(err));
  }, [params.id]);

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
      if (tags.length <= 1) {
        setTagInputError(true);
      }
    },
    [tags]
  );

  const handleSelectChangeStatus = useCallback((value) => {
    setSelectedStatus(value);
  }, []);


  const validateSubmission = () => {
    const isCategory = selectedOptions[0], isTag = tags.length !== 0;
    setCategoryError(!isCategory);
    setTagInputError(!isTag);

    return isCategory && isTag;
  }

  const editGraphicData = async () => {
    const isValidated = validateSubmission();

    if (isValidated) {
      setIsEditLoading(true);
      const formData = new FormData();
      formData.append("files[]", file);
      formData.append("tags", tags.toString());
      formData.append("active", selectedStatus === "Active" ? 1 : 0);
      formData.append("category_id", parseInt(selectedOptions[0]));
      formData.append("id", parseInt(params.id));
      axios.post(
          `https://gangr.uforiaprojects.com/api/local/saveGallery?shop=kamrandevstore.myshopify.com`,
          formData
      )
          .then(res => {
            if(res.status === 200){
              setIsEditLoading(false);
              navigate("/gallery-listing");
            }
          })
          .catch(err => console.log(err));
    }
  };

  const deleteGallery = () => {
    setIsLoadingDelete(true);
    axios.post(
        `https://gangr.uforiaprojects.com/api/local/deleteGallery/${params.id}?shop=kamrandevstore.myshopify.com`
    )
        .then(res => {
          if(res.status === 200){
            setIsLoadingDelete(false);
            navigate("/gallery-listing");
          }
        })
        .catch(err => console.log(err));
  };

  useEffect(() => {
    if(savedData){
      const {tags: tagsList, active, category } = savedData;
      const obj = {
        "Active": 1,
        "InActive": 0,
      };
      if(tags.toString() === tagsList && obj[selectedStatus] === active && selectedOptions[0] === category.id.toString()){
        setIsEditDisabled(true);
      } else setIsEditDisabled(false);
    }
  }, [tags, selectedStatus, selectedOptions, savedData])

  useEffect(() => {
    getGalleryDetails();
  }, []);

  return (
      <>
        <Frame>
        <Page
            backAction={{ content: "GalleryListing", url: "/gallery-listing" }}
            title={<FormattedMessage id="editGraphicTitle" />}
        >
          {file ? (
              <>
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
                        {<FormattedMessage id="mediaLabel" />}
                      </Text>
                    </Box>
                    <Thumbnail source={file} size="large" style={{ width: "100%" }} />
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
                                  {<FormattedMessage id="addTagBtn" />}
                                </Button>
                              </Box>
                            </HorizontalStack>
                          </VerticalStack>

                          {tags?.length > 0 && (
                              <Box>
                                <HorizontalStack>
                                  {tags?.map((tag, index) => (
                                      <Box style={{ marginRight: "10px" }} key={index}>
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
                  <Box style={{ marginBottom: "10px", marginRight: "10px" }}>
                    <Button
                        outline
                        onClick={() => {
                          setIsShowDeleteModal(true);
                        }}
                    >
                      {<FormattedMessage id="deleteGraphicBtn" />}
                    </Button>
                  </Box>
                  <Box style={{ marginBottom: "10px" }}>
                    <Button
                        primary
                        onClick={editGraphicData}
                        loading={isEditLoading}
                        disabled={isEditDisabled}
                    >
                      <FormattedMessage id="saveBtn" />
                    </Button>
                  </Box>
                </HorizontalStack>
              </>
          ) : (
              <Box padding={10}>
                <HorizontalStack align="center">
                  <Spinner />
                </HorizontalStack>
              </Box>
          )}
        </Page>
          {isShowDeleteModal && (
              <Modal
                  open={isShowDeleteModal}
                  onClose={() => setIsShowDeleteModal(false)}
                  title={<FormattedMessage id="deleteGraphicTitle" />}
                  primaryAction={{
                    content: <FormattedMessage id="yes" />,
                    loading: isLoadingDelete,
                    onAction: deleteGallery,
                  }}
                  secondaryActions={{
                    content: <FormattedMessage id="no" />,
                    onAction: () => setIsShowDeleteModal(false),
                  }}
              >
                <Modal.Section>
                  <Text>{<FormattedMessage id="deleteGraphicDescription" />}</Text>
                </Modal.Section>
              </Modal>
          )}
          <Box>
          </Box>
        </Frame>
      </>
  )
}

export default EditGraphic;
