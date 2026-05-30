export const handler = async () => {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store"
    },
    body: "ok"
  };
};
