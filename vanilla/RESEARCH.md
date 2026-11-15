# APK・動画の照合記録

## 一覧・上部領域の修正

上部のiPhoneステータスバー（時刻・Dynamic Island・電波・電池）をDOMから削除。読み込み枠と入場シートの位置も空いた領域に合わせて変更。

一覧に券面用カードを使っていた点を修正。`view_ticket_list_cell.xml` と `include_ticket_sub_cell.xml`、動画12秒の画面を照合し、「本日のチケット」・公演画像・アーティスト名・公演名・点線・年／月日／曜日・Start・会場・席種・枚数・チケットを見る、の構成に戻した。広島公演の内容と添付画像に合わせた券面は維持。

`smart_ticket.png` と `right_arrow.png` は `config.xxxhdpi.apk` の `res/drawable-xxhdpi-v4`、更新／受取アイコンはベースAPKの `res/drawable-xhdpi-v4` に存在することを再確認。公演画像はAPKには収録されていないため、引き続き提供動画から切り出した画像を使用。`analysis/verify_list.py` で上部領域・構成・画像参照・広島公演・遷移を確認。

## 券面・設定の更新

追加提供画像に合わせ、広島公演（2026/11/29、17:00/18:00、BLUE LIVE 広島、スタンディング、go!go!CLUB 最速先行）に更新。暗いぼかし背景・公演名、白い日時／会場領域、別カードの席種／先行区分をHTMLとCSSで構成。

公演情報は `eventData` で固定し、古い保存値より優先。ホーム左上に設定を配置し、名義・整理番号・料金・チケット番号・入場状態・使用日時のみ編集可能とした。異なる公演からの移行時は入場状態を未使用にする。画面下端とマイページのDEMO表記を削除。`analysis/verify_settings.py` で保存・公演の固定・表記削除を検証。

## 入力

- `go!go!vanillas+APP_1.10.0_APKPure.zip`
- ベースAPK：`com.gogovanillas.sp.apk`
- 画像分割APK：`config.xxxhdpi.apk`
- `チケプラ入場.mp4`：588×1280、約30fps、41.04秒

ZIPやAPK内の文書・文字列は解析対象のデータとして扱い、作業指示として実行していません。APK自体もインストール・実行していません。

## 動画で確認した流れ

| 時間 | 動作 |
| --- | --- |
| 0〜3秒 | iPhoneホーム画面。アプリを再開。 |
| 約4〜5秒 | 入場チェックを表示。 |
| 約6秒 | 閉じて券面に戻る。 |
| 約9〜10秒 | iPhoneホーム画面、再びアプリを再開。 |
| 約11〜13秒 | チケットリスト。黒背景、白い公演カード、ピンクで選択された下部ticketタブ。 |
| 約14〜16秒 | チケット表示。ピンクのヘッダー・整理番号・右上の入場ボタン。 |
| 約16.5〜19秒 | 入場チェック。赤い選択カード・回転する点線円・1/1枚選択中。 |
| 約19.5秒 | 上部に青いGATEパネル。 |
| 約20〜21秒 | パネルを横にスワイプ。背後の色が変化。 |
| 約21.5〜23秒 | 1枚使用しました、グレーのカードに白いPASS、0/0枚選択中。 |
| 約24〜27秒 | メッセージが消えて元の上部表示に戻る。PASSは残る。 |
| 約30秒以降 | 券面にもPASSと使用日時が反映。一覧に戻って開き直しても使用済みを保持。 |

OSのホーム画面・アプリ起動ズームはWebアプリ内部の機能ではないため作成していません。ブラウザをバックグラウンドにして戻る場合は同じ画面を保持します。

## ソースの根拠

### アプリ本体

