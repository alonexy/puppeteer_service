//http://top.baidu.com/buzz?b=1&c=513&fr=topbuzz_b341_c513
var exec_js = { "run":function () {
    return new Promise(function(resolve, reject) {
        try {
            var doms = document.getElementsByClassName("list-table")[0].getElementsByTagName("tr");
            var i = 1;
            var list = new Array();
            for (i;i<doms.length;i++) {
                var obj = new Object();
                //item-tr
                if ( doms[i].getAttribute("class") == 'item-tr') {
                    continue;
                }
                obj.title = doms[i].getElementsByClassName("list-title")[0].innerText;
                obj.title_href = doms[i].getElementsByClassName("list-title")[0].getAttribute("href");
                obj.index = doms[i].getElementsByClassName("last")[0].innerText;
                list.push(obj);
            }
            resolve(list);
        } catch (e) {
           reject(e.toString());
        }
    });
} };
exec_js.run();

// http://127.0.0.1:3000/test  post
//uri:http://top.baidu.com/buzz?b=1&c=513&fr=topbuzz_b341_c513
//exec_js:{ "run":function () { ↵    try {↵        var doms = document.getElementsByClassName("list-table")[0].getElementsByTagName("tr");↵        var i = 1;↵        var list = new Array();↵        for (i;i<doms.length;i++) { ↵            var obj = new Object();↵            //item-tr↵            if ( doms[i].getAttribute("class") == 'item-tr') { ↵                continue;↵            }↵            obj.title = doms[i].getElementsByClassName("list-title")[0].innerText;    ↵            obj.title_href = doms[i].getElementsByClassName("list-title")[0].getAttribute("href");↵            obj.index = doms[i].getElementsByClassName("last")[0].innerText;↵            list.push(obj);↵        }↵        return list;↵    } catch (e) { ↵        return e.toString();↵    }↵} }