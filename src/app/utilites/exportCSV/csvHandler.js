import { fetchAuthSession } from "aws-amplify/auth";
import { uploadData } from "aws-amplify/storage";

export default async function csvHandler(file) {
  try {
    const session = await fetchAuthSession();
    const identityId = session.identityId;

    const result = await uploadData({
      key: `${identityId}/${file.name}`,
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
