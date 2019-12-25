var express = require('express');
var puppeteer = require('puppeteer');
var router = express.Router();
var bodyParser = require('body-parser');

function init() {
    (async () => {
        for (var i = 0; i < MAX_WSE; i++) {
            const browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--disable-gpu',
                    '--disable-dev-shm-usage',
                    '--disable-setuid-sandbox',
                    '--no-first-run',
                    '--no-sandbox',
                    '--no-zygote',
                    '--single-process'
                ]
            });
            browserWSEndpoint = await browser.wsEndpoint();
            WSE_LIST[i] = browserWSEndpoint;
        }
        console.log(WSE_LIST);
    })();
}

const MAX_WSE = 2;  //启动几个浏览器
let WSE_LIST = []; //存储browserWSEndpoint列表
init();
//router.param('uri', function (req, res, next,uri) {
//    next();
//});
router.get("/",function(req,res){
    res.json({"msg":"ok","status":0});
});
router.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());
// Test
router.post('/test', function (req, res) {
    let tmp = Math.floor(Math.random() * MAX_WSE);
    (async () => {
        try{
            console.log("==>>>",req.body);
            let uri = req.body.uri;
            let exec_js = req.body.exec_js;
            let regex = /^[http|https]+\:\/\/.*/;
            if (!regex.test(uri)){
                res.send("uri error");
            }
            let browserWSEndpoint = WSE_LIST[tmp];
            const browser = await puppeteer.connect({browserWSEndpoint});
            const page = await browser.newPage();
            await page.goto(req.body.uri);
            await page.waitForSelector("body");
            let html = await page.content();

            let exec_ret = await page.evaluate(exec_js_str => {
                let obj = eval('(' + exec_js_str + ')');
                return obj.run();
            },exec_js);
            await page.close();
            //res.json({"msg":"ok","data":html,"status":0});
            res.send(exec_ret);
        }catch(e){
            res.send(e.toString());
        }
    })();
});
// 获取浏览器列表
router.get('/browser_list', function (req, res) {
    (async () => {
        res.send(WSE_LIST);
    })();
});

module.exports = router;
