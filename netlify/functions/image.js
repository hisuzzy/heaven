import { getStore } from "@netlify/blobs";

export const handler = async (event) => {
  try {
    const id = event.queryStringParameters?.id;
    const isDownload = event.queryStringParameters?.download === "1";

    if (!id || !/^[0-9]+-[0-9a-fA-F-]+\.jpg$/.test(id)) {
      return {
        statusCode: 400,
        body: "Invalid image id"
      };
    }

    const store = getStore("heaven-checklist-images");
    const image = await store.get(id, { type: "arrayBuffer" });

    if (image === null) {
      return {
        statusCode: 404,
        body: "Image not found"
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=86400",
        "Content-Disposition": `${isDownload ? "attachment" : "inline"}; filename="heaven_checklist.jpg"`
      },
      body: Buffer.from(image).toString("base64"),
      isBase64Encoded: true
    };
  } catch (error) {
    console.error("image error:", error);
    return {
      statusCode: 500,
      body: error?.message || "Image server error"
    };
  }
};
