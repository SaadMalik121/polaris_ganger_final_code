import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ordersApi from "../../api/orders";
import {
  Badge,
  Box,
  Button,
  Card,
  HorizontalStack,
  Layout,
  Page,
  Pagination,
  Spinner,
  Text,
  Thumbnail,
  VerticalStack,
} from "@shopify/polaris";

function OrderDetails() {
  const { id } = useParams();
  const [selectedArtwork, setSelectedArtwork] = useState();
  const [isLoadingOrderDetail, setIsLoadingOrderDetail] = useState();
  const [orderDetail, setOrderDetail] = useState();
  const [orderHistory, setOrderHistory] = useState();
  const getOrderDetail = useCallback(async () => {
    setIsLoadingOrderDetail(true);
    const data = await ordersApi.getOrderDetails(id);
    const { orderHistory } = await ordersApi.getOrderHistory(parseInt(id));
    setOrderDetail(data?.order);
    setOrderHistory(orderHistory);
    setIsLoadingOrderDetail(false);
  }, [id]);
  useEffect(() => {
    getOrderDetail();
  }, [getOrderDetail]);
  return (
    <div>
      {!isLoadingOrderDetail ? (
        <Box style={{ paddingTop: "30px" }}>
          <Page
            backAction={{ content: "Products", url: "/order-listing" }}
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
                {orderDetail?.line_items?.map((item, index) => (
                  <Box
                    key={index}
                    style={{ marginBottom: "15px" }}
                    onClick={() => {
                      setSelectedArtwork(item);
                    }}
                    background={
                      selectedArtwork?.id === item?.id ? "red" : "blue"
                    }
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
                          <HorizontalStack align="center" gap={2}>
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
                              <Text color="subdued">
                                SKU: &nbsp; {item.sku}
                              </Text>
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

              <Layout.Section>
                <Box>
                  <Card>
                    <VerticalStack gap={"4"}>
                      <Text fontWeight="bold" variant="bodyMd">
                        Artwork Details
                      </Text>
                      {selectedArtwork ? (
                        <>
                          <VerticalStack>
                            <HorizontalStack>
                              {/* <Icon source={AlertMinor} color="highlight" /> */}
                              <Text>
                                (ICONS) {selectedArtwork.name}{" "}
                                <Badge status="critical" size="small">
                                  {selectedArtwork.status}
                                </Badge>
                              </Text>
                            </HorizontalStack>
                            <Text color="subdued">
                              Quantity: {selectedArtwork.quantity}
                            </Text>
                          </VerticalStack>

                          <HorizontalStack align="end">
                            <VerticalStack align="center">
                              <Box padding={2}>
                                <Link
                                  style={{
                                    color: "#5E8CCC",
                                    fontSize: "14px",
                                  }}
                                >
                                  View Sheet
                                </Link>
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

            <Box style={{ marginTop: "50px" }}>
              <Text fontWeight="semibold">Orders Artwork History</Text>
              {orderHistory?.data?.map((order) => (
                <Box style={{ marginTop: "10px" }} key={order.id}>
                  <Card
                    background={order?.from === "shop" ? "bg" : "bg-caution"}
                  >
                    <HorizontalStack align="space-between">
                      <Text>{order.message}</Text>
                      <Text>{order.date_and_time}</Text>
                    </HorizontalStack>
                  </Card>
                </Box>
              ))}

              <HorizontalStack align="center">
                <Box style={{ margin: "20px 0px" }}>
                  <Pagination
                    hasPrevious={orderHistory?.current_page > 1}
                    onPrevious={() => {
                      console.log("Previous");
                    }}
                    hasNext={
                      orderHistory?.current_page < orderHistory?.lasst_page
                    }
                    onNext={() => {
                      console.log("Next");
                    }}
                  />
                </Box>
              </HorizontalStack>
            </Box>
          </Page>
        </Box>
      ) : (
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "90vh",
          }}
        >
          <Spinner />
        </Box>
      )}
    </div>
  );
}

export default OrderDetails;
