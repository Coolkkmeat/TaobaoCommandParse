// ==UserScript==
// @name            淘口令解析
// @name:en         Taobao Command Parse
// @namespace       net.coolkk.taobaocommandparse
// @description     将淘宝生成的淘口令转换为链接
// @description:en  Taobao Command Parse conversion into the link
// @version         1.3.1
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

(function () {
    /**
     * 严格模式
     */
    "use strict";

    /**
     * 入口
     */
    if (window.location.host == "world.taobao.com") {
        window.addEventListener("DOMNodeInserted", listenInserted);
    } else {
        getElement("other");
    }

    /**
     * 监听插入
     */
    function listenInserted() {
        getElement("world");
    }

    /**
     * 获取元素
     * @param {string} type 站点类型
     */
    function getElement(type) {
        let element;
        switch (type) {
            case "world"://全球站
                element = document.getElementById("mq");
                if (element != null) {
                    window.removeEventListener("DOMNodeInserted", listenInserted);
                    listenInput(element);
                }
                break;
            case "other"://其它站
                element = document.getElementById("q");
                listenInput(element);
                break;
        }
    }

    /**
     * 监听输入
     * @param {element} element 元素
     */
    function listenInput(element) {
        if (element == null) return;
        element.addEventListener("input", function (e) {
            work(e.target.value)
        });
    }

    /**
     * 处理
     * @param {string} text 文本
     */
    function work(text) {
        let symbols = ["\\$", "¥", "€", "₤", "₳", "¢", "¤", "฿", "₵", "₡", "₫", "ƒ", "₲", "₭", "£", "₥", "₦", "₱", "〒", "₮", "₩", "₴", "₪", "៛", "﷼", "₢", "M", "₰", "₯", "₠", "₣", "₧", "ƒ", "￥", "\/", "\\(", "\\)"];
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
                        window.location.href = res.data.url;
                    }
                }
            });
        }
    }

})();