import {
  getLanguage,
  HeadingCache,
  MarkdownPostProcessorContext,
  MarkdownRenderChild,
  Plugin,
  TFile,
} from "obsidian";

const BLOCK = "daidai-toc";

const STRINGS = {
  en: {
    insert: "Insert table of contents",
    title: "Contents",
    empty: "No headings found.",
  },
  ja: {
    insert: "目次を挿入",
    title: "目次",
    empty: "見出しがありません",
  },
};

// Obsidian の表示言語が日本語なら日本語、それ以外は英語。
function t() {
  return getLanguage().startsWith("ja") ? STRINGS.ja : STRINGS.en;
}

// ブロック本文の `maxDepth: 3` を読む。未指定・不正値は 6（全階層）。
function parseMaxDepth(source: string): number {
  const m = source.match(/^\s*maxDepth\s*:\s*(\d+)\s*$/m);
  const n = m ? parseInt(m[1], 10) : 6;
  return n >= 1 && n <= 6 ? n : 6;
}

class TocRenderChild extends MarkdownRenderChild {
  constructor(
    private plugin: DaiDaiTocPlugin,
    el: HTMLElement,
    private sourcePath: string,
    private maxDepth: number,
  ) {
    super(el);
  }

  onload() {
    this.render();
    // 本文の見出しが変わったら目次も作り直す
    this.registerEvent(
      this.plugin.app.metadataCache.on("changed", (file: TFile) => {
        if (file.path === this.sourcePath) this.render();
      }),
    );
  }

  // 開閉は保存せず、このブロックの表示中のみ（DaiDaiと同じ）
  private expanded = true;

  private render() {
    const { app } = this.plugin;
    this.containerEl.empty();
    this.containerEl.addClass("daidai-toc");

    const file = app.vault.getAbstractFileByPath(this.sourcePath);
    const headings: HeadingCache[] =
      file instanceof TFile
        ? (app.metadataCache.getFileCache(file)?.headings ?? [])
        : [];
    const items = headings.filter((h) => h.level <= this.maxDepth);

    const header = this.containerEl.createDiv({ cls: "daidai-toc-header" });
    header.createSpan({
      cls:
        "daidai-toc-arrow " +
        (this.expanded ? "is-expanded" : "is-collapsed"),
    });
    header.createSpan({ cls: "daidai-toc-title", text: t().title });
    header.addEventListener("click", () => {
      this.expanded = !this.expanded;
      this.render();
    });

    if (!this.expanded) return;

    if (items.length === 0) {
      this.containerEl.createDiv({
        cls: "daidai-toc-empty",
        text: t().empty,
      });
      return;
    }

    // 最小レベルを第0階層とする相対階層（最大3）。DaiDaiの tocIndentLevels と同じ。
    const base = Math.min(...items.map((h) => h.level));
    items.forEach((h, i) => {
      const depth = Math.min(Math.max(h.level - base, 0), 3);
      const row = this.containerEl.createDiv({
        cls:
          "daidai-toc-item daidai-toc-depth-" +
          (depth === 0 ? "0" : "n") +
          (i === items.length - 1 ? " is-last" : ""),
      });
      row.style.setProperty("--daidai-toc-indent", `${12 + depth * 16}px`);
      row.createDiv({ cls: "daidai-toc-label", text: h.heading });
      row.addEventListener("click", () => {
        app.workspace.openLinkText(
          `${this.sourcePath}#${h.heading}`,
          this.sourcePath,
        );
      });
    });
  }
}

export default class DaiDaiTocPlugin extends Plugin {
  async onload() {
    this.registerMarkdownCodeBlockProcessor(
      BLOCK,
      (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
        ctx.addChild(
          new TocRenderChild(this, el, ctx.sourcePath, parseMaxDepth(source)),
        );
      },
    );

    this.addCommand({
      id: "insert-daidai-toc",
      name: t().insert,
      editorCallback: (editor) => {
        editor.replaceSelection("```" + BLOCK + "\n```\n");
      },
    });
  }
}
