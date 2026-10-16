# DaiDai TOC

Shows a table of contents built from the headings of the current note, in a `daidai-toc` code block.

DaiDai (a privacy-first messaging app made by Rhing) exports its notes as Markdown. When a note has a table of contents, DaiDai writes it as an empty `daidai-toc` code block. This plugin renders that block in Obsidian as a collapsible table of contents that matches how it looks in DaiDai. Without the plugin, the block is just an empty code block, so the note stays readable anywhere.

## Usage

Put this in a note:

````markdown
```daidai-toc
```
````

You can also run the command **Insert table of contents** from the command palette to insert the block at the cursor.

The table of contents updates when you edit the headings. Click an entry to jump to that heading, and click the title to collapse or expand it.

### Options

Limit the depth of the headings shown (1 to 6, default 6):

````markdown
```daidai-toc
maxDepth: 3
```
````

## Privacy

This plugin does not make network requests and does not collect any data.

## License

MIT

---

# DaiDai TOC（日本語）

現在のノートの見出しから作った目次を、`daidai-toc` コードブロックの場所に表示します。

DaiDai（Rhing が作っているプライバシー重視のメッセージアプリ）のノートを Markdown で書き出すと、目次ブロックは中身が空の `daidai-toc` コードブロックになります。このプラグインは、そのブロックを DaiDai と同じ見た目の開閉できる目次として表示します。プラグインが無い環境では、空のコードブロックとして見えるだけで、ノートは壊れません。

## 使い方

ノートに次のブロックを書きます。

````markdown
```daidai-toc
```
````

コマンドパレットの「目次を挿入」（表示言語が英語のときは「Insert table of contents」）で、カーソル位置にこのブロックを入れることもできます。

見出しを編集すると目次も更新されます。項目をクリックするとその見出しへ移動し、タイトルをクリックすると開閉します。

### オプション

表示する見出しの深さを 1〜6 で制限できます（既定は 6）。

````markdown
```daidai-toc
maxDepth: 3
```
````

## プライバシー

このプラグインはネットワーク通信を行わず、データも収集しません。
