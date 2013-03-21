//http://blog.monoweb.info/blog/2012/11/08/chrome-event-pages/

chrome.runtime.onInstalled.addListener(function() {
  // 拡張のインストール時やバージョンアップ時に呼ばれる
  chrome.alarms.create('getNikkei', { periodInMinutes: 1 });
});

chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm) {
    if (alarm.name == 'getNikkei') {
      console.log("alerm in")
      chrome.runtime.getBackgroundPage(getNikkei);
    }
  }
});

function getNikkei() {
  var colors = [
    [0, 255, 0, 255],
    [255, 0, 0, 255]
  ];
  $.ajax({
    url: "http://stocks.finance.yahoo.co.jp/stocks/detail/?code=998407.O",
    type: 'GET',
  }).then(
    function(res){
      var $data = $(res);
      var $price = $data.find(".stoksPrice")[1];
      $("#price").text($price.innerHTML);
      $("#change").text($data.find(".change").text());
      var change = $data.find(".yjMSt").text();
      var per = parseFloat(change.match(/(.*)（(.*)%）/)[2]);
      chrome.browserAction.setBadgeText({text : per.toString()});
      chrome.browserAction.setBadgeBackgroundColor({color : per >= 0 ? colors[0] : colors[1]})
    },
    function(res){
      chrome.browserAction.setBadgeText({text : "NG"});
      chrome.browserAction.setBadgeBackgroundColor({color : colors[1] })
      console.log(res)
    }
  );
}
