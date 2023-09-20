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
  Modal,
  Page,
  Select,
  Spinner,
  Tag,
  Text,
  TextField,
  Thumbnail,
  Toast,
} from "@shopify/polaris";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useIntl } from "react-intl";

function EditGraphic() {
  const params = useParams();
  const [isSaveError, setIsSaveError] = useState(false);
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [categoriesList, setCategoriesList] = useState();
  const [selectedGallery, setSelectedGallery] = useState();
  const { messages } = useIntl();
  const [selectedCategory, setSelectedCategory] = useState();
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState();
  const [isDeleteError, setIsDeleteError] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [file, setFile] = useState();
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [tagInputError, setTagInputError] = useState();

  const categoryOptions = categoriesList?.data.map((category) => {
    return { value: category?.id.toString(), label: category?.title };
  });

  const getSelecetedGraphicDetail = useCallback(async () => {
    const { data } = await axios.post(
      `https://gangr.uforiaprojects.com/api/local/getGallery/${parseInt(
        params.id
      )}?shop=kamrandevstore.myshopify.com`
    );
    setSelectedGallery(data?.data);

    setSelectedCategory(data?.data.category_id.toString());
    setTags(data?.data?.tags?.split(","));
    setFile(data?.data?.file);
    setSelectedStatus(data?.data?.active === 0 ? "InActive" : "Active");
  }, [params.id]);

  const getCategoriesList = useCallback(async (pageNum) => {
    const { data } = await axios.post(
      `https://gangr.uforiaprojects.com/api/local/searchCategory?shop=kamrandevstore.myshopify.com&page=${pageNum}`
    );
    setCategoriesList(data.data);
  }, []);

  // Validation function for tag input
  const validateTagInput = () => {
    if (tags.length === 0) {
      setTagInputError(true);
    } else {
      setTagInputError(false);
    }
  };

  useEffect(() => {
    getCategoriesList();
    getSelecetedGraphicDetail();
  }, [getCategoriesList, getSelecetedGraphicDetail]);
  const navigate = useNavigate();

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
  const handleSelectChangeCategory = useCallback((value) => {
    setSelectedCategory(value);
  }, []);

  const handleSelectChangeStatus = useCallback(
    (value) => setSelectedStatus(value),
    []
  );

  //Delete Modal Change
  const handleChange = useCallback(
    () => setIsShowDeleteModal(!isShowDeleteModal),
    [isShowDeleteModal, setIsShowDeleteModal]
  );
  const editGraphicData = async () => {
    try {
      validateTagInput();
      if (tagInputError === false) {
        setIsEditLoading(true);
        const formData = new FormData();
        formData.append("files[]", file);
        formData.append("tags", tags.toString());
        formData.append("active", selectedStatus === "Active" ? 1 : 0);
        formData.append("category_id", parseInt(selectedCategory));
        formData.append("id", parseInt(params.id));
        const { data } = await axios.post(
          `https://gangr.uforiaprojects.com/api/local/saveGallery?shop=kamrandevstore.myshopify.com`,
          formData
        );

        setIsEditLoading(false);
        navigate("/gallery-listing");
      }
    } catch (err) {
      console.log(err);
      setIsEditLoading(false);
      setIsSaveError(true);
    }
  };

  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "InActive", value: "InActive" },
  ];

  return categoriesList && selectedGallery ? (
    <Frame>
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
          content="Error while updating data"
          duration={2000}
          onDismiss={() => setIsSaveError(false)}
        />
      )}

      {isDeleteError && (
        <Toast
          content="Error while deleting graphic"
          duration={2000}
          onDismiss={() => setIsDeleteError(false)}
        />
      )}
      {isShowDeleteModal && (
        <Modal
          open={isShowDeleteModal}
          onClose={handleChange}
          title={messages.deleteGraphicTitle}
          primaryAction={{
            content: messages.deleteGraphicTitle,
            loading: isLoadingDelete,
            onAction: async () => {
              try {
                setIsLoadingDelete(true);
                await axios.post(
                  `https://gangr.uforiaprojects.com/api/local/deleteGallery/${params.id}?shop=kamrandevstore.myshopify.com`
                );
                navigate("/gallery-listing");
                setIsLoadingDelete(false);
              } catch (error) {
                setIsDeleteError(true);
                setIsLoadingDelete(false);
              }
            },
          }}
        >
          <Modal.Section>
            <Text>{messages.deleteGraphicDescription}</Text>
          </Modal.Section>
        </Modal>
      )}
      <Box>
        <Page
          backAction={{ content: "GalleryListing", url: "/gallery-listing" }}
          title={messages.editGraphicTitle}
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
              {/* <Media files={files} setFiles={setFiles} isDisabled={true} /> */}
              <Thumbnail source={file} size="large" style={{ width: "100%" }} />
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
            <Box style={{ marginBottom: "10px", marginRight: "10px" }}>
              <Button outline onClick={() => setIsShowDeleteModal(true)}>
                {messages.deleteGraphicBtn}
              </Button>
            </Box>
            <Box style={{ marginBottom: "10px" }}>
              <Button primary onClick={editGraphicData} loading={isEditLoading}>
                {messages.editGraphicBtn}
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

export default EditGraphic;
