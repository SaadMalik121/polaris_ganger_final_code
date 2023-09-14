import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ordersApi from "../../api/orders";
import {
  Badge,
  Box,
  Button,
  Card,
  HorizontalStack,
  Icon,
  Layout,
  Page,
  Text,
  Thumbnail,
  VerticalStack,
} from "@shopify/polaris";
import { AlertMinor } from "@shopify/polaris-icons";

function OrderDetails() {
  const { id } = useParams();
  const [selectedArtwork, setSelectedArtwork] = useState();
  const [orderDetail, setOrderDetail] = useState();
  const getOrderDetail = useCallback(async () => {
    const data = await ordersApi.getOrderDetails(id);
    setOrderDetail(data?.order);
  }, [id]);
  useEffect(() => {
    getOrderDetail();
  }, [getOrderDetail]);
  return (
    <div>
      {/* {JSON.stringify(orderDetail)} */}
      <Page
        backAction={{ content: "Products", url: "#" }}
        title={"#" + orderDetail?.id}
        titleMetadata={
          <HorizontalStack gap={2}>
            <Badge status="success" progress="complete">
              {orderDetail?.order_type}
            </Badge>
            <Badge status="enabled-experimental" progress="complete">
              {orderDetail?.order_status}
            </Badge>
          </HorizontalStack>
        }
        subtitle={orderDetail?.created_at}
        compactTitle
        primaryAction={{ content: "Download All Scheets" }}
        actionGroups={[
          {
            title: "Update Status",
            actions: [
              {
                content: "Share on Facebook",
                accessibilityLabel: "Individual action label",
                onAction: () => alert("Share on Facebook action"),
              },
            ],
          },
        ]}
      >
        <Layout>
          <Layout.Section oneHalf>
            {orderDetail?.line_items?.map((item) => (
              <Box
                key={item.id}
                style={{ marginBottom: "15px" }}
                onClick={() => {
                  setSelectedArtwork(item);
                }}
                background={selectedArtwork?.id === item?.id ? "red" : "blue"}
              >
                <Card
                  background={
                    selectedArtwork?.id === item?.id
                      ? "bg-active"
                      : "bg-subdued"
                  }
                >
                  <HorizontalStack align="space-between">
                    <VerticalStack align="space-around" gap={4}>
                      <Text fontWeight="bold" variant="bodyMd">
                        Products
                      </Text>
                      <HorizontalStack align="center" gap={4}>
                        <Box>
                          <Thumbnail
                            source={item.file}
                            alt="image"
                            size="small"
                          />
                        </Box>
                        <VerticalStack align="center">
                          <Link
                            style={{
                              textDecoration: "none",
                              color: "#5E8CCC",
                              fontWeight: "500",
                            }}
                          >
                            {item.name}
                          </Link>
                          <Text color="subdued">SKU: &nbsp; {item.sku}</Text>
                        </VerticalStack>
                      </HorizontalStack>
                    </VerticalStack>

                    <Box>
                      <Box style={{ marginBottom: "20px" }}>
                        <Text fontWeight="bold" variant="bodyMd">
                          Quanity
                        </Text>
                      </Box>
                      <Text fontWeight="semibold">
                        ${item.price} x {item.quantity}
                      </Text>
                    </Box>

                    <Box>
                      <Box style={{ marginBottom: "20px" }}>
                        <Text fontWeight="bold" variant="bodyMd">
                          Total
                        </Text>
                      </Box>
                      <Text>{item.total}</Text>
                    </Box>
                  </HorizontalStack>
                </Card>
              </Box>
            ))}
          </Layout.Section>
          <Layout.Section oneThird>
            <Box>
              <Card>
                <VerticalStack gap={"4"}>
                  <Text fontWeight="bold" variant="bodyMd">
                    Artwork Details
                  </Text>
                  {selectedArtwork ? (
                    <>
                      <HorizontalStack>
                        {/* <Icon source={AlertMinor} color="highlight" /> */}
                        <HorizontalStack align="space-evenly">
                          <Text>
                            (ICON) &nbsp; ksjdkjsdkjsdkjsdkj{" "}
                            <Badge status="critical" size="small">
                              {selectedArtwork.status}
                            </Badge>
                          </Text>
                        </HorizontalStack>
                      </HorizontalStack>
                      <Text color="subdued">
                        Quantity: {selectedArtwork.quantity}
                      </Text>

                      <HorizontalStack align="end">
                        <VerticalStack align="center">
                          <Box padding={2}>
                            <Link>View Sheet</Link>
                          </Box>
                        </VerticalStack>
                        <Button primary>Generate Sheet</Button>
                      </HorizontalStack>
                    </>
                  ) : (
                    "No Artwork Selected"
                  )}
                </VerticalStack>
              </Card>
            </Box>

            <Box style={{ marginTop: "10px" }}>
              <Card>
                <Text fontWeight="bold" variant="bodyMd">
                  Notes
                </Text>
                <Box style={{ marginTop: "20px" }}>
                  <Text>
                    {orderDetail?.notes
                      ? orderDetail?.notes
                      : "No Notes From Customer"}
                  </Text>
                </Box>
              </Card>
            </Box>
          </Layout.Section>
        </Layout>

        <Box>
          <Text>Orders Artwork History</Text>
        </Box>
      </Page>
    </div>
  );
}

export default OrderDetails;
