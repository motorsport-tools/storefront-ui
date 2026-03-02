import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex } from "@noble/hashes/utils.js";
export const useSha256 = (data: string | object) => {
    const str = typeof data === "string" ? data : JSON.stringify(data);
    return bytesToHex(sha256(new TextEncoder().encode(str)));
}