import { getUrl } from "@aws-amplify/storage";

export default async function getScreenShotUrl(url) {
  const regex = /public\/.+/g;
  const found = url.match(regex);
  let path = null;
  if (Array.isArray(found)) {
    if (found.length > 0) {
      path = found[0];
    } else {
      return;
    }
  } else {
    return;
  }
  // const path = "public/f7e4134b-2d85-4ed4-bbb2-d769a5ad1543Image 3-7-2567 BE at 10.54.jpeg";

  const linkToStorageFile = await getUrl({
    path: path,
    // Alternatively, path: ({identityId}) => `album/{identityId}/1.jpg`
  });
  console.log("signed URL: ", linkToStorageFile.url);
  console.log("URL expires at: ", linkToStorageFile.expiresAt);
  return linkToStorageFile.url;
}
