// Required modules 
const express = require("express");
const app = express();
const dblib = require("./dblib.js");

const multer = require("multer");
const upload = multer();

// Add middleware to parse default urlencoded form
app.use(express.urlencoded({ extended: false }));

// Setup EJS
app.set("view engine", "ejs");

// Enable CORS (see https://enable-cors.org/server_expressjs.html)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

// Application folders
app.use(express.static("public"));

// Start listener
app.listen(process.env.PORT || 3000, () => {
    console.log("Server started (http://localhost:3000/) !");
});

// Setup routes
app.get("/", (req, res) => {
    //res.send("Root resource - Up and running!")
    res.render("index");
});

app.get("/sum", (req, res) => {
    //res.send("Root resource - Up and running!")
    res.render("sum");
});


//Get/input
app.get("/input", async (req, res) => {
    const totRecs = await dblib.getTotalRecords();
    res.render("input", {
        totRecs: totRecs.totRecords,
    });
  });
  
//Post/input
app.post("/input", upload.single('filename'), async (req, res) => {
    if(!req.file || Object.keys(req.file).length === 0) {
        message = "Error: Import file not uploaded";
        return res.send(message);
    };
    //Read file line by line, inserting records
    const buffer = req.file.buffer; 
    const lines = buffer.toString().split(/\r?\n/);
    let message = {
        processed: 0,
        inserted: 0,
        notInserted: 0,
        msg: [],
        total: 0
    };

    for (let i = 0; i < lines.length; i++) {
        line = lines[i];
        if (line === '') {
        continue;
        }
        book = line.split(",");
        const insertResult = await dblib.insertBook(book);
        console.log(insertResult);
        if (insertResult.trans === 'success') {
        message.processed ++;
        message.inserted ++;
        }
        if (insertResult.trans === 'fail') {
        message.processed ++;
        message.notInserted ++;      
            if (insertResult.msg !== undefined && insertResult.msg !== '') {
                message.msg.push(`${insertResult.msg}`);
            }
        }
    }
    message.total = await dblib.getTotalRecords().totRecords;
    res.send(message);
}); 