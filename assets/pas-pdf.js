/* Encrypted-PDF helper. PDFs ship as <name>.pdf.enc — a 12-byte AES-GCM
   nonce followed by the ciphertext, sealed with the same site key the gate
   derives from the passcode. Decryption happens here in the visitor's
   browser; plaintext exists only inside a Blob URL for the session. */
window.pasPdf = (function () {
  "use strict";
  var keyPromise = null;
  var blobs = {}; // url -> Promise<blob URL>

  function b64d(s) {
    var b = atob(s), a = new Uint8Array(b.length);
    for (var i = 0; i < b.length; i++) a[i] = b.charCodeAt(i);
    return a;
  }

  function key() {
    if (keyPromise) return keyPromise;
    var raw = null;
    try {
      raw = sessionStorage.getItem("pas-key") || localStorage.getItem("pas-key");
    } catch (e) {}
    if (!raw || !window.crypto || !crypto.subtle) return null;
    keyPromise = crypto.subtle.importKey("raw", b64d(raw), "AES-GCM", false, ["decrypt"]);
    return keyPromise;
  }

  function blobUrl(url) {
    if (blobs[url]) return blobs[url];
    var k = key();
    if (!k) return Promise.reject(new Error("locked"));
    blobs[url] = fetch(url + ".enc")
      .then(function (res) {
        if (!res.ok) throw new Error("missing");
        return res.arrayBuffer();
      })
      .then(function (buf) {
        return k.then(function (kk) {
          return crypto.subtle.decrypt(
            { name: "AES-GCM", iv: new Uint8Array(buf.slice(0, 12)) },
            kk, buf.slice(12));
        });
      })
      .then(function (plain) {
        return URL.createObjectURL(new Blob([plain], { type: "application/pdf" }));
      })
      .catch(function (err) { delete blobs[url]; throw err; });
    return blobs[url];
  }

  function probe(url, onOk) {
    try {
      fetch(url + ".enc", { method: "HEAD" })
        .then(function (res) { if (res.ok) onOk(); })
        .catch(function () { /* not posted yet */ });
    } catch (e) { /* fetch unsupported */ }
  }

  function wireDownload(el, url, filename) {
    el.href = "#";
    el.addEventListener("click", function (ev) {
      ev.preventDefault();
      blobUrl(url).then(function (u) {
        var a = document.createElement("a");
        a.href = u;
        a.download = filename || url.split("/").pop();
        document.body.appendChild(a);
        a.click();
        a.remove();
      }).catch(function () {});
    });
  }

  function wireOpen(el, url) {
    el.href = "#";
    el.addEventListener("click", function (ev) {
      ev.preventDefault();
      blobUrl(url).then(function (u) {
        window.open(u, "_blank", "noopener");
      }).catch(function () {});
    });
  }

  return { probe: probe, src: blobUrl, wireDownload: wireDownload, wireOpen: wireOpen };
})();
