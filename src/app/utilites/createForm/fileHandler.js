//Update the setFile to a bunch of file
//input is setfile functions and files
import { uploadData } from "aws-amplify/storage";
import { getUrl } from "aws-amplify/storage";
import { v4 as uuidv4 } from "uuid";

export default async function filehandler(
  files,
  setFile,
  filesState,
  setUploadProgress
) {
  let arrayFiles = [];
  let url = [];

  // get the submitted files
  for (let i = 0; i < files.length; i++) {
    try {
      const file = files[i];
      setUploadProgress(`Uploading ${file.name} (${i + 1} of ${files.length})...`);

      const result = await uploadData({
        key: uuidv4() + file.name,
        data: file,
        options: {
          onProgress: ({ transferredBytes, totalBytes }) => {
            if (totalBytes) {
              const progress = Math.round(transferredBytes / totalBytes) * 100;
              setUploadProgress(`Uploading ${file.name}: ${progress}`);
            }
          },
          contentType: "image/png",
          contentDisposition: "inline",
        },
      }).result;

      const fileUrl = (await getUrl({ key: result.key })).url;
      url.push(fileUrl);
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
  // get the previous files

  //Every file in current files
  // for(let file in arrayFiles)
  // {
  //     var formdata = new FormData();
  //     formdata.append("file", arrayFiles[file], arrayFiles[file].name);
  //     formdata.append("", arrayFiles[file], "file");

  //     var requestOptions = {
  //     method: 'POST',
  //     body: formdata,
  //     redirect: 'follow'
  //     };

  //     let response = await fetch("/api/uploadFile", requestOptions)
  //     let json = await response.json();
  //     url.push(json['fileUrl'])
  // }
  // setFile(url) // give the urls
}
