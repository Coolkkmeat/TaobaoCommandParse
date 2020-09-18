// ==UserScript==
// @name            淘口令解析
// @name:en         Taobao Command Parse
// @namespace       net.coolkk.taobaocommandparse
// @description     将淘宝生成的淘口令转换为链接
// @description:en  Taobao Command Parse conversion into the link
// @version         1.0.0
// @author          Coolkk
// @icon            https://img.alicdn.com/tps/i3/T1OjaVFl4dXXa.JOZB-114-114.png
// @homepage        https://github.com/Coolkkmeat/TaobaoCommandParse
// @supportURL      https://github.com/Coolkkmeat/TaobaoCommandParse/issues
// @contributionURL https://coolkk.net/
// @license         Apache License 2.0
// @charset		    UTF-8
// @require         https://cdn.bootcdn.net/ajax/libs/jquery/1.10.0/jquery.min.js
// @include         http*://*taobao.com/*
// @grant           GM_xmlhttpRequest
// @connect         taofake.com
// @run-at          document-idle
// ==/UserScript==

$(function () {
    "use strict";
    /**
     * 监听
     */
    $("#q,#mq").on("input propertychange", function () {
        work(this);
    });

    /**
     * 处理
     */
    function work(element) {
        let symbols = ["\\$", "¥", "€", "₤", "₳", "¢", "¤", "฿", "₵", "₡", "₫", "ƒ", "₲", "₭", "£", "₥", "₦", "₱", "〒", "₮", "₩", "₴", "₪", "៛", "﷼", "₢", "M", "₰", "₯", "₠", "₣", "₧", "ƒ", "￥"];
        let regExpParamPrepare = symbols.join("|");
        let regExpParam = `(${regExpParamPrepare})([a-zA-Z0-9]*)(${regExpParamPrepare})`;
        let regExpObject = new RegExp(regExpParam);
        var code = $(element).val().match(regExpObject)[2];
        if (code) {
            GM_xmlhttpRequest({
                url: "//www.taofake.com/index/tools/gettkljm.html?tkl=" + code,
                method: "GET",
                responseType: "json",
                timeout: 10000,
                onload: function (res) {
                    res = JSON.parse(res.responseText);
                    if (res.code == 1) {
                        $(window).attr("location", res.data.url);
                    }
                }
            });
        }
    }
})();