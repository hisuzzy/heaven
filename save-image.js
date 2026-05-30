import { getStore } from "@netlify/blobs";
import { randomUUID } from "node:crypto";

const jsonHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store"
};

export const handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers: jsonHeaders,
        body: JSON.stringify({ error: "POST 요청만 가능합니다." })
      };
    }

    const body = JSON.parse(event.body || "{}");
    const image = body?.image;

    if (!image || typeof image !== "string") {
      return {
        statusCode: 400,
        headers: jsonHeaders,
        body: JSON.stringify({ error: "이미지가 없습니다." })
      };
    }

    const match = image.match(/^data:image\/jpe?g;base64,([A-Za-z0-9+/=]+)$/);

    if (!match) {
      return {
        statusCode: 400,
        headers: jsonHeaders,
        body: JSON.stringify({ error: "JPG 형식만 저장할 수 있습니다." })
      };
    }

    const buffer = Buffer.from(match[1], "base64");

    if (buffer.byteLength > 4 * 1024 * 1024) {
      return {
        statusCode: 413,
        headers: jsonHeaders,
        body: JSON.stringify({ error: "이미지 용량이 너무 큽니다. 체크리스트를 조금 줄여주세요." })
      };
    }

    const key = `${Date.now()}-${randomUUID()}.jpg`;
    const store = getStore("heaven-checklist-images");

    await store.set(key, buffer, {
      metadata: {
        contentType: "image/jpeg",
        createdAt: new Date().toISOString()
      }
    });

    const imageUrl = `/.netlify/functions/image?id=${encodeURIComponent(key)}`;
    const downloadUrl = `${imageUrl}&download=1`;

    return {
      statusCode: 200,
      headers: jsonHeaders,
      body: JSON.stringify({ id: key, imageUrl, downloadUrl })
    };
  } catch (error) {
    console.error("save-image error:", error);

    return {
      statusCode: 500,
      headers: jsonHeaders,
      body: JSON.stringify({
        error: error?.message || "서버 저장 중 오류가 발생했습니다."
      })
    };
  }
};
