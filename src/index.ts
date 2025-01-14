import express, { Request, Response } from "express";

const app = express();
const port = 8888;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express.js with TypeScript!");
});

app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
