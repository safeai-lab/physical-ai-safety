/* Online reader: sidebar navigation + per-chapter PDF pane.
   Routes via location.hash (#ch3). Chapters with available:false show a
   structured placeholder until their Course Edition PDF is posted. */

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
  var fmt = "pdf";
  try { fmt = localStorage.getItem("pas-fmt") || "pdf"; } catch (e) {}

  var GISCUS = {
    repo: "safeai-lab/physical-ai-safety",
    repoId: "R_kgDOTYwalg",
    category: "General",
    categoryId: "DIC_kwDOTYwals4DBOqv"
  };
  var giscusTerm = null;
  function mountDiscussion(ch) {
    var term = "chapter-" + ch.id;
    if (term === giscusTerm) return;
    giscusTerm = term;
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
    s.setAttribute("data-lang", "en");
    box.appendChild(s);
    document.getElementById("discuss-title").textContent =
      "Discuss " + (ch.num === "—" || ch.num === "A" ? ch.title
        : "Chapter " + ch.num + " — " + ch.title);
  }

  // Build sidebar (textContent only — no HTML injection path)
  chapters.forEach(function (ch) {
    var a = document.createElement("a");
    a.href = "#" + ch.id;
    a.id = "nav-" + ch.id;
    var n = document.createElement("span");
    n.className = "n";
    n.textContent = ch.num;
    var t = document.createElement("span");
    t.className = "t";
    t.textContent = ch.title;
    a.appendChild(n);
    a.appendChild(t);
    if (!ch.available) {
      var soon = document.createElement("span");
      soon.className = "soon";
      soon.textContent = "soon";
      a.appendChild(soon);
    }
    nav.appendChild(a);
  });

  // Full-PDF slot
  var full = window.BOOK.fullPdf;
  var fullLink = document.getElementById("full-pdf-link");
  if (full.available) {
    fullLink.href = full.file;
    fullLink.removeAttribute("aria-disabled");
    fullLink.textContent = "⬇ Download the full PDF";
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

    var label = ch.num === "—" || ch.num === "A" ? ch.title
      : "Chapter " + ch.num + " — " + ch.title;
    paneTitle.textContent = label;
    document.title = label + " — Physical AI Safety";

    // Format toggle state for this chapter
    var htmlReady = !!ch.htmlOk;
    fmtHtml.disabled = !htmlReady;
    fmtHtml.title = htmlReady ? "" : "HTML edition not posted yet";
    var useHtml = fmt === "html" && htmlReady;
    fmtPdf.setAttribute("aria-pressed", useHtml ? "false" : "true");
    fmtHtml.setAttribute("aria-pressed", useHtml ? "true" : "false");

    if (useHtml) {
      frame.src = ch.html;
      frame.hidden = false;
      placeholder.hidden = true;
      openTab.href = ch.html;
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
        ch.num === "—" || ch.num === "A" ? "Coming soon" : "Chapter " + ch.num + " · coming soon";
      document.getElementById("ph-title").textContent = ch.title;
      var ol = document.getElementById("ph-sections");
      ol.innerHTML = "";
      ch.sections.forEach(function (s) {
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

  if (location.protocol !== "file:" && typeof fetch === "function") {
    chapters.forEach(function (ch) {
      // Probe the HTML edition independently of the PDF
      if (ch.html) {
        try {
          fetch(ch.html, { method: "HEAD" }).then(function (res) {
            if (res.ok) {
              ch.htmlOk = true;
              if (currentId() === ch.id) render();
            }
          }).catch(function () { /* not posted yet */ });
        } catch (err) { /* fetch unsupported */ }
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
        fullLink.href = full.file;
        fullLink.removeAttribute("aria-disabled");
        fullLink.textContent = "⬇ Download the full PDF";
      });
    }
  }
})();
