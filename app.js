
if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}
const express = require('express')
const session = require('express-session')
const app = express()
const errorHandling = require('./midleware/errorHandling')
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 3001
app.set("port", port);

const anipay = require('./routes/anipay.js')
const inbox = require('./routes/inbox')
const reseller = require('./routes/reseller')
const winpay = require('./routes/winpay')
const olahdata = require('./routes/olahdata')
const report = require('./routes/report')
const inquiry = require('./routes/inquiry')
const lib = require('./routes/lib')
const dbWatch = require('./routes/dbWatch')
const dataProvinsi = require('./routes/dataProvinsi')
const grdv = require('./routes/grdv')
const operator = require('./routes/operator')
const daftarBank = require('./routes/daftarBank')
const linkqu = require('./routes/linkqu')
const mba = require('./routes/mba')
const merchant = require('./routes/merchant')

app.use(express.urlencoded({
    extended: true
}))
app.use(express.text({
    type: 'text/plain'
}))
app.use(express.json({
    type: 'application/json'
}));

// app.use(cookieParser());
app.use(session({
    secret: 'sudahlah',
    resave: true,
    saveUninitialized: false,
}));

// app.use(session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: true }
//   }))
app.use('/anipay', anipay)
app.use('/winpay', winpay)
app.use('/inbox', inbox)
app.use('/reseller', reseller)
app.use('/olahdata', olahdata)
app.use('/report', report)
app.use('/inquiry', inquiry)
app.use('/lib', lib)
app.use('/dbWatch', dbWatch)
app.use('/wilayahIndonesia', dataProvinsi)
app.use('/grdv', grdv)
app.use('/operator', operator)
app.use("/daftarBank", daftarBank)
app.use("/linkqu", linkqu)
app.use("/mba", mba)
app.use("/merchant", merchant)
app.use(errorHandling)

app.use('*', (req, res) => {
    return res.status(404).json({
        success: false,
        message: 'Endpoint doesnt exist and who are you'
    })
});

const server = http.createServer(app);

server.listen(port);

const io = socketIo(server);

let interval;

io.on("connection", (socket) => {
    console.log("New client connected");
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => getApiAndEmit(socket), 1000);
    socket.on("disconnect", () => {
        clearInterval(interval);
    });
});

const getApiAndEmit = socket => {
    const response = new Date();
    socket.emit("FromAPI", response);
};

server.on("listening", () => {
    console.log(`Listening on port:: http://localhost:${port}/`)
});