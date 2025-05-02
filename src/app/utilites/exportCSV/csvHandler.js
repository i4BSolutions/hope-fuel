import { uploadData, getUrl } from "aws-amplify/storage";

export default async function csvHandler(file, allTransactions) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `ConfirmedPayment_Export_${timestamp}.csv`;

  try {
    const uploadResult = await uploadData({
      key: fileName,
      data: file,
      options: {
        contentType: "text/csv",
        contentDisposition: "attachment",
      },
    }).result;

    const { url } = await getUrl({ key: uploadResult.key });
    return url.toString();
  } catch (error) {
    console.error("Upload error: ", error);
    throw new Error("Error uploading CSV file");
  }
}
