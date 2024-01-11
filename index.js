require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const app = express();


const { dbConnection } = require("./config/db");

const { employeeRouter } = require("./routes/employee");
const { enquiryRouter } = require("./routes/enquiry");


const PORT = process.env.PORT || 8080;



app.use(express.json());
app.use(cors());

app.use("/employee", employeeRouter);
app.use("/enquiry", enquiryRouter)


app.get('/', (req, res) => {
    res.send("Hello Wrold")
});



app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);

    try {
        await dbConnection;
        console.log("DB Connected")

    } catch (error) {
        console.error({ error: error.message })
    }
});