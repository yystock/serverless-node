import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { userValidator } from "./db/validators";
import { addUser, getUser } from "./db/curd";

const app = new Hono();

app.get("/", (c) => c.text("Hono App"));
app.get("/user", async (c) => {
  // get from db
  const data = await getUser();
  return c.json(data);
});
app.post("/user", async (c) => {
  const body = await c.req.json();
  const data = userValidator.safeParse(body);

  if (!data.success) {
    return c.body("Error: Invalid data", 403);
  }
  // save to db
  console.log("saving");
  const result = await addUser(body);
  console.log(result);
  return c.json(result);
});

export const handler = handle(app);
