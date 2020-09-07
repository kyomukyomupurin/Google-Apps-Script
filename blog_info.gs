let codeforces_blog_url = "https://codeforces.com/blog/entry/";
let blog_api_url = "https://codeforces.com/api/blogEntry.view";
let line_notify_url2 = "https://notify-api.line.me/api/notify";
let line_notify_token2 = PropertiesService.getScriptProperties().getProperties().LINE_NOTIFY_TOKEN;
let last_blogEntryId = PropertiesService.getScriptProperties().getProperties().LAST_BLOG_ENTRYID;
const MAX_POST_NUM = 50;


function getUrl2(id) {
  return blog_api_url + "?blogEntryId=" + String(id);
}

function searchId(id) {
  let blog_url = getUrl2(id);
  let response = UrlFetchApp.fetch(blog_url, {
    "method" : "GET",
    "contentType" : "application/json",
    "muteHttpExceptions" : true,
  });
  Utilities.sleep(250);
  let r_json = JSON.parse(response.getContentText());
  if (r_json.status == "OK" && r_json.result.rating >= 1) {
    return true;
  } else {
    return false;
  }
}

function getBlogInfo() {
  let blogs = [];
  for (let id = 1; id <= MAX_POST_NUM; ++id) {
    if (searchId(Number(last_blogEntryId) + id)) {
      blogs.push(codeforces_blog_url + String(Number(last_blogEntryId) + id));
      PropertiesService.getScriptProperties().setProperty("LAST_BLOG_ENTRYID", String(Number(last_blogEntryId) + id));
    }
  }

  return blogs;
}

function notifyBlogInfo(message) {
  let options = {
    "method" : "post",
    "payload" : "message=" + message,
    "headers" : {"Authorization" : "Bearer " + line_notify_token2}
  };
  UrlFetchApp.fetch(line_notify_url2, options);
  Utilities.sleep(1000);
}


function mainFunction2() {
  let newBlogs = getBlogInfo();
  for (let blog of newBlogs) {
    notifyBlogInfo(blog);
    //Logger.log(blog);
  }
}