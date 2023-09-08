import {
  Box,
  Button,
  Card,
  FormLayout,
  HorizontalStack,
  Layout,
  Page,
  Select,
  Tag,
  Text,
  TextField,
} from "@shopify/polaris";
import React, { useCallback, useState } from "react";
import Media from "../components/Media";
import { useDispatch, useSelector } from "react-redux";
import { addGraphic } from "../store/GallerySlice";

function AddGraphic() {
  const [files, setFiles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Animals");
  const [selectedStatus, setSelectedStatus] = useState("Active");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const dispatch = useDispatch();

  const handleTagInputChange = useCallback((value) => {
    setTagInput(value);
  }, []);

  const handleAddTag = useCallback(() => {
    if (tagInput.trim() !== "") {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  }, [tags, tagInput]);

  const handleRemoveTag = useCallback(
    (indexToRemove) => {
      const updatedTags = tags.filter((tag, index) => index !== indexToRemove);
      setTags(updatedTags);
    },
    [tags]
  );
  const handleSelectChangeCategory = useCallback(
    (value) => setSelectedCategory(value),
    []
  );

  const handleSelectChangeStatus = useCallback(
    (value) => setSelectedStatus(value),
    []
  );

  function fileToBase64(file, callback) {
    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
      const base64String = event.target.result;
      callback(base64String);
    };

    reader.readAsDataURL(file);
  }

  function filesToBase64Array(files, callback) {
    const base64Array = [];
    let processedCount = 0;

    files.forEach((file, index) => {
      fileToBase64(file, (base64String) => {
        base64Array[index] = base64String;
        processedCount++;

        // Check if all files have been processed
        if (processedCount === files.length) {
          callback(base64Array);
        }
      });
    });
  }

  const saveGraphic = () => {
    filesToBase64Array(files, (base64Images) => {
      dispatch(
        addGraphic({
          category: selectedCategory,
          tags: tags,
          status: selectedStatus,
          image: base64Images,
        })
      );
    });
  };

  const categoryOptions = useSelector((state) => state.gallery.categories);
  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "InActive", value: "inActive" },
  ];

  return (
    <Box>
      <Page
        backAction={{ content: "GalleryListing", url: "/gallery-listing" }}
        title="Add a Graphic"
      >
        <Layout>
          <Layout.AnnotatedSection
            id="selectCategory"
            title="Select a Category"
            description="Choose a category from the dropdown menu where you would like to include a graphic."
          >
            <Card sectioned>
              <FormLayout>
                <Select
                  label="Select a Category"
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
                Media
              </Text>
            </Box>
            <Media files={files} setFiles={setFiles} />
          </Card>
        </Box>

        <Box style={{ marginTop: "35px" }}>
          <Layout>
            <Layout.AnnotatedSection
              id="addTags"
              title="Add Tags"
              description="Assign descriptive tags to the images to facilitate effortless image retrieval for our customers."
            >
              <Card sectioned>
                <FormLayout>
                  <TextField
                    label="Add a Tag"
                    value={tagInput}
                    onChange={handleTagInputChange}
                    placeholder="Enter a tag"
                  />
                  <Button onClick={handleAddTag}>Add Tag</Button>
                  {tags.length > 0 && (
                    <Box>
                      <HorizontalStack>
                        {tags.map((tag, index) => (
                          <Box style={{ marginRight: "10px" }} key={index}>
                            <Tag onRemove={() => handleRemoveTag(index)}>
                              {tag}
                            </Tag>
                          </Box>
                        ))}
                      </HorizontalStack>
                    </Box>
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
              title="Graphics Status"
              description="Indicate whether you intend to Display this graphic to customers
              or not."
            >
              <Card sectioned>
                <FormLayout>
                  <Select
                    label="Status"
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
            <Button primary onClick={saveGraphic}>
              Save
            </Button>
          </Box>
        </HorizontalStack>
      </Page>
    </Box>
  );
}

export default AddGraphic;
