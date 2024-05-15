// ==UserScript==
// @name         雨课堂答题提醒
// @namespace    http://tampermonkey.net/
// @version      2024-05-15
// @description  owo
// @author       oldkingOK
// @match        *://changjiang.yuketang.cn/*
// @icon         https://changjiang.yuketang.cn/static/images/favicon.ico
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @grant        none
// @grant        unsafeWindow
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    var token = '' // 这里改为pushplus的token
    var temp = console.log
    console.log = function(args)
    {
        temp(args)
        if (args.op && (args.op == "probleminfo" || args.op == "unlockproblem")) {
            $.ajax({
                url: 'https://www.pushplus.plus/send',
                type: 'GET',
                data: {
                    'token': token,
                    'title': '有新的答题了！',
                    'content': '# 有新的答题了！',
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