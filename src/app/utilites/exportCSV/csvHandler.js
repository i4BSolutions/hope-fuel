import { uploadData, getUrl } from "aws-amplify/storage";

export default async function csvHandler(file, allTransactions) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `ConfirmedPayment_Export_${timestamp}.csv`;

  try {
    const result = await uploadData({
      key: fileName,
      data: file,
      options: {
        contentType: "text/csv",
        contentDisposition: "attachment",
      },
    }).result;

    const bucketBaseUrl =
      "https://hopefuel41d36-dev.s3.us-east-1.amazonaws.com";
    const publicUrl = `${bucketBaseUrl}/public/${result.key}`;

    console.log("Public File URL:", publicUrl);
    return publicUrl;
  } catch (error) {
    console.error("Upload error: ", error);
    throw new Error("Error uploading CSV file");
  }
}
