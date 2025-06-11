import { getUrl } from "@aws-amplify/storage";

export default async function getSignedUrl(key) {
  try {
    if (key.startsWith("https")) {
      const { url, expiresAt } = await getUrl({
        key,
      });
      return url.href;
    }

    const identityId = key.split("_")[0];
    const { url, expiresAt } = await getUrl({
      key,
      options: {
        accessLevel: "protected",
        targetIdentityId: identityId,
      },
    });

    // console.log("Signed URL:", url);
    // console.log("Expires at:", expiresAt);
    return url.href;
  } catch (error) {
    console.error("Failed to get signed URL:", error);
    return null;
  }
}
