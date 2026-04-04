import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/login");

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    return payload as { username: string };
  } catch {
    redirect("/login");
  }
}
