// ==UserScript==
// @name         雨课堂答题提醒
// @namespace    http://tampermonkey.net/
// @version      2024-05-15
// @description  owo
// @author       oldkingOK
// @match        *://changjiang.yuketang.cn/*
// @icon         https://changjiang.yuketang.cn/static/images/favicon.ico
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// ==/UserScript==

function getToken() {
    var v = GM_getValue("ok_token", "");
    if (v == "") {
        v = prompt("请输入Pushplus的token")
        setToken(v)
    }
    return v
}

function setToken(token) {
    GM_setValue("ok_token", token);
}

(function() {
    'use strict';

    var token = getToken() // 这里改为pushplus的token
    var temp = console.log

    // 重写console.log
    // https://stackoverflow.com/questions/54562790/cannot-set-property-which-only-has-getter-javascript-es6
    console._log = function(args)
    {
        temp(args)
        if (args.op && (args.op == "probleminfo" || args.op == "unlockproblem")) {
            var time = new Date().getTime() // 防止pushplus平台“频繁消息”
            $.ajax({
                url: 'https://www.pushplus.plus/send',
                type: 'GET',
                data: {
                    'token': token,
                    'title': '有新的答题了！' + time,
                    'content': '# 有新的答题了！' + time,
                    'template': 'markdown'
                },
                success: function(data) {
                    console.log("Send Success!")
                },
                error: function(error) {
                    console.error('Error:', error);
                }
            });
        }
    }
    console.log("插件加载完成！")
})();