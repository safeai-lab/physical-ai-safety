/* Self-decrypting stub runtime. Each encrypted page embeds
   window.__PAS_PAYLOAD = {iv, data} (AES-256-GCM, base64) and loads this
   script. The raw 256-bit key (derived once on gate.html) is read from
   session/localStorage; missing or wrong key bounces to the gate with a
   return address. No passcode ever appears here. */
(function () {
  "use strict";

  function b64d(s) {
    var bin = atob(s), arr = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return arr;
  }

  function toGate() {
    var here = location.pathname + location.search + location.hash;
    location.replace("/gate.html?return=" + encodeURIComponent(here));
  }

  function storedKey() {
    try {
      return sessionStorage.getItem("pas-key") || localStorage.getItem("pas-key");
    } catch (e) { return null; }
  }

  function clearKey() {
    try { sessionStorage.removeItem("pas-key"); localStorage.removeItem("pas-key"); } catch (e) {}
  }

  var payload = window.__PAS_PAYLOAD;
  var raw = storedKey();
  if (!payload || !raw || !window.crypto || !crypto.subtle) { toGate(); return; }

  crypto.subtle.importKey("raw", b64d(raw), "AES-GCM", false, ["decrypt"])
    .then(function (key) {
      return crypto.subtle.decrypt(
        { name: "AES-GCM", iv: b64d(payload.iv) }, key, b64d(payload.data));
    })
    .then(function (plain) {
      var html = new TextDecoder("utf-8").decode(plain);
      /* Full-document replacement is the point: the payload is our own
         AES-GCM-authenticated page (tampering fails decryption above), and
         only open/write/close swaps <head> + executes embedded scripts.
         DOM-insertion alternatives cannot replace a whole document. */
      document.open();
      document.write(html);
      document.close();
    })
    .catch(function () { clearKey(); toGate(); });
})();
