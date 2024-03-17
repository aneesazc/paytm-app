const express = require("express");
const cors = require("cors");
const rootRouter = require("./routes/index.js");
const app = express();

app.use(express.json());
//allow cors from everywhere
app.use(cors());

app.use("/api/v1", rootRouter);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});


