// ==UserScript==
// @name            淘口令解析
// @name:en         Taobao Command Parse
// @namespace       net.coolkk.taobaocommandparse
// @description     将淘宝生成的淘口令转换为链接
// @description:en  Taobao Command Parse conversion into the link
// @version         1.2.0
// @author          Coolkk
// @icon            https://img.alicdn.com/tps/i3/T1OjaVFl4dXXa.JOZB-114-114.png
// @homepage        https://github.com/Coolkkmeat/TaobaoCommandParse
// @supportURL      https://github.com/Coolkkmeat/TaobaoCommandParse/issues
// @contributionURL https://coolkk.net/
// @license         Apache License 2.0
// @charset		    UTF-8
// @include         http*://*taobao.com/*
// @grant           GM_xmlhttpRequest
// @connect         taofake.com
// @run-at          document-idle
// ==/UserScript==

(function (){
    "use strict";
    let selectInput;

    /**
     * 正则匹配口令
     * @param {string} text 口令字符串
     */
    function work(text) {
        let symbols = ["\\$", "¥", "€", "₤", "₳", "¢", "¤", "฿", "₵", "₡", "₫", "ƒ", "₲", "₭", "£", "₥", "₦", "₱", "〒", "₮", "₩", "₴", "₪", "៛", "﷼", "₢", "M", "₰", "₯", "₠", "₣", "₧", "ƒ", "￥", '\/'];
        let regExpParamPrepare = symbols.join("|");
        let regExpParam = `(${regExpParamPrepare})([a-zA-Z0-9]*)(${regExpParamPrepare})`;
        let regExpObject = new RegExp(regExpParam);
        let code = text.match(regExpObject);
        code = code == undefined ? false : code[2];
        if (code) {
            GM_xmlhttpRequest({
                url: "//www.taofake.com/index/tools/gettkljm.html?tkl=" + code,
                method: "GET",
                responseType: "json",
                timeout: 10000,
                onload: function (res) {
                    res = JSON.parse(res.responseText);
                    if (res.code == 1) {
                        window.location.href=res.data.url
                    }
                }
            });
        }
    }

    /**
     * 为input添加input事件 方便改变之后正则匹配
     */
    function addInputEvent(){
        // 淘宝首页有一个 iframe 判断一下防止报错
        if(selectInput == null){
            return ;
        }
        selectInput.addEventListener("input",(e)=>{
            work(e.target.value)
        })
    }

    // DOMNodeInserted 事件的回调函数 方便移除 避免重复获取
    function getInsertedEvent(){
        getInput(2);
    }

    /**
     * 
     * @param {int} type 搜索框类型 1 国内 2 全球站 
     */
    function getInput(type){
        
        if(type == 1){
            selectInput = document.getElementById("q");
            addInputEvent();
        }else if(type == 2){
            selectInput = document.getElementById("mq");
            if(selectInput != null){
                // 获取到之后移除监听事件
                window.removeEventListener("DOMNodeInserted", getInsertedEvent);
                addInputEvent();
            }
        }
        
    }

    /**
     * 判断是不是全球站
     * 由于全球站节点是动态生成的 所以需要监听 DOMNodeInserted 事件
     */
    let host = window.location.host;
    if(host == 'world.taobao.com'){
        window.addEventListener("DOMNodeInserted", getInsertedEvent);
    }else{
        getInput(1); // 除全球站之外的页面都是后台渲染的 可以直接获取
    }

})();