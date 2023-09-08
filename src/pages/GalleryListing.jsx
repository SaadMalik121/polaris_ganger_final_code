import {
  Box,
  Frame,
  InlineError,
  Page,
  Pagination,
  TextField,
  Toast,
} from "@shopify/polaris";
import React, { useState } from "react";
import GraphicsIndexTable from "../components/GraphicsIndexTable";
import AppModal from "../components/AppModal";
import { useDispatch } from "react-redux";
import { addCategory } from "../store/GallerySlice";

function GalleryListing() {
  const [isCategoryModelShow, setIsCategoryModelShow] = useState(false);
  const [newCategory, setNewCategory] = useState();
  const [isNewCategoryError, setIsNewCategoryError] = useState(false); //if submit form with empty category
  const [isSuccessCategoryAdded, setIsSuccessCategoryAdded] = useState(false);
  const dispatch = useDispatch();
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
          <GraphicsIndexTable />

          {/* Pagination */}
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "30px",
            }}
          >
            <Pagination
              hasPrevious
              onPrevious={() => {
                console.log("Previous");
              }}
              hasNext
              onNext={() => {
                console.log("Next");
              }}
            />
          </Box>

          {isCategoryModelShow && (
            <AppModal
              isShowModal={isCategoryModelShow}
              setIsShowModal={setIsCategoryModelShow}
              title={"Add Category"}
              ButtonText={"Add Category"}
              isSecondaryButtonShow={false}
              action={() => {
                if (newCategory) {
                  dispatch(addCategory(newCategory));
                  setIsNewCategoryError(false);
                  setIsSuccessCategoryAdded(true);
                  setIsCategoryModelShow(false);
                  setNewCategory("");
                } else {
                  setIsNewCategoryError(true);
                }
              }}
            >
              <TextField
                placeholder="Enter Category Name"
                value={newCategory}
                onChange={(e) => setNewCategory(e)}
              />
              {isNewCategoryError && (
                <InlineError message={"Category field can not be empty"} />
              )}
            </AppModal>
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
