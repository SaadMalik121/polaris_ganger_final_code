// import { Modal } from "@shopify/polaris";
// import { useCallback } from "react";
// import { IntlProvider } from "react-intl";
// import { messagesInEnglish, messagesInFrench } from "../utils/Languages";

// function AppModal({
//   isShowModal,
//   setIsShowModal,
//   title,
//   action,
//   ButtonText,
//   isSecondaryButtonShow,
//   children,
// }) {
//   const handleChange = useCallback(
//     () => setIsShowModal(!isShowModal),
//     [isShowModal, setIsShowModal]
//   );

//   return (
//     <div>
//       <Modal
//         open={isShowModal}
//         onClose={handleChange}
//         title={title}
//         primaryAction={{
//           content: ButtonText,
//           onAction: action,
//         }}
//         secondaryActions={
//           isSecondaryButtonShow && [
//             {
//               content: "Cancel",
//               onAction: handleChange,
//             },
//           ]
//         }
//       >
//         <Modal.Section>{children}</Modal.Section>
//       </Modal>
//     </div>
//   );
// }
// export default AppModal;

import React from "react";

function AppModal() {
  return <div>AppModal</div>;
}

export default AppModal;
