// ==UserScript==
// @name         雨课堂答题提醒
// @namespace    http://tampermonkey.net/
// @version      2024-05-15
// @description  owo
// @author       oldkingOK
// @match        *://changjiang.yuketang.cn/*
// @icon         https://changjiang.yuketang.cn/static/images/favicon.ico
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// ==/UserScript==

function setToken(token) {
    GM_setValue("ok_token", token);
};

function getToken() {
    return GM_getValue("ok_token", "");
};


var ele = `
<button onclick="hide()">修改PushPlus的Token</button>
<div id="search" hidden style="width: 500px;height: 150px;position: fixed;top: 10%;left: 0;z-index: 10;">
    <div class="serf" style="height: 100px;width: 320px;border: #000000 solid 2px;box-sizing: border-box;padding-left: 50px;background-color: #cccccc;">
        <h2 style="margin-bottom: 5px">Token编辑</h2>
        <div class="ser">
            <form id="searchForm"  method="GET">
                <input type="text" id="searchInput" name="query" placeholder="some token"></input>
                <button type="submit">确认</button>
            </form>
        </div>
    </div>
</div>
<script>
function hide() {
    search.hidden = !search.hidden;
}
</script>
`
$ele = $(ele);
$ele.find("input").val(getToken());
$('body').prepend($ele);

(function() {
    'use strict';

    $('#searchForm').on('submit', function(event) {
        event.preventDefault();
        setToken($("#searchInput").val());
        console.log("Token已经修改为：" + $("#searchInput").val());
    });
    // 重写console.log
    // https://stackoverflow.com/questions/54562790/cannot-set-property-which-only-has-getter-javascript-es6
    console.log("插件加载中...");
    var temp = console.log;
    // 油猴脚本的上下文和页面的上下文不同，所以需要使用unsafeWindow
    unsafeWindow.console.log = function(args) {
        temp(args);
        if (args.op && (args.op == "probleminfo" || args.op == "unlockproblem")) {
            var time = new Date().getTime(); // 防止pushplus平台“频繁消息”
            $.ajax({
                url: 'https://www.pushplus.plus/send',
                type: 'GET',
                data: {
                    'token': getToken(),
                    'title': '有新的答题了！' + time,
                    'content': '# 有新的答题了！' + time,
                    'template': 'markdown'
                },
                success: function(data) {
                    console.log("发送成功!");
                    console.log(data.msg);
                },
                error: function(error) {
                    console.error('Error:', error);
                    console.log(error);
                }
            });
        }
    };
    console.log("插件加载完成！");
})();