(function () {
  var $ = function (id) { return document.getElementById(id); };
  var KEY = 'aipm-kit-v1';
  var ids = ['project', 'own', 'deadline', 'missed'].filter(function (i) { return $(i); });
  function load() { try { var d = JSON.parse(localStorage.getItem(KEY) || '{}'); ids.forEach(function (f) { if (d[f] != null) $(f).value = d[f]; }); } catch (e) {} }
  function save() { try { var d = JSON.parse(localStorage.getItem(KEY) || '{}'); ids.forEach(function (f) { d[f] = $(f).value; }); localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} }
  function esc(s) { return s.replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }
  function val(id) { return $(id) ? $(id).value.trim() : ''; }
  function project() { var p = val('project'); return p === '__own' ? val('own') : p; }
  function render() {
    if ($('own-wrap')) $('own-wrap').hidden = val('project') !== '__own';
    var map = { project: [project(), '[your project]'], deadline: [val('deadline'), '[date]'], missed: [val('missed'), '[what you found in Workshop 1]'] };
    document.querySelectorAll('.prompt[data-tpl]').forEach(function (el) {
      var t = esc(el.getAttribute('data-tpl'));
      el.innerHTML = t.replace(/\{(\w+)\}/g, function (m, k) {
        var v = map[k] ? (map[k][0] || map[k][1]) : '[' + k + ']';
        return '<span class="slot">' + esc(v) + '</span>';
      });
    });
  }
  document.querySelectorAll('button.copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var el = $(btn.getAttribute('data-target'));
      var done = function (m) { btn.textContent = m; btn.setAttribute('data-done', ''); setTimeout(function () { btn.textContent = 'Copy prompt'; btn.removeAttribute('data-done'); }, 1800); };
      var fb = function () { var r = document.createRange(); r.selectNodeContents(el); var s = getSelection(); s.removeAllRanges(); s.addRange(r); done('Selected. Copy it'); };
      try { navigator.clipboard.writeText(el.innerText).then(function () { done('Copied'); }, fb); } catch (e) { fb(); }
    });
  });
  ids.forEach(function (f) { $(f).addEventListener('input', function () { render(); save(); }); $(f).addEventListener('change', function () { render(); save(); }); });
  load(); render();
})();
