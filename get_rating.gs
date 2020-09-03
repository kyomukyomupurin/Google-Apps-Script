let codeforces_url = "https://codeforces.com/api/user.info";
let prop = PropertiesService.getScriptProperties().getProperties();
let channel_token = prop.CHANNEL_ACCESS_TOKEN;
let line_endpoint = "https://api.line.me/v2/bot/message/reply";


function getUrl(user_name) {
  let ret = codeforces_url + "?handles=" + user_name;
  return ret;
}

function getRating(user_name) {
  let user_url = getUrl(user_name);
  let response = UrlFetchApp.fetch(user_url, {
    "method" : "GET",
    "contentType" : "application/json",
    "muteHttpExceptions" : true,
  });
  let result = JSON.parse(response.getContentText());

  if (result.status == "FAILED") {
    return -1;
  } else {
    return result.result[0].rating;
  }
}

function doPost(e) {
  let json = JSON.parse(e.postData.contents);
  let reply_token = json.events[0].replyToken;

  if (typeof reply_token === "undefined") return;

  let user_name = json.events[0].message.text;
  
  if (getRating(user_name) == -1) {
    message = "User " + user_name + " not found!";
  } else {
    message = "Current rating of " + user_name + " is " + String(getRating(user_name)) + ".";
  }

  UrlFetchApp.fetch(line_endpoint, {
    "headers" : {
      "Content-Type" : "application/json; charset=UTF-8",
      "Authorization" : "Bearer " + channel_token,
    },
    "method" : "post",
    "payload" : JSON.stringify({
      "replyToken" : reply_token,
      "messages" : [{
        "type" : "text",
        "text" : message,
      }],
    }),
  });

  return ContentService.createTextOutput(JSON.stringify({"content" : "post ok"})).setMimeType(ContentService.MimeType.JSON);
}
