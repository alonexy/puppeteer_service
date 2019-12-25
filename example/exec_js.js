var exec_js = { "run":function () {
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
        return list;
    } catch (e) {
        return e.toString();
    }
} };
exec_js.run();