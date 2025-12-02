import express from "express";
import cors from "cors";
import path from "path";
import { connectDB } from "./utils/db";

const app = express();

app.use(cors());
app.use(express.json());


import orderRoutes from "./routes/orderRoutes";
app.use("/api/ordens", orderRoutes);


const frontendPath = path.resolve(__dirname, "../../frontend");
app.use(express.static(frontendPath));


app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

const PORT = 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  });
}); 
