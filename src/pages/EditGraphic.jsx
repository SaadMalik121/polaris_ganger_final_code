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
import React, { useCallback, useEffect, useState } from "react";
import Media from "../components/Media";
import { useDispatch, useSelector } from "react-redux";
import { editGraphic } from "../store/GallerySlice";
import { useNavigate, useParams } from "react-router-dom";

function EditGraphic() {
  const navigate = useNavigate();

  const [tagInput, setTagInput] = useState("");
  const dispatch = useDispatch();
  const params = useParams();
  const galleryList = useSelector((state) => state.gallery.gallery);

  // Data of Gallery which is selected for edit
  const selectedGalleryData = galleryList.find(
    (gallery) => gallery.id === parseInt(params.id)
  );

  const [selectedGallery, setSelectedGallery] = useState(selectedGalleryData);

  const [files, setFiles] = useState([]);
  const [myImages] = useState([selectedGallery.image]);

  useEffect(() => {
    function dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[arr.length - 1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    }

    const convertedFiles = myImages.map((image, index) => {
      const blob = dataURLtoFile(image, "image/png");
      const fileName = `image_${index}.png`; // Provide a unique file name
      return new File([blob], fileName, { type: "image/png" });
    });

    setFiles(convertedFiles);
  }, [selectedGallery, myImages]);

  const handleTagInputChange = useCallback((value) => {
    setTagInput(value);
  }, []);

  const handleAddTag = useCallback(() => {
    if (tagInput.trim() !== "") {
      setSelectedGallery({
        ...selectedGallery,
        tags: [...selectedGallery.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  }, [tagInput, selectedGallery]);

  const handleRemoveTag = useCallback(
    (indexToRemove) => {
      const updatedTags = selectedGallery.tags.filter(
        (tag, index) => index !== indexToRemove
      );
      setSelectedGallery({ ...selectedGallery, tags: updatedTags });
    },
    [selectedGallery]
  );
  const handleSelectChangeCategory = useCallback(
    (value) => setSelectedGallery({ ...selectedGallery, category: value }),
    []
  );

  const handleSelectChangeStatus = useCallback(
    (value) => setSelectedGallery({ ...selectedGallery, status: value }),
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
  const editGraphicData = () => {
    const base64Images = []; // Initialize an empty array to store base64 strings

    // Loop through each file in the files array
    for (const file of files) {
      fileToBase64(file, (base64Image) => {
        base64Images.push(base64Image);

        if (base64Images.length === files.length) {
          dispatch(
            editGraphic({
              category: selectedGallery.category,
              tags: selectedGallery.tags,
              status: selectedGallery.status,
              image: base64Images, // Use the array of base64 images here
              id: selectedGallery.id,
            })
          );

          // Navigate after all files have been processed
          navigate("/gallery-listing");
        }
      });
    }
  };

  const categoryOptions = useSelector((state) => state.gallery.categories);
  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "InActive", value: "InActive" },
  ];

  return (
    <Box>
      <Page
        backAction={{ content: "GalleryListing", url: "/gallery-listing" }}
        title="Edit a Graphic"
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
                  value={selectedGallery.category}
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
            <Media files={files} setFiles={setFiles} isDisabled={true} />
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
                  {selectedGallery.tags.length > 0 && (
                    <Box>
                      <HorizontalStack>
                        {selectedGallery.tags.map((tag, index) => (
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
                    value={selectedGallery.status}
                  />
                </FormLayout>
              </Card>
            </Layout.AnnotatedSection>
          </Layout>
        </Box>

        <HorizontalStack align="end">
          <Box style={{ marginBottom: "10px" }}>
            <Button primary onClick={editGraphicData}>
              Edit Graphic
            </Button>
          </Box>
        </HorizontalStack>
      </Page>
    </Box>
  );
}

export default EditGraphic;
