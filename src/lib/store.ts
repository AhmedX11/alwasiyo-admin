import { promises as fs } from "fs";
import path from "path";
import { create_seed } from "@/lib/seed";
import type { Database } from "@/lib/types";

const FILE_PATH = path.join(process.cwd(), "data", "store.json");
let memory_cache: Database | null = null;
let write_lock: Promise<void> = Promise.resolve();

async function read_from_file(): Promise<Database | null> {
  try {
    const raw = await fs.readFile(FILE_PATH, "utf8");
    return JSON.parse(raw) as Database;
  } catch {
    return null;
  }
}

async function write_to_file(db: Database) {
  await fs.mkdir(path.dirname(FILE_PATH), { recursive: true });
  await fs.writeFile(FILE_PATH, JSON.stringify(db, null, 2), "utf8");
}

async function read_from_blobs(): Promise<Database | null> {
  try {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore("alwasiyo-sms");
    const data = await store.get("database", { type: "json" });
    return (data as Database | null) ?? null;
  } catch {
    return null;
  }
}

async function write_to_blobs(db: Database) {
  const { getStore } = await import("@netlify/blobs");
  const store = getStore("alwasiyo-sms");
  await store.setJSON("database", db);
}

function on_netlify() {
  return Boolean(process.env.NETLIFY || process.env.NETLIFY_BLOBS_CONTEXT);
}

export async function read_db(): Promise<Database> {
  if (memory_cache) {
    return structuredClone(memory_cache);
  }
  const persisted = on_netlify()
    ? await read_from_blobs()
    : await read_from_file();
  memory_cache = persisted ?? (await create_seed());
  if (!persisted) {
    await persist_db(memory_cache);
  }
  return structuredClone(memory_cache);
}

async function persist_db(db: Database) {
  memory_cache = structuredClone(db);
  try {
    if (on_netlify()) {
      await write_to_blobs(db);
    } else {
      await write_to_file(db);
    }
  } catch {
    // Serverless fallback: keep the in-memory copy for this instance.
  }
}

export async function update_db<T>(
  mutator: (db: Database) => T | Promise<T>,
): Promise<T> {
  const run = write_lock.then(async () => {
    const db = await read_db();
    const result = await mutator(db);
    await persist_db(db);
    return result;
  });
  write_lock = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}
