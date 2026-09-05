import assert from "node:assert/strict";
import { hash_password, verify_password } from "../src/lib/crypto";

async function main() {
  const hash = await hash_password("Partnership1990!");
  assert.equal(await verify_password("Partnership1990!", hash), true);
  assert.equal(await verify_password("wrong-password", hash), false);
  console.log("crypto tests passed");
}

main();
