# Google-Apps-Script

## これはなに？

Google Apps Script で書いた、Codeforces の情報を LINE の BOT から収拾するためのスクリプト。もともとは Python で書いていたものを、定期実行したくて GAS に移植した。

## ```get_rating.gs```

ユーザ名を入力すると、その人の現在のレーティングを教えてくれる。存在しないユーザ名を入力すると、```User *** not found!``` というメッセージが返ってくる。

## ```contest_info.gs```

予定されてるコンテストの日時を毎朝 8 時にお知らせしてくれる。

## ```blog_info.gs```

1 日 2 回、1 つ以上高評価のついたブログを通知してくれる。
