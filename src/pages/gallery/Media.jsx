import { DropZone, LegacyStack, Thumbnail, Text } from "@shopify/polaris";
import { NoteMinor } from "@shopify/polaris-icons";
import { useCallback } from "react";

export default function Media({ files, setFiles, isDisabled = false }) {
  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) => {
      setFiles((files) => [...files, ...acceptedFiles]);
    },
    [setFiles]
  );

  const validImageTypes = ["image/png"];

  const fileUpload = !files.length && <DropZone.FileUpload />;
  const uploadedFiles = files.length > 0 && (
    <div style={{ padding: "0" }}>
      <LegacyStack vertical>
        {files.map((file, index) => (
          <LegacyStack alignment="center" key={index}>
            <Thumbnail
              size="small"
              alt={file.name}
              source={
                validImageTypes.includes(file.type)
                  ? window.URL.createObjectURL(file)
                  : NoteMinor
              }
            />
            <div>
              {/* {file.name} */}
              <Text variant="bodySm" as="p">
                {/* {file.size} bytes */}
              </Text>
            </div>
          </LegacyStack>
        ))}
      </LegacyStack>
    </div>
  );

  return (
    <DropZone
      onDrop={handleDropZoneDrop}
      type="image"
      allowMultiple={true}
      accept=".png, .svg, .pdf"
      outline
      errorOverlayText="Only .png or .svg type can be accepted"
      overlayText="Drop"
      overlay={true}
      disabled={isDisabled}
    >
      {uploadedFiles}
      {fileUpload}
    </DropZone>
  );
}
