import {
  Box,
  Frame,
  Page,
  Toast,
} from "@shopify/polaris";
import React, { useState } from "react";
import GraphicsIndexTable from "./GraphicsIndexTable";

import { FormattedMessage, useIntl } from "react-intl";
import CategoryModal from "./CategoryModal";

function GalleryListing() {
  const intl = useIntl();
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isSuccessCategoryAdded, setIsSuccessCategoryAdded] = useState(false);
  const [refetch, setRefetch] = useState(false);

  return (
    <>
      {showCategoryModal && <CategoryModal
          show={showCategoryModal}
          onHide={() => setShowCategoryModal(false)}
          onSuccess={() => {
            setRefetch(!refetch);
            setIsSuccessCategoryAdded(true)
          }}
      /> }

      <Box padding={5}>
        <Frame>
          <Page
              title={intl.formatMessage({id: "graphicListingPageTitle"})}
              subtitle={intl.formatMessage({id: "graphicListingPageSubtitle"})}
              primaryAction={{
                content: <FormattedMessage id="addGraphicButton" />,
                url: "/add-graphic",
              }}
              secondaryActions={[
                {
                  content: <FormattedMessage id="addGraphicCategoryButton" />,
                  onAction: () => {
                    setShowCategoryModal(true);
                  },
                },
              ]}
              divider={true}
          >
            <GraphicsIndexTable
                refetch={refetch}
            />

            {isSuccessCategoryAdded && (
                <Toast
                    content={<FormattedMessage id="successCategoryAddedToast" />}
                    duration={2000}
                    onDismiss={() => setIsSuccessCategoryAdded(false)}
                />
            )}
          </Page>
        </Frame>
      </Box>
    </>
  );
}

export default GalleryListing;
