import { desc } from "drizzle-orm";
import { getDbClient } from "./client";
import { users, messages } from "./schema";

export async function addUser({ email }: { email: string }) {
  const db = await getDbClient();
  const result = await db.insert(users).values({ email: email }).returning({ email: users.email, id: users.id });
  if (result.length === 1) {
    return result[0];
  }
  return result;
}

export async function getUser() {
  const db = await getDbClient();
  const result = await db.select().from(users).orderBy(desc(users.createdAt)).limit(10);
  return result;
}

export async function addMessage({ content, userId }) {
  const db = await getDbClient();
  const result = await db.insert(messages).values({ content: content, userId: userId }).returning({ email: messages.id, id: messages.content });
  if (result.length === 1) {
    return result[0];
  }
  return result;
}

export async function getMessages() {
  const db = await getDbClient();
  const result = await db.select().from(messages).orderBy(desc(messages.createdAt)).limit(10);
  return result;
}
