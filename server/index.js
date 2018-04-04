const cheerioReq = require("cheerio-req");
const express = require("express");
const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get('/checkStatus/:appname', (req, res) => {
    var appName = req.params.appname;
    cheerioReq("http://downdetector.com/status/" + appName, (err, $) => {
        var result = $("#company > div:nth-child(5) > div > div").text().trim();
        resultObj = new Object();
        if(result.includes('Problems')) {
            resultObj.text = "There is a problem";
            resultObj.result = 2;
        }else if(result.includes("Possible problems")){
            resultObj.text = "There might be a problem";
            resultObj.result = 1;
        }else{
            resultObj.text = "No reported problems";
            resultObj.result = 0;
        }
        res.send(resultObj);
    });
});

app.get('/getTop10', (req, res) => {
    var appName = req.params.appname;
    cheerioReq("http://downdetector.com/top10", (err, $) => {
        var result = $("#top10").text();
        result = result.replace(/[0-9]/g, ' ').replace('-', '').split(" ");
        for(var i = 0; i < result.length; ++i)
            result[i] = result[i].replace(/(\r\n|\n|\r|\t|'-')/gm,"")
        res.send(result.filter(Boolean));
    });
});

app.get('/getAll', (req, res) => {
    var appName = req.params.appname;
    cheerioReq("http://downdetector.com/companies", (err, $) => {
        var arr = [];
        $(".span5").each(function(i, element) {
            arr.push($(this).text());
        });
        for(var i = 0; i < arr.length; ++i)
            arr[i] = arr[i].replace(/(\r\n|\n|\r)/gm,"").trim()
        res.send(arr    );
    });
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))

