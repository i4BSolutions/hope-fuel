import { fetchAuthSession } from "@aws-amplify/core";
import { uploadData } from "aws-amplify/storage";
import { v4 as uuidv4 } from "uuid";

export default async function csvHandler(file) {
  try {
    const session = await fetchAuthSession();
    const identityId = session.identityId;

    const result = await uploadData({
      key: `${identityId}_${uuidv4()}%${file.name}`,
      data: file,
      options: {
        accessLevel: "protected",
        contentType: "text/csv",
        contentDisposition: "attachment",
      },
    }).result;

    return {
      key: result.key,
      name: file.name,
    };
  } catch (error) {
    console.error("Upload error: ", error);
    throw new Error("Error uploading CSV file");
  }
}
