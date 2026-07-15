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

    if (ch.available) {
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
  render();
})();
