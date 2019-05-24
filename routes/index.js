var express = require('express');
var puppeteer = require('puppeteer')
var router = express.Router();
function init(){
	(async () => {
		for(var i=0;i<MAX_WSE;i++){
			const browser = await puppeteer.launch({headless:true,
				args: [
				'--disable-gpu',
				'--disable-dev-shm-usage',
				'--disable-setuid-sandbox',
				'--no-first-run',
				'--no-sandbox',
				'--no-zygote',
				'--single-process'
			]});
			browserWSEndpoint = await browser.wsEndpoint();
			WSE_LIST[i] = browserWSEndpoint;
		}
		console.log(WSE_LIST);
	})();	
}

const MAX_WSE = 2;  //启动几个浏览器 
let WSE_LIST = []; //存储browserWSEndpoint列表
init();
// 截屏
router.get('/', function (req, res) {
	let tmp = Math.floor(Math.random()* MAX_WSE);
	(async () => {
		let browserWSEndpoint = WSE_LIST[tmp];
		const browser = await puppeteer.connect({browserWSEndpoint});
		const page = await browser.newPage();
		await page.goto('http://dev.crawl.local/api/v1/KlineView?symbol=XAUUSD&type=1&price=12356&rate=3.0&direction=down');
		await page.setViewport({
			 		width: 800,
          height: 400
		});		
		await page.waitForSelector("#main");
		let body = await page.$('#main');
        //调用页面内Dom对象的 screenshot 方法进行截图
    let imgFile  = Date.parse( new Date() ).toString() + Math.ceil(Math.random()*100);
 		await body.screenshot({
            path: './public/images/'+imgFile+'.png'
    });   
		await page.close();
		res.send(imgFile);
	})();
});
// 获取浏览器列表
router.get('/browser_list', function (req, res) {
	let tmp = Math.floor(Math.random()* MAX_WSE);
	(async () => {
		res.send(WSE_LIST);
	})();
});
//爬虫测试
router.post('/crawl', function (req, res) {
	let tmp = Math.floor(Math.random()* MAX_WSE);
	(async () => {
		let browserWSEndpoint = WSE_LIST[tmp];
		const browser = await puppeteer.connect({browserWSEndpoint});
		const page = await browser.newPage();
		await page.goto(req.body.url,{waitUntil: 'networkidle2'});
		await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'})
		let consoles = []
		page.on('console', msg => {
		  for (let i = 0; i < msg.args().length; ++i)
		    consoles.push(`${msg.args()[i]}`);
		});
		const result = await page.evaluate(js => {
        try{
					let retData = eval(js)
	        return [true,retData];
        }catch(e){
						return [false,e.toString()];
        }
    },req.body.js);
    console.log()
		await page.close();
		res.json([consoles,result]);
	})();

});

module.exports = router;
