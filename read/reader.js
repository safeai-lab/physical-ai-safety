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
  var prevBtn = document.getElementById("prev-ch");
  var nextBtn = document.getElementById("next-ch");
  var side = document.getElementById("side");
  var sideToggle = document.getElementById("side-toggle");
  var fmtPdf = document.getElementById("fmt-pdf");
  var fmtHtml = document.getElementById("fmt-html");
  var langBtn = document.getElementById("lang-toggle");
  var fmt = "html";
  try { fmt = localStorage.getItem("pas-fmt") || "html"; } catch (e) {}
  var lang = "en";
  try { lang = localStorage.getItem("pas-lang") || "en"; } catch (e) {}
  if (lang !== "zh") lang = "en";

  var STR = {
    en: {
      site: "Physical AI Safety",
      sideSub: "The Book<br>by Ding Zhao",
      pdfSoon: "⬇ Full PDF — coming soon",
      pdfGet: "⬇ Download the full PDF",
      home: "← Book homepage",
      chaptersBtn: "☰ Chapters",
      htmlSoon: "HTML edition not posted yet",
      prev: "← Prev",
      next: "Next →",
      soon: "soon",
      comingSoon: "Coming soon",
      phNote: "This chapter posts here as the <strong>Summer 2026 Course Edition</strong>, released chapter by chapter as the course runs. Until then, here is what it covers:",
      phLink: "Chapter overview on the homepage →",
      discussPrefix: "Discuss ",
      discussSub: 'Questions, corrections, and ideas are welcome — comments are backed by <a id="discuss-gh" href="https://github.com/safeai-lab/physical-ai-safety/discussions" target="_blank" rel="noopener">GitHub Discussions</a> (sign in with GitHub to post).',
      giscus: "en",
      htmlLang: "en",
      toggle: "中文"
    },
    zh: {
      site: "物理AI安全",
      sideSub: "教材<br>作者 Ding Zhao",
      pdfSoon: "⬇ 完整 PDF —— 即将上线",
      pdfGet: "⬇ 下载完整 PDF",
      home: "← 返回图书主页",
      chaptersBtn: "☰ 章节",
      htmlSoon: "HTML 版尚未发布",
      prev: "← 上一节",
      next: "下一节 →",
      soon: "即将",
      comingSoon: "即将发布",
      phNote: "本章将作为<strong>2026 夏季课程版</strong>在此发布，随课程进度逐章上线。在此之前，本章内容概览：",
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
      if (!fullLink.dataset.wired) {
        window.pasPdf.wireDownload(fullLink, full.file, "physical-ai-safety.pdf");
        fullLink.dataset.wired = "1";
      }
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
    return idx(h) >= 0 ? h : chapters[0].id;
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
    // Honor the chosen format, but fall back to the HTML edition rather
    // than a "coming soon" placeholder when the PDF is not posted yet.
    var useHtml = htmlReady && (fmt === "html" || !ch.available);
    fmtPdf.setAttribute("aria-pressed", useHtml ? "false" : "true");
    fmtHtml.setAttribute("aria-pressed", useHtml ? "true" : "false");

    if (useHtml) {
      frame.src = htmlSrc;
      frame.hidden = false;
      placeholder.hidden = true;
    } else if (ch.available) {
      frame.hidden = false;
      placeholder.hidden = true;
      frame.removeAttribute("src");
      window.pasPdf.src(ch.file).then(function (u) {
        frame.src = u + "#view=FitH";
      }).catch(function () {});
    } else {
      frame.hidden = true;
      frame.removeAttribute("src");
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

    prevBtn.disabled = nextBtn.disabled = !useHtml;
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

  // Prev/Next move between sections (h2 headings) inside the open chapter.
  function jumpSection(delta) {
    var doc = frame.contentDocument, win = frame.contentWindow;
    if (frame.hidden || !doc || !win) return;
    // h2 = chapter sections; h1 covers front/back matter, whose parts
    // (Preface, Notation, …) are unnumbered top-level headings.
    var hs = doc.querySelectorAll("main h1, main h2");
    if (!hs.length) hs = doc.querySelectorAll("h1, h2");
    if (!hs.length) return;
    // Land headings below the chapter page's sticky header bar.
    var off = 12;
    var hdr = doc.querySelector(".site-header");
    if (hdr) {
      var pos = win.getComputedStyle(hdr).position;
      if (pos === "sticky" || pos === "fixed") off += hdr.offsetHeight;
    }
    var y = win.pageYOffset || 0;
    var tops = [];
    for (var k = 0; k < hs.length; k++) {
      tops.push(hs[k].getBoundingClientRect().top + y - off);
    }
    var cur = -1;
    for (k = 0; k < tops.length; k++) { if (tops[k] <= y + 2) cur = k; }
    var target;
    if (delta > 0) target = cur + 1;
    else target = (cur >= 0 && y > tops[cur] + 40) ? cur : cur - 1;
    if (target >= tops.length) return;
    win.scrollTo({ top: target < 0 ? 0 : tops[target], behavior: "smooth" });
  }

  prevBtn.addEventListener("click", function () { jumpSection(-1); });
  nextBtn.addEventListener("click", function () { jumpSection(1); });
  document.addEventListener("keydown", function (e) {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.key === "ArrowLeft") jumpSection(-1);
    if (e.key === "ArrowRight") jumpSection(1);
  });

  // Sidebar toggle: overlay on small screens, collapse on desktop
  var reader = document.querySelector(".reader");
  var mobile = window.matchMedia("(max-width: 52rem)");
  try {
    if (localStorage.getItem("pas-side") === "collapsed") {
      reader.classList.add("collapsed");
    }
  } catch (e) {}
  sideToggle.addEventListener("click", function () {
    if (mobile.matches) { side.classList.toggle("open"); return; }
    reader.classList.toggle("collapsed");
    try {
      localStorage.setItem("pas-side",
        reader.classList.contains("collapsed") ? "collapsed" : "");
    } catch (e) {}
  });

  window.addEventListener("hashchange", render);
  applyStatic();
  buildNav();
  render();

  // Auto-detect posted PDFs: HEAD-probe each unavailable entry so releasing
  // a chapter only requires committing its PDF — no manifest flag edits.
  // Skipped under file:// (fetch cannot probe local files there).
  function probe(entry, onUpgrade) {
    window.pasPdf.probe(entry.file, function () {
      entry.available = true;
      onUpgrade();
    });
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
          // Readable via HTML: drop the sidebar SOON badge too.
          var a = document.getElementById("nav-" + ch.id);
          var badge = a ? a.querySelector(".soon") : null;
          if (badge) a.removeChild(badge);
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
