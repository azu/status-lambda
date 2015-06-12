
## 登場サービス

### SQS

- メッセージキューを貯める場所
- 1分毎にメッセージを発行する
- SQSから直接lambda関数は呼ぶことができない
- SNSを経由したlambda関数を呼び出す

### SNS

- SQSからメッセージを受けるSNS Topicを持つ
- SNS Topicをlambdaが購読する
- SNSはただの経由するだけの役割
- (SQSがSNS Topicを購読する)

### S3

- ファイルのストレージ
- ロックファイルの管理

### lambda

- S3のPutイベントを購読
- SNS topic(イベント)を購読
- イベントが起きたら、該当するlambda関数を実行する

-----

### イベントとlambda

不完全な実装

- status.jsonのPut -> ロックファイルの削除
- (ループのスタート) -> ロックファイルの作成
- ロックファイルの更新 -> ループ関数の実行
    - ループ関数は前回の実行より一定時間経過してるなら、status.jsonを更新させる

----

#### ロックファイルからの始点で

ループ処理をロックファイルで行おうとすると

- 作成(作成と更新は区別できない?) -> ループ開始
- 更新(作成と更新は区別できない?) -> ループ関数の実行
- 削除(S3のイベントがない…) -> ループ停止

となるが、ファイルの更新かどうかは区別できないので、
それぞれをファイルとして分けてPutイベントを監視する。

- Start.lambda -> ステートマシンlambda -> ループ開始
- Update.lambda ->  ステートマシンlambda -> ループ関数の実行
- Stop.lambda ->  ステートマシンlambda -> ループ停止

とファイルとして分ける。(Putが発生したらlambda関数を呼ぶ)

つまり、特定のファイル名のファイルを変更すれば、その該当処理が行える。

### ループ

ループの処理について。

#### ループの開始(Start.lambda)

- SQSのキューにメッセージを1分ごとのdelayをつけて数個置く
    - delayのタイミングでループ関数が実行されるようにする
    - キューは15分までしか遅延できないので、
    - SQSからSNSを購読
    - UpdateからSNSを購読
- Loop.lockファイルが存在するなら削除する

#### ループ関数の実行(Update.lambda)

- SQSのキューが空ならば何も処理しない
- 前回の実行時間をUpdate.jsonから得て、30秒以上経過してるなら
    - ループの処理(リソースの取得、S3への保存)を行う
- SQSで現在時間よりも前のメッセージを削除する
- Update.jsonを更新して実行した時間を入れる
- Loop.lockファイルがないなら
    - SQSのキューにメッセージを1分ごとのdelayをつけて数個置く

#### ループの停止(Stop.lambda)

- Look.lockファイルを作成する
- SQSのpurgeQueueを呼び、キューの中のメッセージを空にする
- [Class: AWS.SQS — AWS SDK for JavaScript](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#purgeQueue-property "Class: AWS.SQS — AWS SDK for JavaScript")

-----

### 事前準備

- SQSキューの作成
- SNSトピックの作成
- {Start, Update, Stop}.lambdaの作成
- SQSキューはSNSトピックを購読しておく
- Update.lambdaはSNSトピックを購読しておく
    - 購読に関してAPIでやる方法が分かってない
    
-----

## トラブルシューティング

lambdaを実行して`console.log`してるのにCloudWatchにログが流れてこない

- [クイックスタート: 既存の EC2 インスタンスに CloudWatch Logs エージェントをインストールして設定する - Amazon CloudWatch](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/DeveloperGuide/QuickStartEC2Instance.html "クイックスタート: 既存の EC2 インスタンスに CloudWatch Logs エージェントをインストールして設定する - Amazon CloudWatch")
- 使ってるIAM ロールに`logs:*`へのアクセス権があるかを確認する。