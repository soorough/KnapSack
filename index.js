const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const connectdb = require("./src/config/database");
const { isUser, isAny } = require("./src/middlewares/authMiddleware");
const PORT = process.env.PORT || 3000;


// connect to the database and start the server
const connection = connectdb();

let server = http.createServer(app);

// socket.io
let io = require("socket.io")(server);

connection
    .once("open", () => {
        console.log("Database Connected");

        server.listen(PORT, () => {
            console.log(`Server Listening on port ${PORT}`);
        });
    })
    .on("error", (err) => {
        console.log("Failed to Connect to the Database", err);
    });


// set up the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/pages"));

// cross origin resource sharing
const whitelist = [
    "https://www.knapsack.com",
    "http://127.0.0.1:5500",
    "http://localhost:3000",
];

const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) { // remove after developement
            callback(null, true);
        } else {
            callback(new Error("Not Allowed by CORS"));
        }
    },
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// cookie parser
app.use(cookieParser());

// serve public folder
app.use(express.static("./public"));

// middleware to handle urlencoded data in the requests (form data)
app.use(express.urlencoded({ extended: false }));

// middleware to parse json payload in the requests
app.use(express.json());

// setting up routes
app.use("^/$", isUser, isAny, require("./src/controllers/homeController"));
app.use("/auth", require("./src/routes/authRoutes"));
app.use("/classes", isUser, require("./src/routes/classRoutes"));
app.use("/announcements", isUser, require("./src/routes/announcementRoutes"));
app.use("/mysem", isUser, isAny, require("./src/routes/mysemRoutes"));
app.use("/profile", isUser, require("./src/routes/profileRoutes"));
app.use("/api/messages", isUser, isAny, require("./src/routes/messageRoutes"));

io.on("connection", (socket) => {
    console.log(`New Connection ${socket.id}`);

    socket.on("message", (data) => {
        data.time = Date();
        socket.broadcast.emit("message", data);
    });

    socket.on("typing", (data) => {
        socket.broadcast.emit("typing", data);
    });
    
});