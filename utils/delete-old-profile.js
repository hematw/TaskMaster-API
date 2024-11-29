import fs from "fs";

export default function deleteOldProfile(url) {
  const idx = url.indexOf("/uploads/");
  const fileToDeletePath = url
    .replace(url.substring(0, idx), "./public/")
    .replaceAll("/", "\\");

  try {
    fs.unlinkSync(fileToDeletePath);
  } catch (error) {
    console.error("Error", error.message);
  }
  console.log(fileToDeletePath);
}
