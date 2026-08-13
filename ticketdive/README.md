# 電子チケット UI デモ

Android Chrome / iPhone Safari 向けの静的モックです。実際のチケット、QRコード、入場管理システムには接続されません。

## 起動

```powershell
cd C:\exec\python\ticketdive-mock
python -m http.server 8080 --bind 0.0.0.0
```

同じWi-Fiに接続したスマートフォンから、PCのローカルIPを使って `http://PCのIP:8080/` を開きます。Windows FirewallでPythonの通信許可が必要な場合があります。

確認フロー: 「デモ入場する」→確認シート→「デモ状態を切り替える」→疑似入場完了。リセットも可能です。
