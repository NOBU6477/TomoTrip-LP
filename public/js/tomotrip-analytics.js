/**
 * TomoTrip アクセス分析 Phase 1（独自・匿名計測）
 * - 個人情報は一切送信しない（氏名/メール/電話/認証token/生IP保存なし）
 * - 計測失敗してもページ動作へ影響しない（fail-open）
 * - visitor_id: localStorage永続 / session_id: 30分無操作で更新（session-touchで流入元保持）
 */
(function () {
  'use strict';
  var API = 'https://app.tomotrip.com/api/analytics/event';
  var SESSION_TTL_MS = 30 * 60 * 1000;
  var K = { vid: 'tt_an_visitor', sid: 'tt_an_session', last: 'tt_an_last', attr: 'tt_an_attr' };

  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (_) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (_) {} }

  function getVisitorId() {
    var v = lsGet(K.vid);
    if (!v || !/^[0-9a-f-]{36}$/i.test(v)) { v = uuid(); lsSet(K.vid, v); }
    return v;
  }
  function getSession() {
    var now = Date.now();
    var sid = lsGet(K.sid);
    var last = parseInt(lsGet(K.last) || '0', 10);
    var fresh = false;
    if (!sid || !/^[0-9a-f-]{36}$/i.test(sid) || !last || (now - last) > SESSION_TTL_MS) {
      sid = uuid(); fresh = true;
      try { localStorage.removeItem(K.attr); } catch (_) {}
    }
    lsSet(K.sid, sid); lsSet(K.last, String(now));
    return { sid: sid, fresh: fresh };
  }

  // 流入元判定（session-touch: セッション最初の判定を保持）
  function classifyReferrer(ref) {
    if (!ref) return 'direct';
    var host = '';
    try { host = new URL(ref).hostname.toLowerCase(); } catch (_) { return 'direct'; }
    if (!host || host === location.hostname) return null; // 同一サイト内遷移 → 既存attr維持
    if (/tiktok\./.test(host)) return 'tiktok';
    if (/instagram\./.test(host)) return 'instagram';
    if (/(^|\.)((t|x)\.com|twitter\.com)$/.test(host)) return 'x';
    if (/google\./.test(host)) return 'google';
    if (/(bing\.|yahoo\.|duckduckgo\.|baidu\.)/.test(host)) return 'search';
    if (/(facebook\.|fb\.|linkedin\.|youtube\.|line\.me|lin\.ee|pinterest\.)/.test(host)) return 'sns';
    if (/(^|\.)tomotrip\.com$/.test(host)) return 'lp'; // 本LPサイトからの遷移
    return 'external';
  }
  function safeParam(v) {
    v = String(v || '').toLowerCase().slice(0, 120);
    return /^[\w\-. /]{1,120}$/.test(v) ? v : '';
  }
  function getAttribution(sessionFresh) {
    var cached = null;
    try { cached = JSON.parse(lsGet(K.attr) || 'null'); } catch (_) {}
    var q = new URLSearchParams(location.search);
    var utmSource = safeParam(q.get('utm_source'));
    // UTM付きURLで到着した場合は常に流入元を更新（広告クリック＝新しい流入）
    if (cached && !sessionFresh && !utmSource) return cached;
    var attr;
    if (utmSource) {
      attr = {
        source: utmSource, medium: safeParam(q.get('utm_medium')),
        campaign: safeParam(q.get('utm_campaign')), content: safeParam(q.get('utm_content')),
        referrer: document.referrer || '',
      };
    } else {
      var cls = classifyReferrer(document.referrer);
      if (cls === null && cached) return cached; // サイト内遷移は維持
      attr = { source: cls || 'direct', medium: '', campaign: '', content: '', referrer: document.referrer || '' };
    }
    lsSet(K.attr, JSON.stringify(attr));
    return attr;
  }
  function deviceType() {
    var ua = navigator.userAgent || '';
    if (/iPad|Tablet|Android(?!.*Mobile)/i.test(ua)) return 'tablet';
    if (/Mobi|iPhone|Android/i.test(ua)) return 'mobile';
    if (ua) return 'desktop';
    return 'unknown';
  }
  function pageLang() {
    var l = (document.documentElement.getAttribute('lang') || '').toLowerCase();
    if (/-en\.html$/.test(location.pathname) || l.indexOf('en') === 0) return 'en';
    if (l.indexOf('ja') === 0) return 'ja';
    return 'other';
  }

  var visitorId = getVisitorId();
  var session = getSession();
  var attr = getAttribution(session.fresh);

  function send(eventName, content) {
    try {
      var body = JSON.stringify({
        event_name: eventName,
        visitor_id: visitorId,
        session_id: session.sid,
        page_path: location.pathname,
        lang: pageLang(),
        device_type: deviceType(),
        referrer: attr.referrer || '',
        source: attr.source, medium: attr.medium || '',
        campaign: attr.campaign || '', content: content || attr.content || '',
      });
      if (navigator.sendBeacon) {
        navigator.sendBeacon(API, new Blob([body], { type: 'application/json' }));
      } else {
        fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body, keepalive: true }).catch(function () {});
      }
    } catch (_) { /* fail-open */ }
  }

  // page_view 自動送信
  send('page_view');

  // LP→Appクリック: data-tt-analytics="lp_to_app" data-tt-content="hero" 等を自動バインド
  function bindClicks() {
    try {
      var els = document.querySelectorAll('[data-tt-analytics="lp_to_app"]');
      for (var i = 0; i < els.length; i++) {
        (function (el) {
          if (el.__ttAnBound) return; el.__ttAnBound = true;
          el.addEventListener('click', function () {
            send('lp_to_app_click', el.getAttribute('data-tt-content') || '');
          });
        })(els[i]);
      }
    } catch (_) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bindClicks);
  else bindClicks();

  // === Phase 1.5: LP（tomotrip.com）上でのみ、UTMをApp向けリンクへ引き継ぐ ===
  // ・utm_source/medium/campaign/content のみ（token/email/phone等は対象外・引き継がない）
  // ・既存hrefのqueryとは安全にマージ、同名UTMが既にあれば上書きせず維持（二重追加なし）
  // ・LP以外のホストでは一切動作しない
  function forwardUtmToAppLinks() {
    try {
      if (!/(^|\.)tomotrip\.com$/.test(location.hostname) || location.hostname.indexOf('app.') === 0) return;
      var q = new URLSearchParams(location.search);
      var utm = {};
      var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];
      var has = false;
      for (var i = 0; i < keys.length; i++) {
        var v = safeParam(q.get(keys[i]));
        if (v) { utm[keys[i]] = v; has = true; }
      }
      if (!has) return;
      var links = document.querySelectorAll('a[href*="app.tomotrip.com"]');
      for (var j = 0; j < links.length; j++) {
        try {
          var u = new URL(links[j].getAttribute('href'), location.href);
          if (u.hostname !== 'app.tomotrip.com' || u.protocol !== 'https:') continue;
          var changed = false;
          for (var k = 0; k < keys.length; k++) {
            if (utm[keys[k]] && !u.searchParams.has(keys[k])) { u.searchParams.set(keys[k], utm[keys[k]]); changed = true; }
          }
          if (changed) links[j].setAttribute('href', u.toString());
        } catch (_) { /* 個別リンク失敗は無視（既存hrefを壊さない） */ }
      }
    } catch (_) { /* fail-open */ }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', forwardUtmToAppLinks);
  else forwardUtmToAppLinks();

  // 手動送信用（Phase 2拡張向け）
  window.ttAnalytics = { track: send };
})();
