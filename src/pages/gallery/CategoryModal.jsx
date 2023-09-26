import {FormattedMessage} from "react-intl";
import React from "react";
import {Box, InlineError, Modal, Select, Text, TextField} from "@shopify/polaris";
import axios from "axios";
import { useState, useCallback } from "react";

const activeOptions = [
    { label: "Active", value: true },
    { label: "InActive", value: false },
];

export default function CategoryModal({ show, onHide, editCategoryData, onSuccess, onDelete }){
    const [loadingAddBtn, setIsLoadingAddBtn] = useState(false);
    const [newCategoryTitle, setNewCategoryTitle] = useState(editCategoryData?.title || "");
    const [isNewCategoryError, setIsNewCategoryError] = useState(false);
    const [selectedActiveStatus, setSelectedActiveStatus] = useState(editCategoryData?.active === 1);
    const [showCategoryModal, setShowCategoryModal] = useState(true);
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);

    const handleStatusChange = useCallback(
        (value) => {
            setSelectedActiveStatus(value === "true");
        },
        [setSelectedActiveStatus]
    );

    const handleSaveCategory = async () => {
        if (!newCategoryTitle || newCategoryTitle.length === 0) {
            setIsNewCategoryError(true);
            return;
        } else setIsNewCategoryError(false);
        setIsLoadingAddBtn(true);

        await axios.post(
            "https://gangr.uforiaprojects.com/api/local/saveCategory?shop=kamrandevstore.myshopify.com",
            {
                active: selectedActiveStatus,
                title: newCategoryTitle,
                id: editCategoryData?.id || null,
            }
        )
            .then(res => {
                if(res.status === 200){
                    setIsLoadingAddBtn(false);
                    setNewCategoryTitle("");
                    onSuccess();
                    onHide();
                }
            })
            .catch(err => {
                console.log(err);
            });
    };

    const deleteCategory = async () => {
        setIsLoadingDelete(true);
        await axios.post(
            `https://gangr.uforiaprojects.com/api/local/deleteCategory/${editCategoryData.id}?shop=kamrandevstore.myshopify.com`
        )
            .then(res => {
                if(res.status === 200){
                    setIsLoadingDelete(false);
                    setIsShowDeleteModal(false);
                    onDelete();
                    onHide();
                }
            })
            .catch(err => console.log(err));
    }

    return (
        <>
            <Modal
                open={isShowDeleteModal}
                onClose={() =>  {
                    if(isLoadingDelete) return;
                    setIsShowDeleteModal(false)
                }}
                title={<FormattedMessage id="deleteCategoryModalTitle" />}
                primaryAction={{
                    content: <FormattedMessage id="yes" />,
                    loading: isLoadingDelete,
                    onAction: deleteCategory,
                }}
                secondaryActions={{
                    content: <FormattedMessage id="no" />,
                    onAction: () => {
                        setShowCategoryModal(true)
                        setIsShowDeleteModal(false);
                    },
                }}
            >
                <Modal.Section>
                    <Text>{<FormattedMessage id="deleteGraphicDescription" />}</Text>
                </Modal.Section>
            </Modal>

            <Modal
                open={showCategoryModal}
                onClose={onHide}
                title={<FormattedMessage id={editCategoryData ? "editCategoryModalTitle" : "addCategoryModalTitle"} />}
                primaryAction={{
                    content: <FormattedMessage id={editCategoryData ? "editCategorySaveBtn" : "addCategoryModalBtn"} />,
                    loading: loadingAddBtn,
                    onAction: handleSaveCategory,
                }}
                secondaryActions={editCategoryData && {
                    content: <FormattedMessage id="editCategoryDeleteBtn" />,
                    onAction: () => {
                        setIsShowDeleteModal(true);
                        setShowCategoryModal(false);
                    },
                }}
            >
                <Modal.Section>
                    <TextField
                        placeholder={"Category Name"}
                        value={newCategoryTitle}
                        onChange={(e) => setNewCategoryTitle(e)}
                    />
                    {isNewCategoryError && (
                        <InlineError
                            message={<FormattedMessage id="categoryNameError" />}
                        />
                    )}

                    <Box style={{ marginTop: "20px" }}>
                        <Select
                            options={activeOptions}
                            onChange={handleStatusChange}
                            value={selectedActiveStatus}
                        />
                    </Box>
                </Modal.Section>
            </Modal>
        </>
    )
}