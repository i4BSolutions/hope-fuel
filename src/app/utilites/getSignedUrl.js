import { getUrl } from "@aws-amplify/storage";

const ACCESS_LEVELS = new Set(["public", "protected", "private"]);

const parseStoragePath = (rawPath) => {
  const segments = rawPath
    .split("/")
    .filter(Boolean)
    .map((segment) => decodeURIComponent(segment));

  if (!segments.length) {
    return { objectKey: "", accessLevel: null, targetIdentityId: null };
  }

  const first = segments[0];
  if (ACCESS_LEVELS.has(first)) {
    const accessLevel = first;
    if (accessLevel === "protected" || accessLevel === "private") {
      return {
        accessLevel,
        targetIdentityId: segments[1] || null,
        objectKey: segments.slice(2).join("/"),
      };
    }
    return {
      accessLevel,
      targetIdentityId: null,
      objectKey: segments.slice(1).join("/"),
    };
  }

  return { objectKey: segments.join("/"), accessLevel: null, targetIdentityId: null };
};

export default async function getSignedUrl(key) {
  if (!key) return null;
  try {
    if (key.startsWith("https")) {
      const parsed = new URL(key);
      const { objectKey, accessLevel, targetIdentityId } = parseStoragePath(
        parsed.pathname
      );

      if (!objectKey) return null;

      const options = {};
      if (accessLevel) options.accessLevel = accessLevel;
      if (targetIdentityId) options.targetIdentityId = targetIdentityId;

      const { url } = await getUrl({
        key: objectKey,
        ...(Object.keys(options).length ? { options } : {}),
      });
      return url.href;
    }

    const { objectKey, accessLevel, targetIdentityId } = parseStoragePath(key);
    const identityId = objectKey.split("_")[0];
    const resolvedAccessLevel = accessLevel || "protected";
    const options = { accessLevel: resolvedAccessLevel };

    if (resolvedAccessLevel === "protected" || resolvedAccessLevel === "private") {
      options.targetIdentityId = targetIdentityId || identityId;
    }

    const { url } = await getUrl({
      key: objectKey,
      options,
    });

    return url.href;
  } catch (error) {
    console.error("Failed to get signed URL:", error);
    return null;
  }
}