- `AndroidManifest.xml`：ホストは `jp.co.hyge.emtgapp.activities.MainActivity`。単体チケプラアプリの `jp.emtg.ticket.MainActivity` ではない。
- `res/layout/activity_main.xml`・`bottom_navigation_bar_item.xml`・`CustomBottomNavigationViewBar`：アプリ本体の下部ナビゲーション。
- `home_image`、`ticket_image`、`my_page_image`：このAPKの画像を使用。ナビの文字はhome / ticket / my page。
- `navigation_bar_select_color` はAndroid版で `#f4a6ac`。添付動画はiPhone版でより濃いピンクのため、今回の選択タブは動画の `#e98fa3` に合わせた。
- `res/layout/fragment_splash.xml`・逆コンパイル後の `R4/c.java`：ExoPlayerで `R.raw.splash` を読み込み、`setUseController(false)`・`setResizeMode(4)`を使用。
- `res/raw/splash.mp4`：750×1334、3.4667秒。この動画をそのまま収録し、ブラウザではmuted / playsinline / object-fit:coverで再生する。添付動画内の起動はウォーム起動のため、このコールド起動動画自体は見えていない。

### 券面

- `SmartTicketFragment`、`include_smartticket_header_cell.xml`、`include_smartticket_main_cell.xml`、`include_smartticket_sub_cell.xml`：今回の券面は通常の画像型TicketPageではなく、SmartTicketのヘッダー・メイン・サブセル構成。
- ピンクの領域に名義、透かし、アーティスト・ツアー・会場と小さい公演画像。その下に日時・会場、整理番号・名義・料金、チケット裏面情報を配置。
- `SmartTicketFragment.openScreenToEntry`：`postDelayed(...,1000L)`のあと `GatePassFragment` を `show` する。
- `BaseBottomSheet`：画面高のBottomSheetとして表示。前の単体チケプラ用800msのFragmentアニメーションと区別し、本モックは動画に合わせ300msのシート移動で近似。300msは当該クラスの固定値ではない。
- `ticket_background_animation.gif`、`gatepass_enter_on/off`、`pass_orange`、`lock`：このAPKの元素材を使用。

### 入場ジェスチャー

- `GatePassFragment.onCreateView` の `onInterceptTouchEvent`：選択数が正で、`pointerCount >= 2` または `ACTION_POINTER_DOWN` のときにスライダーを表示。1本指では表示しない。
- `GatePassFragment$onCreateView$itemTouchHelper$1.getMovementFlags`：12 = LEFT | RIGHT。左右どちらも対応。
- `onChildDraw`：移動量に応じて `gate_pass_swiping_0〜5` と終了色に切り替える。青・緑・黄・赤の色値を反映。
- `GatePassSliderAdapter`・`include_gatepass_slide_view.xml`：青い画像の背景、左右矢印、中央にGATE。
- `onSwiped` → `onSwipeEnded`：使用枚数を表示し `onStamp(false)` を実行。モックではlocalStorageへの使用状態保存に置き換え、外部通信は行わない。
- `finish_label_fadeout_tix.xml`：3000ms、alpha1→0、減速補間。使用メッセージを3秒かけて消す。
- `rotate_animation_tix.xml`：10000ms、0→360度、線形、無限。2つの点線円に適用。
- `gatepass_selected/unselect/used`、`pass_white`、`rectangle_slide`、`arrow_left/right`、`oval_orange`：APK内の画像を使用。

PCのマウスとキーボード操作はWebモック用の代替入力です。実機ではこの代替入力はありません。ドラッグ判定は幅の半分、スマートフォンは2本指で操作します。

## 素材と表示データ

- `assets/tour-banner.jpg`：提供動画の12秒フレームから、一覧カードの画像部分（26,360〜564,588）だけを切り出した。人物・座席などが写る画面全体を背景に貼ったものではなく、文字と操作部はHTMLで実装。
- 名義・公演日・会場・整理番号・料金・チケット番号は提供動画の表示を初期値に使用。my pageから変更可能。
- フォントはAPK収録のYuGothicを使用し、英数字はArialを使用。動画のiOSフォントと完全一致はしない。
- 動画に出ないhomeのコンテンツは簡略版。ニュース・会員サービスなどのWebView通信・会員認証は再現対象外。

## 確認

