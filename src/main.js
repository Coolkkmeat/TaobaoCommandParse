// ==UserScript==
// @name            淘口令解析
// @name:en         Taobao Command Parse
// @namespace       net.coolkk.taobaocommandparse
// @description     将淘宝生成的淘口令转换为链接
// @description:en  Taobao Command Parse conversion into the link
// @version         1.4.2
// @author          Coolkk
// @icon            https://img.alicdn.com/tps/i3/T1OjaVFl4dXXa.JOZB-114-114.png
// @homepage        https://github.com/Coolkkmeat/TaobaoCommandParse
// @supportURL      https://github.com/Coolkkmeat/TaobaoCommandParse/issues
// @contributionURL https://coolkk.net/
// @license         Apache License 2.0
// @charset		    UTF-8
// @include         http*://*taobao.com/*
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_registerMenuCommand
// @grant           GM_xmlhttpRequest
// @connect         chaozhi.hk
// @connect         taodaxiang.com
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
    //设置
    const config = { "data_source_list": ["taobaoke", "taodaxiang"], "data_source_now": GM_getValue("data_source_now", "taobaoke") }
    GM_registerMenuCommand("设置数据源", function () {
        let configNew = prompt("解析功能的接口：" + config["data_source_list"].join(" 或 "), config["data_source_now"]);
        if (configNew && configNew !== config["data_source_now"] && config["data_source_list"].indexOf(configNew) > -1) {
            GM_setValue("data_source_now", configNew);
            window.location.reload();
        }
    });
    //获取元素
    getElement("other");

    /**
     * 获取元素
     * @param {string} type 站点类型
     */
    function getElement(type) {
        let element;
        switch (type) {
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
            work(e.target.value, element)
        });
    }

    /**
     * 处理
     * @param {string} text 文本
     * @param {element} element 元素
     */
    function work(text, element) {
        let symbols = ["\\$", "¥", "€", "₤", "₳", "¢", "¤", "฿", "₵", "₡", "₫", "ƒ", "₲", "₭", "£", "₥", "₦", "₱", "〒", "₮", "₩", "₴", "₪", "៛", "﷼", "₢", "M", "₰", "₯", "₠", "₣", "₧", "ƒ", "￥", "\/", "\\(", "\\)"];
        let regExpParamPrepare = symbols.join("|");
        let regExpParam = `(${regExpParamPrepare})([a-zA-Z0-9]*)(${regExpParamPrepare})`;
        let regExpObject = new RegExp(regExpParam);
        let code = text.match(regExpObject);
        code = code == undefined ? false : code[2];
        if (code) {
            element.value = code;
            request(code);
        }
    }

    /**
     * 请求
     * @param {string} code 淘口令
     */
    function request(code) {
        switch (config["data_source_now"]) {
            case "taobaoke":
                GM_xmlhttpRequest({
                    url: "//api.chaozhi.hk/tool/webLogin",
                    method: "POST",
                    responseType: "json",
                    timeout: 10000,
                    headers: { "Content-Type": "application/json", "Host": "tool.chaozhi.hk" },
                    data: '{ "type": 2, "name": "Coolkk", "pass": "coolkk" }',
                    onload: function (res) {
                        res = JSON.parse(res.responseText);
                        GM_xmlhttpRequest({
                            url: "//api.chaozhi.hk/tb/tklParse",
                            method: "POST",
                            responseType: "json",
                            timeout: 10000,
                            headers: { "Content-Type": "application/json", "Host": "tool.chaozhi.hk" },
                            data: `{ "tkl": "${code}", "token": "${res.data.token}" }`,
                            onload: function (res) {
                                res = JSON.parse(res.responseText);
                                if (res.msgCode == 0) {
                                    window.location.href = res.data.url;
                                }
                            }
                        });
                    }
                });
                break;
            case "taodaxiang":
                GM_xmlhttpRequest({
                    url: "//taodaxiang.com/taopass/parse/get",
                    method: "POST",
                    responseType: "json",
                    timeout: 10000,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    data: `content=${code}`,
                    onload: function (res) {
                        res = JSON.parse(res.responseText);
                        if (res.code == 0) {
                            window.location.href = res.data.url;
                        }
                    }
                });
                break;
        }
    }
})();