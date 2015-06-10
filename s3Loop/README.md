# s3loop state

- status.jsonの更新
    - ロックファイルがなければ作成
- SNS Queue
    - invoke test
- ロックファイルの更新
    - 前回の実行より30秒経過してるなら
    - invoke getJSON
    
