import { getUrl } from "@aws-amplify/storage";

export default async function getSignedUrl(key) {
  try {
    const identityId = key.split("_")[0];
    if (key.startsWith("https")) {
      const { url, expiresAt } = await getUrl({
        key,
        options: {
          accessLevel: "public",
        },
      });
      return url.href;
    }
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
