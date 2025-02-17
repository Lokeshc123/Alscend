import app from "./app";
import dotenv from "dotenv";
dotenv.config();
import { connectDb } from "./config/database";

const PORT = process.env.PORT;
connectDb();
if (!PORT) {
  console.log("The server must be started with an environment variable PORT");
  process.exit(0);
}
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