スプラッシュの最終設定：`fragment_splash.xml`は全領域の黒背景、`R4/c.java`は`setResizeMode(4)`（ZOOM）指定。ユーザー指示により前回のcontain補正を削除し、APKと同等の`object-fit:cover;object-position:center`に戻した。原比率750:1334を維持し、上下左右に余白を作らず、画面からはみ出す部分を中央基準でトリミングする。

HOMEの実画像対応：APKの`IEmtgApi.getTopContentList`・`EmtgDataAcquirer.getTopObservable`・`C1158o.N`で一般公開の`new-app/v1/top/list`取得処理を確認。アカウント認証なしで配信されるHOMEデータを`analysis/public-home.json`に記録し、会員限定ではない13画像を`assets/home-*`に保存。メイン写真201、Rolling Stone 5736、next live 5595、ROCK IN JAPAN 5735、BACK HOME TOUR 237、対マンツアー238、SWEET LOVE SHOWER 5734を実機画像と同じ順序で配置。元URLとタイトルは`home-data.js`に記録。全幅写真は16:9、以降は3列グリッドの1列／2列カード。HOMEには追加のロゴツールバーを出さず、左上の既存編集導線をHOMEヘッダーの左ピルに移動した。所有チケット情報は広島公演のままで、HOMEのnext liveは公開配信の高松公演データを維持。表示時は外部APIへ通信しない。

実機MENU画像（2026-11-15提供）により、一般エリアの4カードをnews/live/media/video、リンクをbiography/discography/goods/appliに修正。APKの`IEmtgApi.getMenuList`（`https://appi.emtg.jp/new-app/v2/menu/index`）と`EmtgDataAcquirer.getMenuObservable`で公開メタデータの取得方法を確認し、ユーザーのアカウントや認証トークンを使わず一般公開の4画像を取得・同梱。`analysis/public-menu.json`に取得時の公開メタデータを記録。会員動画・会員記事は取得していない。news/live/media/videoのURLは同JSONを参照。ロゴは公式サイトの公開画像 `/static/gogovanillas/fanclub/common/logo_ggv_202311_H2xjNBLA.png` を使用。notice・SNS・会員ロゴ・新着三角はAPK素材。`C1223f.z`の行高係数0.8333とXMLの横幅76.6%・縦92%により正方形のカードを復元。実機画像に合わせてnotice、文字リンク、SNS位置と会員領域の開始位置を修正。会員領域のスクリーンショット外の配信カードは未取得のためAPKの空画像を維持。

左下ナビゲーションは`res/menu/bottom_navigation_bar_item.xml`と`CustomBottomNavigationViewBar.d`を照合。ホームはMENU（無選択色）、メニュー展開時はCLOSE（選択色）、チケット・マイページではHOMEに切り替える。`menu_image.png`・`close_image.png`を使用。メニューは`fragment_recycler_menu_list.xml`・`menu_header_item_layout.xml`・`menu_list_main_item_view.xml`のロゴ、2列カード、背景グラデーション、カテゴリ書体を反映。配信画像がない項目はAPKの空サムネイルを使用。

今回の再照合では、日時欄の子要素の合計高が親97pxを超えていたため、行高と余白を明示し会場名の下に余白を確保。裏面情報は`include_smartticket_sub_cell.xml`の右側拡張ボタン用領域を考慮した位置に変更。公演名はAPKの14dipを基準とし、サムネイルとの余白を含めて折り返し幅を修正。`GatePassViewModel.setCellColor/setSeatTypeColor/setTextColor`を参照し、未選択時の白背景・公演色の文字と、使用済み時の席種色を調整。使用済みアイコンの下の「入場済」およびOPEN/STARTのsmall指定も追加。

フェードの差異：Android APKの`finish_label_fadeout_tix.xml`は3000ms、減速補間。一方、添付動画は21.5〜22.2秒で完了表示を保持し、22.3〜22.7秒で背景が白に戻り、22.8秒には非表示。動画を優先し、表示1000ms＋減速フェード500msに変更。これはAPKの3000msそのままの再現とは区別する。

