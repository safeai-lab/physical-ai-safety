/* Online reader: sidebar navigation + per-chapter PDF pane.
   Routes via location.hash (#ch3). Chapters with available:false show a
   structured placeholder until their Course Edition PDF is posted.
   Bilingual: a language toggle (localStorage "pas-lang") switches all chrome
   strings, chapter titles/sections (title_zh/sections_zh in chapters.js), and
   the HTML edition iframe between chN.html and chN.zh.html. */

(function () {
  var chapters = window.BOOK.chapters;
  var nav = document.getElementById("chapter-nav");
  var frame = document.getElementById("pdf-frame");
  var placeholder = document.getElementById("placeholder");
  var paneTitle = document.getElementById("pane-title");
  var openTab = document.getElementById("open-tab");
  var prevBtn = document.getElementById("prev-ch");
  var nextBtn = document.getElementById("next-ch");
  var side = document.getElementById("side");
  var sideToggle = document.getElementById("side-toggle");
  var fmtPdf = document.getElementById("fmt-pdf");
  var fmtHtml = document.getElementById("fmt-html");
  var langBtn = document.getElementById("lang-toggle");
  var fmt = "pdf";
  try { fmt = localStorage.getItem("pas-fmt") || "pdf"; } catch (e) {}
  var lang = "en";
  try { lang = localStorage.getItem("pas-lang") || "en"; } catch (e) {}
  if (lang !== "zh") lang = "en";

  var STR = {
    en: {
      site: "Physical AI Safety",
      sideSub: "The Book and CMU Course<br>by Ding Zhao",
      pdfSoon: "⬇ Full PDF — coming soon",
      pdfGet: "⬇ Download the full PDF",
      home: "← Book homepage",
      chaptersBtn: "☰ Chapters",
      openTab: "Open in new tab ↗",
      htmlSoon: "HTML edition not posted yet",
      prev: "← Prev",
      next: "Next →",
      soon: "soon",
      comingSoon: "Coming soon",
      phNote: "This chapter posts here as the <strong>Summer 2026 Course Edition</strong>, released chapter by chapter as the CMU course runs. Until then, here is what it covers:",
      phLink: "Chapter overview on the homepage →",
      discussPrefix: "Discuss ",
      discussSub: 'Questions, corrections, and ideas are welcome — comments are backed by <a id="discuss-gh" href="https://github.com/safeai-lab/physical-ai-safety/discussions" target="_blank" rel="noopener">GitHub Discussions</a> (sign in with GitHub to post).',
      giscus: "en",
      htmlLang: "en",
      toggle: "中文"
    },
    zh: {
      site: "物理AI安全",
      sideSub: "教材与 CMU 课程<br>作者 Ding Zhao",
      pdfSoon: "⬇ 完整 PDF —— 即将上线",
      pdfGet: "⬇ 下载完整 PDF",
      home: "← 返回图书主页",
      chaptersBtn: "☰ 章节",
      openTab: "新标签页打开 ↗",
      htmlSoon: "HTML 版尚未发布",
      prev: "← 上一章",
      next: "下一章 →",
      soon: "即将",
      comingSoon: "即将发布",
      phNote: "本章将作为<strong>2026 夏季课程版</strong>在此发布，随 CMU 课程进度逐章上线。在此之前，本章内容概览：",
      phLink: "主页上的章节总览 →",
      discussPrefix: "讨论：",
      discussSub: '欢迎提问、勘误与建议 —— 评论由 <a id="discuss-gh" href="https://github.com/safeai-lab/physical-ai-safety/discussions" target="_blank" rel="noopener">GitHub Discussions</a> 提供支持（使用 GitHub 登录后发言）。',
      giscus: "zh-CN",
      htmlLang: "zh-CN",
      toggle: "English"
    }
  };
  function L() { return STR[lang]; }
  function homeHref(anchor) {
    return "../index" + (lang === "zh" ? ".zh" : "") + ".html" + (anchor || "");
  }
  function chTitle(ch) { return lang === "zh" && ch.title_zh ? ch.title_zh : ch.title; }
  function chSections(ch) { return lang === "zh" && ch.sections_zh ? ch.sections_zh : ch.sections; }
  function chLabel(ch) {
    if (ch.num === "—" || ch.num === "A") return chTitle(ch);
    return lang === "zh" ? "第" + ch.num + "章 · " + chTitle(ch)
      : "Chapter " + ch.num + " — " + chTitle(ch);
  }
  function zhHtmlFile(ch) {
    return ch.html ? ch.html.replace(/\.html$/, ".zh.html") : null;
  }

  var GISCUS = {
    repo: "safeai-lab/physical-ai-safety",
    repoId: "R_kgDOTYwalg",
    category: "General",
    categoryId: "DIC_kwDOTYwals4DBOqv"
  };
  var giscusKey = null;
  function mountDiscussion(ch) {
    var term = "chapter-" + ch.id;
    var key = term + "|" + lang;
    if (key === giscusKey) return;
    giscusKey = key;
    var box = document.getElementById("giscus-box");
    while (box.firstChild) box.removeChild(box.firstChild);
    var s = document.createElement("script");
    s.src = "https://giscus.app/client.js";
    s.async = true;
    s.crossOrigin = "anonymous";
    s.setAttribute("data-repo", GISCUS.repo);
    s.setAttribute("data-repo-id", GISCUS.repoId);
    s.setAttribute("data-category", GISCUS.category);
    s.setAttribute("data-category-id", GISCUS.categoryId);
    s.setAttribute("data-mapping", "specific");
    s.setAttribute("data-term", term);
    s.setAttribute("data-strict", "0");
    s.setAttribute("data-reactions-enabled", "1");
    s.setAttribute("data-emit-metadata", "0");
    s.setAttribute("data-input-position", "top");
    s.setAttribute("data-theme", "light");
    s.setAttribute("data-lang", L().giscus);
    box.appendChild(s);
    document.getElementById("discuss-title").textContent =
      L().discussPrefix + chLabel(ch);
  }

  // Build sidebar (textContent only — no HTML injection path)
  function buildNav() {
    while (nav.firstChild) nav.removeChild(nav.firstChild);
    chapters.forEach(function (ch) {
      var a = document.createElement("a");
      a.href = "#" + ch.id;
      a.id = "nav-" + ch.id;
      var n = document.createElement("span");
      n.className = "n";
      n.textContent = ch.num;
      var t = document.createElement("span");
      t.className = "t";
      t.textContent = chTitle(ch);
      a.appendChild(n);
      a.appendChild(t);
      if (!ch.available) {
        var soon = document.createElement("span");
        soon.className = "soon";
        soon.textContent = L().soon;
        a.appendChild(soon);
      }
      nav.appendChild(a);
    });
  }

  // Full-PDF slot
  var full = window.BOOK.fullPdf;
  var fullLink = document.getElementById("full-pdf-link");
  function updateFullLink() {
    if (full.available) {
      fullLink.href = full.file;
      fullLink.removeAttribute("aria-disabled");
      fullLink.textContent = L().pdfGet;
    } else {
      fullLink.textContent = L().pdfSoon;
    }
  }

  function applyStatic() {
    document.documentElement.lang = L().htmlLang;
    document.getElementById("side-brand").textContent = L().site;
    document.getElementById("side-brand").href = homeHref();
    document.getElementById("side-sub").innerHTML = L().sideSub;
    var home = document.getElementById("side-home");
    home.textContent = L().home;
    home.href = homeHref();
    sideToggle.textContent = L().chaptersBtn;
    openTab.textContent = L().openTab;
    prevBtn.textContent = L().prev;
    nextBtn.textContent = L().next;
    if (langBtn) langBtn.textContent = L().toggle;
    document.getElementById("ph-note").innerHTML = L().phNote;
    var phLink = document.getElementById("ph-link");
    phLink.textContent = L().phLink;
    phLink.href = homeHref("#chapters");
    document.getElementById("discuss-sub").innerHTML = L().discussSub;
    updateFullLink();
  }

  function idx(id) {
    for (var i = 0; i < chapters.length; i++) {
      if (chapters[i].id === id) return i;
    }
    return -1;
  }

  function currentId() {
    var h = location.hash.replace("#", "");
    return idx(h) >= 0 ? h : chapters[1] ? chapters[1].id : chapters[0].id;
  }

  function render() {
    var id = currentId();
    var i = idx(id);
    var ch = chapters[i];

    nav.querySelectorAll("a").forEach(function (a) {
      a.classList.toggle("active", a.id === "nav-" + id);
    });

    var label = chLabel(ch);
    paneTitle.textContent = label;
    document.title = label + " — " + L().site;

    // Format toggle state for this chapter. In Chinese, prefer the zh HTML
    // edition and fall back to the English HTML if the translation is absent.
    var htmlSrc = null;
    if (lang === "zh" && ch.zhOk) htmlSrc = zhHtmlFile(ch);
    else if (ch.htmlOk) htmlSrc = ch.html;
    var htmlReady = !!htmlSrc;
    fmtHtml.disabled = !htmlReady;
    fmtHtml.title = htmlReady ? "" : L().htmlSoon;
    var useHtml = fmt === "html" && htmlReady;
    fmtPdf.setAttribute("aria-pressed", useHtml ? "false" : "true");
    fmtHtml.setAttribute("aria-pressed", useHtml ? "true" : "false");

    if (useHtml) {
      frame.src = htmlSrc;
      frame.hidden = false;
      placeholder.hidden = true;
      openTab.href = htmlSrc;
      openTab.hidden = false;
    } else if (ch.available) {
      frame.src = ch.file + "#view=FitH";
      frame.hidden = false;
      placeholder.hidden = true;
      openTab.href = ch.file;
      openTab.hidden = false;
    } else {
      frame.hidden = true;
      frame.removeAttribute("src");
      openTab.hidden = true;
      placeholder.hidden = false;
      document.getElementById("ph-eyebrow").textContent =
        ch.num === "—" || ch.num === "A" ? L().comingSoon
          : (lang === "zh" ? "第" + ch.num + "章 · " + L().comingSoon
            : "Chapter " + ch.num + " · " + L().comingSoon);
      document.getElementById("ph-title").textContent = chTitle(ch);
      var ol = document.getElementById("ph-sections");
      ol.innerHTML = "";
      chSections(ch).forEach(function (s) {
        var li = document.createElement("li");
        li.textContent = s;
        ol.appendChild(li);
      });
    }

    prevBtn.disabled = i <= 0;
    nextBtn.disabled = i >= chapters.length - 1;
    side.classList.remove("open");
    mountDiscussion(ch);
  }

  function setFmt(f) {
    fmt = f;
    try { localStorage.setItem("pas-fmt", f); } catch (e) {}
    render();
  }
  fmtPdf.addEventListener("click", function () { setFmt("pdf"); });
  fmtHtml.addEventListener("click", function () { setFmt("html"); });

  function setLang(l) {
    lang = l;
    try { localStorage.setItem("pas-lang", l); } catch (e) {}
    giscusKey = null;
    applyStatic();
    buildNav();
    render();
  }
  if (langBtn) {
    langBtn.addEventListener("click", function () {
      setLang(lang === "zh" ? "en" : "zh");
    });
  }

  function go(delta) {
    var i = idx(currentId()) + delta;
    if (i >= 0 && i < chapters.length) location.hash = chapters[i].id;
  }

  prevBtn.addEventListener("click", function () { go(-1); });
  nextBtn.addEventListener("click", function () { go(1); });
  document.addEventListener("keydown", function (e) {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  });
  sideToggle.addEventListener("click", function () {
    side.classList.toggle("open");
  });

  window.addEventListener("hashchange", render);
  applyStatic();
  buildNav();
  render();

  // Auto-detect posted PDFs: HEAD-probe each unavailable entry so releasing
  // a chapter only requires committing its PDF — no manifest flag edits.
  // Skipped under file:// (fetch cannot probe local files there).
  function probe(entry, onUpgrade) {
    try {
      fetch(entry.file, { method: "HEAD" }).then(function (res) {
        if (res.ok) {
          entry.available = true;
          onUpgrade();
        }
      }).catch(function () { /* not posted yet */ });
    } catch (err) { /* fetch unsupported */ }
  }

  function probeUrl(url, onOk) {
    try {
      fetch(url, { method: "HEAD" }).then(function (res) {
        if (res.ok) onOk();
      }).catch(function () { /* not posted yet */ });
    } catch (err) { /* fetch unsupported */ }
  }

  if (location.protocol !== "file:" && typeof fetch === "function") {
    chapters.forEach(function (ch) {
      // Probe the HTML editions (en and zh) independently of the PDF
      if (ch.html) {
        probeUrl(ch.html, function () {
          ch.htmlOk = true;
          if (currentId() === ch.id) render();
        });
        probeUrl(zhHtmlFile(ch), function () {
          ch.zhOk = true;
          if (currentId() === ch.id) render();
        });
      }
      if (ch.available) return;
      probe(ch, function () {
        var a = document.getElementById("nav-" + ch.id);
        var badge = a ? a.querySelector(".soon") : null;
        if (badge) a.removeChild(badge);
        if (currentId() === ch.id) render();
      });
    });
    if (!full.available) {
      probe(full, function () {
        full.available = true;
        updateFullLink();
      });
    }
  }
})();
