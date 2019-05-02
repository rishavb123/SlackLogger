const { log } = require('./log');
const express = require('express');
const app = express();
const port = parseInt(process.argv[2])? parseInt(process.argv[2]): 3000;
app.get('/', (req, res) => {
    if(req.query.data)
        if(req.query.removelns === 'true') {
            log(req.query.data.replace(/\n/g, ""));
            res.send(req.query.data.replace(/\n/g, ""));
        }
        else {
            log(req.query.data);
            res.send(req.query.data);
        }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));