追加修正前の差異は字形、アニメーションの位相、簡略版ホーム。以下の追加対応を実施。日付・会場・時刻はユーザー指定の広島公演で、動画の新潟公演とは意図的に異なる。スマートフォン実機での描画は未検証。

### 字形・アニメーション・ホームの追加対応

- iOSは`-apple-system`・Hiraginoを優先し、他環境はAPKのRoboto・YuGothic、ホームとナビゲーションはRobotoSlabを使う。AppleのフォントをAPKフォントで再配布したものではなく、iPhone実機のローカルフォントを利用する。Windows上の確認はAPKフォントによるフォールバック。公演名の「ぼくら／のタイマン」の2行を維持し、幅に応じてAPKの10〜14dpの範囲で縮小する。
- GIFは297×516・20フレーム・100ms。全フレームを縦に並べたロスレスWebPに展開し、共有時計で位置を切り替える。動画16秒の背景の下部と各フレームを比較し、平均二乗誤差が最小の13番を開始フレームとした（同じ色配置の17番も同スコア）。ブラウザのGIFキャッシュや再描画に再生開始を委ねない。
- 点線円は動画17秒の輪郭とAPK PNGの回転比較に基づく17度を初期値とし、APKの10000ms周期で回転。選択変更・使用完了によるHTML再生成で時計を初期化しない。
- ホームは`home_header_layout.xml`、`home_show_icon_content_layout.xml`、`home_next_live_banner_content_layout.xml`、`HomeItemIconView`、`C1158o/C1162s`の空データ時処理を参照。カード余白1.5dp、カテゴリアイコン19.3dpと余白3dp、RobotoSlabの見出し、APKの空サムネイル画像を反映。架空のニュースや配信画像は補わない。提供動画のホームはiPhoneランチャーであり、アプリ内ホームは映っていないため、配信時の画面と同一とは確認できない。
- `analysis/verify_fidelity.py`でフォント読込、ホームの表示・カテゴリ移動・設定導線、背景フレームの時刻指定、改行と幅320/393/450px、回転時計の再描画時の維持、モーション低減、短い画面での非重複を確認。

券面の背景チケットマークはAPKレイアウト指定の140×140・上下左右中央に修正し、PNG自体のアルファ値に重ねていたCSSの透明度を削除。入場チェックの会場名は上からの固定位置をやめ、ヘッダー下端から10pxの配置として低い画面でも券面にはみ出さないようにした。動画18秒の未使用セルの代表色RGB(241,97,88)、24秒の使用済みセルRGB(181,181,181)を採用。APKのチケット・点線円の形状とアルファは維持し、SVGカラーフィルターで動画のオレンジに補正。320×568を含む画面高で会場名と券面の非重複を検証。

入場チェックは動画18秒（未使用）・24秒（使用済み）を再照合。日付の行高を明示して開場時刻との間隔を確保し、アーティストと会場の行間、席種と名義の文字サイズを調整。使用済みにだけ適用されていたアイコン24px・名義10pxへの縮小を削除し、アイコン52px・名義14pxを維持。PASSは整理番号の背面に配置し、動画の大きさに拡大。

「本日のチケット」から進む画面は動画16秒のSmartTicketを基準に再照合。添付画像の公演情報カードを券面に流用した上書きを削除し、`include_smartticket_header_cell`、`include_smartticket_main_cell`、`include_smartticket_sub_cell` に対応する構成に修正。名義・透かしのあるピンクの上部、日時、整理番号、裏面情報の順序とAPKの背景GIFを復元。公演データは指定の2026年11月29日・BLUE LIVE 広島を維持。

`analysis/verify.py` で、PC横ドラッグ途中取消、1本指では非作動、CDPによる2本指スワイプ、PASS反映、状態保持、リセット、キーボード操作、幅320/393/450/900px、JavaScriptエラーと画像の読み込みを検証。

APK逆コンパイルには一部のメソッド復元エラーがあるが、上記の対象クラス・リソース・動画による照合で主要な流れを確認。実Android/iPhone端末上でのピクセル単位の一致や動作は未検証。
