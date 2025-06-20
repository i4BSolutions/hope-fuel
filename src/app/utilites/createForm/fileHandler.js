import { fetchAuthSession } from "@aws-amplify/core";
import { getUrl, uploadData } from "aws-amplify/storage";
import { v4 as uuidv4 } from "uuid";

export default async function filehandler(
  files,
  setFile,
  filesState,
  setUploadProgress
) {
  let arrayFiles = [];
  let url = [];

  const session = await fetchAuthSession();
  const identityId = session.identityId;

  for (let i = 0; i < files.length; i++) {
    try {
      const file = files[i];
      setUploadProgress(
        `Uploading ${file.name} (${i + 1} of ${files.length})...`
      );

      const result = await uploadData({
        key: `${identityId}_${uuidv4()}-${file.name}`,
        data: file,
        options: {
          accessLevel: "protected",
          onProgress: ({ transferredBytes, totalBytes }) => {
            if (totalBytes) {
              const progress = Math.round(transferredBytes / totalBytes) * 100;
              setUploadProgress(`Uploading ${file.name}: ${progress}`);
            }
          },
          contentType: file.type,
          contentDisposition: "inline",
        },
      }).result;

      const fileUrl = (await getUrl({ key: result.key })).url;
      url.push({ key: result.key, url: fileUrl, name: file.name });
    } catch (error) {
      console.error("Upload error: ", error);
      setUploadProgress(`Error uploading file: ${arrayFiles[i].name}`);
    }
    arrayFiles.push(files[i]);
  }

  // upload all submitted files
  setFile([...filesState, ...url]);
  setUploadProgress("Upload Complete!\nDrag and drop more files to upload");
  return url;
}
