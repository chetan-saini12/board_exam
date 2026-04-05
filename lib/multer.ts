import multer, { StorageEngine } from "multer";
import path from "path";
import { Readable } from "stream";
import { IncomingMessage, ServerResponse } from "http";
import { NextRequest } from "next/server";
import { mkdirSync } from "fs";

// In serverless environments (e.g. Vercel), process.cwd() is read-only (/var/task).
// Fall back to /tmp which is always writable.
function getUploadDir(): string {
  const preferred = path.join(process.cwd(), "public", "user_documents");
  try {
    mkdirSync(preferred, { recursive: true });
    return preferred;
  } catch {
    const fallback = path.join("/tmp", "user_documents");
    mkdirSync(fallback, { recursive: true });
    return fallback;
  }
}

const storage: StorageEngine = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = getUploadDir();
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const upload = multer({ storage });

async function toNodeReq(req: NextRequest): Promise<IncomingMessage> {
  const buf = Buffer.from(await req.arrayBuffer());
  const readable = Readable.from(buf) as unknown as IncomingMessage;
  readable.headers = Object.fromEntries(req.headers.entries());
  readable.method = req.method;
  readable.url = req.url;
  return readable;
}

// Single field upload
export function runMulter(
  req: NextRequest,
  fieldName: string
): Promise<{ nodeReq: IncomingMessage; file: Express.Multer.File }> {
  return new Promise(async (resolve, reject) => {
    const nodeReq = await toNodeReq(req);
    const nodeRes = new ServerResponse(nodeReq);
    upload.single(fieldName)(nodeReq as never, nodeRes as never, (err) => {
      if (err) return reject(err);
      const file = (nodeReq as unknown as { file: Express.Multer.File }).file;
      resolve({ nodeReq, file });
    });
  });
}

// Multiple named fields upload
export function runMulterFields(
  req: NextRequest,
  fields: { name: string; maxCount?: number }[]
): Promise<{ nodeReq: IncomingMessage; files: Record<string, Express.Multer.File[]> }> {
  return new Promise(async (resolve, reject) => {
    const nodeReq = await toNodeReq(req);
    const nodeRes = new ServerResponse(nodeReq);
    upload.fields(fields)(nodeReq as never, nodeRes as never, (err) => {
      if (err) return reject(err);
      const files = (nodeReq as unknown as { files: Record<string, Express.Multer.File[]> }).files ?? {};
      resolve({ nodeReq, files });
    });
  });
}
