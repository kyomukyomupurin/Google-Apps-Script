let codeforces_contest_url = "https://codeforces.com/api/contest.list";
let line_notify_url = "https://notify-api.line.me/api/notify";
let line_notify_token = PropertiesService.getScriptProperties().getProperties().LINE_NOTIFY_TOKEN;
const NUM_FUTURE_CONTEST = 20;


function convert_time(timestamp) {
  let day = timestamp / (60 * 60 * 24) | 0;
  let s1;
  if (day == 1) {
    s1 = " day ";
  } else {
    s1 = " days ";
  }
  timestamp %= (60 * 60 * 24);
  let hour = timestamp / (60 * 60) | 0;
  let s2;
  if (hour == 1) {
    s2 = " hour ";
  } else {
    s2 = " hours ";
  }
  timestamp %= (60 * 60)
  let minute = timestamp / 60 | 0;
  let s3;
  if (minute == 1) {
    s3 = " minute ";
  } else {
    s3 = " minutes ";
  }

  return String(day) + s1 + String(hour) + s2 + String(minute) + s3;
}

function getContestInfo() {
  let response = UrlFetchApp.fetch(codeforces_contest_url, {
    "method" : "GET",
    "contentType" : "application/json",
  });
  let r_json = JSON.parse(response.getContentText());
  let messages = [];
  for (let i = 0; i < NUM_FUTURE_CONTEST; ++i) {
    if (r_json.result[i].phase == "BEFORE") {
      let start_unix_time = r_json.result[i].startTimeSeconds;
      let dateTime = new Date(start_unix_time * 1000);
      let time_before_start = -r_json.result[i].relativeTimeSeconds;
      let message = r_json.result[i].name + " start at " + dateTime + ", in " + convert_time(time_before_start);
      messages.push(message);
    }
  }
  messages.reverse();

  return messages;
}

function notifyContestInfo(message) {
  let options = {
    "method" : "post",
    "payload" : "message=" + message,
    "headers" : {"Authorization" : "Bearer " + line_notify_token}
  };
  UrlFetchApp.fetch(line_notify_url, options);
  Utilities.sleep(1000);
}

function mainFunction() {
  let commingContests = getContestInfo();
  for (let contest of commingContests) {
    notifyContestInfo(contest);
  }
}
