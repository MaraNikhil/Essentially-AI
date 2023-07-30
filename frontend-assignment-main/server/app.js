// DO NOT MODIFY ANYTHING HERE, THE PLACE WHERE YOU NEED TO WRITE CODE IS MARKED CLEARLY BELOW

require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(function (req, res, next) {
    const allowedOrigins = ['http://localhost:3000'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-credentials", true);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
    next();
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.enable('trust proxy');

function isDateBeforeToday(date) {
    const today = new Date().getTime();
    const givenDate = new Date(date).getTime();
    return givenDate <= today;
}

app.post('/api/fetchStockData', (req, res) => {
    // YOUR CODE GOES HERE, PLEASE DO NOT EDIT ANYTHING OUTSIDE THIS FUNCTION
    console.log(req.body);
    const apiKey = 'EYyIJRnpoTvMZdgbZ0zYyMDu187spGOk';
    const { body } = req;
    if (body.stockId && body.date && isDateBeforeToday(body.date)) {
        const { stockId, date } = body;
        const polygonUrl = `https://api.polygon.io/v2/aggs/ticker/${stockId}/range/1/day/${date}/${date}`;
        axios({
            method: 'get',
            url: polygonUrl,
            params: {
                apiKey
            }
        }).then(resp => {
            if (resp?.data?.results) {
                res.json({ data: resp.data.results, status: 200 });
            }
            else {
                res.json({ message: 'Sorry.. no data found', status: 200 });
            }
            res.status(200);
        }).catch(error => {
            console.log(error.message);
            console.log(Object.keys(error));

            res.status(error.response.status).send({ message: error.message, status: error.response.status });
        });
    }
    else {
        res.send({ message: 'Provide proper inputs', status: 403 });
    }
});

const port = process.env.PORT || 5000;
app.get('/', (req, res) => {
    res.send('<h1>server running success fully</h1>');
});
app.listen(port, () => console.log(`Listening on port ${port}`));