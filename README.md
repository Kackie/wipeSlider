# wipeSlider
ワイプ切り替えのスライダー<br>

## サンプル
https://kackie.github.io/wipeSlider/

## 使い方
ファイルはGithubから一式ダウンロードできます。
https://github.com/Kackie/wipeSlider
※test.htmlは旧バージョン。
### HTML
#### 外部ファイル読み込み
``` html
<link rel="stylesheet" href="css/wipeSlider.css">
<script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
<script src="script/jquery.wipeSlider.js"></script>
```
スライド用のCSSとjQuery、プラグインのJSを読み込みます。
CSSは開いてみればわかりますがすごくシンプルです。必須なのはこれだけです。
ページャー等の見た目の調整はサンプルのHTMLに直書きしています。参考にしてもらっても、自由にスタイルを書くのもよいと思います。
#### スライド部分
``` html
<div class="slidesWrap js_wiper">
    <ul class="slides">
        <li class="slide">
            <img src="https://dummyimage.com/980x500/ccc/fff&text=1" alt="">
        </li>
        <li class="slide">
            <img src="https://dummyimage.com/980x500/ccc/fff&text=2" alt="">
        </li>
        <li class="slide">
            <img src="https://dummyimage.com/980x500/ccc/fff&text=3" alt="">
        </li>
    </ul><!-- / .slides -->
</div><!-- / .js_wiper -->
```
一番シンプルな形です。<br>階層が守られていればulタグ以外でも構いません。

### jQuery
``` js
$('.js_wiper').wipeSlider();
```
最低限これだけ書けば動きます。

``` js
$('.js_wiper').wipeSlider({
    transition : 1000,
    auto : true
});
```
オプションを設定するとこんな感じです。

#### オプション設定

|ラベル|機能|
|---|---|
|transition|スライドが切り替わるときの速度を設定します。<br>初期値は500。|
|auto|自動再生を設定します。<br>初期値はfalse。|
|duration|自動再生時、スライドの表示時間を設定します。<br>初期値は4000。|
|pager|ページャーを生成します。<br>初期値はtrue。|
|controls|前後のスライドに切り替えるコントローラーを生成します。<br>初期値はtrue。|
|direction|アニメーション方向を設定します。<br>初期値は'horizontal'。|
|easing|ワイプアニメーションのeasingを設定します。<br>初期値は'linear'。|
|slideBefore|スライド切り替えが始まったタイミングで発動するコールバックです。|
|slideAfter|スライド切り替えが終わったタイミングで発動するコールバックです。|

##### directionオプションの詳しい設定
|値|効果|
|---|---|
|'horizontal'|右から左にかけてワイプします。|
|'vertical'|上から下にかけてワイプします。|
|'four'|四方向に順番にワイプします。|
|'custom'|スライド毎に設定された方向にワイプします。<br>.slideに対しdata-dir="toLeft"、data-dir="toRight"、data-dir="toTop"、data-dir="toBottom"のいずれかを設定します。|
|'上記以外'|アニメーションしません。<br>それ以外のスライダーとしての機能を使いたい場合に設定します。|

##### コールバックについて
下記の引数を利用できます。

|引数|内容|
|---|---|
|slideNum|activeのスライドのindex番号を返します。|
|slideLength|スライダーのスライド数を返します。|

下記のような記述になります。

``` jQuery
slideBefore : function(slideNum,slideLength){
    console.log('スライドなう');
},
slideAfter : function(slideNum,slideLength){
    console.log('スライド完了');
}
```
