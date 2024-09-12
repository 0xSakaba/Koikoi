export function uuidToBase64(uuid: string) {
  const cleanUuid = uuid.replace(/-/g, "");
  if (cleanUuid.length !== 32) {
    throw new Error("Invalid UUID format");
  }

  const hexArray = cleanUuid
    .match(/.{1,2}/g)
    ?.map((byte) => parseInt(byte, 16));

  if (!hexArray) {
    throw new Error("Invalid UUID");
  }
  // 創建一個 Uint8Array
  const uint8Array = new Uint8Array(hexArray);

  // 使用 btoa 將字節數組轉換為 base64
  const base64 = btoa(String.fromCharCode.apply(null, Array.from(uint8Array)));

  return base64;
}
