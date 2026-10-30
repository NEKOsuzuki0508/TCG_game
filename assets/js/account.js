/*
 * アカウントとクラウド同期のUI。
 * 認証情報はサーバーへ送る。パスワードはブラウザに保存しない。
 * セッショントークンは sessionStorage にのみ保存し、タブ終了時に破棄する。
 * 追加カードを含むプロフィールをアカウント単位で同期する。初回接続時は空のクラウドを初期化し、空の端末にはクラウドを復元する。
 */
const ACCOUNT_SESSION_KEY = 'tcg_session_v1';
const PROFILE_FORMAT = 'tcg-profile-v1';
const ACCOUNT_SYNC_STATE_KEY = 'tcg_account_sync_state_v1';
let accountToken = '';
let accountUser = null;
let accountMode = 'login';
let accountBusy = false;
let accountVersion = null;
let accountReady = false;
let accountNotice = '';
let accountTimer = null;
let accountSuppress = false;
let accountPending = false;

function accountApiBase() {
  return String(window.TCG_CONFIG?.apiBaseUrl || '').trim().replace(/\/+$/, '');
}
function accountConfigured() {
  const url = accountApiBase();
  return /^https:\/\/[a-z\d.-]+(?::\d+)?$/i.test(url) && !url.includes('REPLACE-WITH-YOUR-WORKER');
}
function accountSaveToken(token) {
  accountToken = token;
  try { if (token) sessionStorage.setItem(ACCOUNT_SESSION_KEY, token); else sessionStorage.removeItem(ACCOUNT_SESSION_KEY) } catch (_) { }
}
async function accountRequest(path, { method = 'GET', body, auth = true } = {}) {
  if (!accountConfigured()) throw Error('config.js にサーバーのURLを設定してください。');
  let headers = { 'Accept': 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth && accountToken) headers.Authorization = 'Bearer ' + accountToken;
  const response = await fetch(accountApiBase() + path, {
    method, headers, mode: 'cors', cache: 'no-store', credentials: 'omit',
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  let result; try { result = await response.json() } catch (_) { throw Error('サーバーから不正な応答が返りました') }
  if (!response.ok) {
    const error = new Error(result.error || '通信に失敗しました'); error.status = response.status; throw error;
  }
  return result;
}
function renderAccountPanel() {
  const disabled = !accountConfigured();
  const summary = accountUser ? `<div class="account-identity"><strong>${escapeHTML(accountUser.username)}</strong><span>ログイン中</span></div>` : '';
  const form = accountUser ? `<div class="account-actions">
   <button class="primary-btn" data-act="accountPull" ${accountBusy ? 'disabled' : ''}>クラウドから取得</button>
   <button class="small-outline" data-act="accountPush" ${accountBusy ? 'disabled' : ''}>現在のデータをクラウドへ保存</button>
   <button class="small-outline" data-act="accountLogout" ${accountBusy ? 'disabled' : ''}>ログアウト</button>
 </div><p class="account-tip">${accountReady ? '同期済み：追加カードの登録・編集・削除、編成、デッキの変更を自動保存します。' : 'クラウドとこの端末の内容が異なる場合は、上書き防止のため手動選択が必要です。'}</p><p class="account-tip">別の端末でも同じアカウントでログインしてください。保存データがない端末には、追加カードを含むクラウドデータを自動で読み込みます。</p>`
    : `<div class="account-switch"><button data-act="accountMode" data-mode="login" class="${accountMode === 'login' ? 'active' : ''}">ログイン</button><button data-act="accountMode" data-mode="register" class="${accountMode === 'register' ? 'active' : ''}">新規登録</button></div>
 <form id="accountForm" class="account-form" autocomplete="on">
   <label>ユーザー名<input name="username" autocomplete="username" minlength="3" maxlength="24" pattern="[A-Za-z0-9_]{3,24}" required placeholder="3〜24文字（英数字と_）"></label>
   <label>パスワード<input name="password" type="password" autocomplete="${accountMode === 'register' ? 'new-password' : 'current-password'}" minlength="12" maxlength="128" required placeholder="12文字以上"></label>
   ${accountMode === 'register' ? '<p class="account-tip">パスワードは12文字以上。現在、メールによるパスワード再設定機能はありません。安全な場所に保管してください。</p>' : ''}
   <button type="submit" class="primary-btn" ${accountBusy || disabled ? 'disabled' : ''}>${accountMode === 'register' ? 'アカウントを作成' : 'ログイン'}</button>
 </form>`;
  return `<section class="panel account-panel" aria-labelledby="account-title">
  <div class="section-top"><div><p class="eyebrow">PERSONAL CLOUD ACCOUNT</p><h2 id="account-title">アカウント・クラウド保存</h2></div><span class="cloud-mark">${accountUser ? '接続済み' : '任意'}</span></div>
  <p>ユーザー名とパスワードでログインすると、追加カード・名前付き編成・60枚デッキ・チーム設定をアカウントに保存し、同じアカウントを使う端末間で共有できます。</p>
  ${disabled ? '<div class="notice">サーバーURL未設定です。GitHub Pages公開後、config.js にCloudflare WorkerのURLを設定してください。ログインせずローカルで対戦することもできます。</div>' : ''}
  ${summary}${form}
  ${accountNotice ? `<div class="notice" role="status">${escapeHTML(accountNotice)}</div>` : ''}
  <p class="account-tip">編成などはこの端末にも保存されます。対戦の進行途中はクラウド同期しません。別端末との競合時は上書きせず通知します。</p>
 </section>`;
}
async function accountSubmit(form) {
  if (accountBusy) return;
  const username = String(form.elements.username.value || '').trim();
  const password = String(form.elements.password.value || '');
  const registering = accountMode === 'register';
  if (!/^[A-Za-z0-9_]{3,24}$/.test(username) || password.length < 12 || password.length > 128) { accountNotice = '入力内容を確認してください。'; render(); return }
  accountBusy = true; accountNotice = 'サーバーに接続しています…'; render();
  let authenticated = false;
  try {
    const result = await accountRequest(registering ? '/api/auth/register' : '/api/auth/login', { method: 'POST', body: { username, password }, auth: false });
    accountSaveToken(result.token);
    accountUser = result.user; accountReady = false; accountVersion = null; authenticated = true;
    accountNotice = 'ログインしました。クラウドの保存状態を確認しています…';
  } catch (e) { accountNotice = 'ログインできません：' + e.message }
  finally { accountBusy = false; render() }
  if (authenticated) { await accountConnectAfterAuth({ registered: registering }); await accountLoadPublicCards() }
}
function accountStableValue(value) {
  if (Array.isArray(value)) return value.map(accountStableValue);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(k => [k, accountStableValue(value[k])]));
  return value;
}
function accountComparableData(data) {
  const clean = accountValidateData(data);
  return { formations: clean.formations, decks: clean.decks, cards: clean.cards, picks: clean.picks };
}
function accountFingerprint(data) {
  const text = JSON.stringify(accountStableValue(data));
  let a = 2166136261, b = 0x9e3779b9;
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    a = Math.imul(a ^ code, 16777619);
    b = Math.imul(b ^ code, 2246822519);
  }
  return `${(a >>> 0).toString(16).padStart(8, '0')}${(b >>> 0).toString(16).padStart(8, '0')}:${text.length}`;
}
function accountSyncIdentity() { return String(accountUser?.id || accountUser?.username || '').toLowerCase() }
function accountReadSyncState() {
  try { const state = JSON.parse(localStorage.getItem(ACCOUNT_SYNC_STATE_KEY) || 'null'); return state?.identity === accountSyncIdentity() && typeof state.fingerprint === 'string' ? state : null } catch (_) { return null }
}
function accountStoreSyncState(revision, data) {
  try { localStorage.setItem(ACCOUNT_SYNC_STATE_KEY, JSON.stringify({ identity: accountSyncIdentity(), revision, fingerprint: accountFingerprint(accountComparableData(data)) })) } catch (e) { console.warn('同期状態を端末に記録できませんでした', e) }
}
function accountLocalHasData() {
  const defaults = [FORMATIONS[0]?.ids || [], FORMATIONS[4]?.ids || []];
  const picksChanged = !Array.isArray(config.picks) || config.picks.some((ids, i) => JSON.stringify(ids) !== JSON.stringify(defaults[i] || []));
  return USER_CARDS.length > 0 || savedFormations.length > 0 || deckSlots.some(Boolean) || picksChanged;
}
async function accountConnectAfterAuth({ registered = false } = {}) {
  if (!accountUser || accountBusy) return;
  accountBusy = true; accountNotice = 'クラウドの保存状態を確認しています…'; render();
  try {
    const remote = await accountRequest('/api/profile');
    if (remote.revision === 0) {
      accountVersion = 0;
      const saved = await accountRequest('/api/profile', { method: 'PUT', body: { revision: 0, data: accountData() } });
      accountVersion = saved.revision; accountReady = true; accountStoreSyncState(saved.revision, accountData());
      accountNotice = registered ? 'アカウントを作成し、この端末の追加カード・編成・デッキをクラウドに保存しました。' : 'クラウドに保存データがなかったため、この端末のデータを初回保存しました。';
      return;
    }
    const localComparable = accountComparableData(accountData());
    const remoteComparable = accountComparableData(remote.data);
    const localFingerprint = accountFingerprint(localComparable);
    const remoteFingerprint = accountFingerprint(remoteComparable);
    const previous = accountReadSyncState();
    if (localFingerprint === remoteFingerprint) {
      accountVersion = remote.revision; accountReady = true; accountStoreSyncState(remote.revision, remote.data);
      accountNotice = 'この端末とクラウドのデータは一致しています。追加カードの変更は自動同期されます。';
      return;
    }
    if (previous && localFingerprint === previous.fingerprint && remoteFingerprint !== previous.fingerprint) {
      accountApplyData(remote.data); accountVersion = remote.revision; accountReady = true; accountStoreSyncState(remote.revision, remote.data);
      accountNotice = '別の端末で更新された追加カード・編成・デッキを、この端末に自動反映しました。';
      return;
    }
    if (previous && remoteFingerprint === previous.fingerprint && localFingerprint !== previous.fingerprint) {
      accountVersion = remote.revision; accountReady = true; accountPending = true;
      accountNotice = 'この端末で前回同期後に変更したデータをクラウドへ反映しています…';
      return;
    }
    if (!previous && !accountLocalHasData()) {
      accountApplyData(remote.data); accountVersion = remote.revision; accountReady = true; accountStoreSyncState(remote.revision, remote.data);
      accountNotice = 'クラウドから追加カード・編成・デッキをこの端末に復元しました。以後の変更は自動同期されます。';
      return;
    }
    accountVersion = null; accountReady = false;
    accountNotice = 'クラウドに別の保存データがあります。ローカルデータを保護するため自動上書きしていません。必要な追加カードは「カード管理」からJSONでバックアップしてから「クラウドから取得」を選んでください。';
  } catch (e) {
    accountReady = false; accountVersion = null;
    accountNotice = 'クラウド同期の確認に失敗しました：' + e.message + '。アカウントへのログインは維持されています。';
  } finally { accountBusy = false; render(); if (accountPending && accountReady) { accountPending = false; accountMarkDirty() } }
}
async function accountRestoreSession() {
  try { accountToken = sessionStorage.getItem(ACCOUNT_SESSION_KEY) || '' } catch (_) { accountToken = '' }
  if (!accountToken || !accountConfigured()) return;
  try {
    const result = await accountRequest('/api/auth/me'); accountUser = result.user;
    await accountConnectAfterAuth({ registered: false }); await accountLoadPublicCards();
  } catch (_) { accountSaveToken(''); accountUser = null; accountReady = false; accountVersion = null; render() }
}
function accountData() {
  return { format: PROFILE_FORMAT, formations: savedFormations.map(x => ({ ...x })), decks: deckSlots.map(x => x ? x.slice() : null), cards: USER_CARDS.map(x => ({ ...x })), picks: config.picks.map(x => x.slice()) };
}
function accountValidateData(data) {
  if (!data || data.format !== PROFILE_FORMAT) throw Error('保存データの形式が違います');
  if (!Array.isArray(data.cards) || data.cards.length > MAX_IMPORTED_CARDS) throw Error('追加カードデータが不正です');
  const existing = new Set(CARD_DATA.filter(x => !x.userAdded).map(x => x.id));
  const cards = data.cards.map(cleanCard);
  if (cards.some(c => existing.has(c.id)) || new Set(cards.map(c => c.id)).size !== cards.length) throw Error('カード番号が重複しています');
  const formations = normalizePresets(data.formations);
  if (!Array.isArray(data.decks) || data.decks.length !== 2 || !data.decks.every(x => x === null || validateDeckArray(x))) throw Error('デッキデータが不正です');
  if (!Array.isArray(data.picks) || data.picks.length !== 2 || !data.picks.every(x => Array.isArray(x) && x.length === 6 && new Set(x).size === 6 && x.every(n => Number.isSafeInteger(n) && n > 0))) throw Error('編成データが不正です');
  const available = new Set([...existing, ...cards.map(x => x.id)]);
  if (!data.picks.every(x => x.every(id => available.has(id)))) throw Error('選択編成に未登録カードが含まれています');
  return { formations, cards, decks: data.decks, picks: data.picks };
}
function accountApplyData(data) {
  const clean = accountValidateData(data); // 変更前にすべて検証
  const backup = JSON.stringify(accountData());
  localStorage.setItem('tcg_profile_pre_download_' + Date.now(), backup);
  accountSuppress = true;
  try {
    USER_CARDS = clean.cards; localStorage.setItem(USER_CARD_KEY, JSON.stringify(USER_CARDS)); syncCardDatabase();
    savedFormations = clean.formations; saveFormations();
    deckSlots = clean.decks.map(x => x ? x.slice() : null); saveDeckSlots();
    config.picks = clean.picks.map(x => x.slice()); saveConfig();
    deckDraft = deckSlots[deckEditSide] ? deckToCounts(deckSlots[deckEditSide]) : deckRecommended(config.picks[deckEditSide]);
  } finally { accountSuppress = false }
}
async function accountDownload() {
  if (!accountUser || accountBusy) return;
  if (!confirm('クラウドの保存データをこの端末に読み込みます。現在のローカルデータは自動バックアップ後に置き換えます。続けますか？')) return;
  accountBusy = true; accountNotice = 'クラウドから読み込み中…'; render();
  try {
    const result = await accountRequest('/api/profile');
    if (result.revision === 0) {
      accountVersion = 0;
      const saved = await accountRequest('/api/profile', { method: 'PUT', body: { revision: 0, data: accountData() } });
      accountVersion = saved.revision; accountReady = true; accountStoreSyncState(saved.revision, accountData()); accountNotice = 'クラウドにデータがなかったため、この端末の追加カード・編成・デッキを初回保存しました。'; return;
    }
    accountApplyData(result.data); accountVersion = result.revision; accountReady = true; accountStoreSyncState(result.revision, result.data);
    accountNotice = 'クラウドから読み込みました。以後の変更は自動保存されます。';
  } catch (e) { accountNotice = '読込エラー：' + e.message }
  finally { accountBusy = false; render(); if (accountPending && accountReady) { accountPending = false; accountMarkDirty() } }
}
async function accountUpload(automatic = false) {
  if (!accountUser || accountBusy) { if (automatic) accountPending = true; return }
  accountBusy = true; if (!automatic) { accountNotice = 'クラウドへ保存しています…'; render() }
  try {
    if (accountVersion === null) {
      const remote = await accountRequest('/api/profile');
      if (remote.revision !== 0) throw Error('クラウドに保存済みデータがあります。上書き防止のため先に「クラウドから取得」を実行してください。');
      accountVersion = 0;
    }
    const result = await accountRequest('/api/profile', { method: 'PUT', body: { revision: accountVersion, data: accountData() } });
    accountVersion = result.revision; accountReady = true; accountStoreSyncState(result.revision, accountData()); accountNotice = 'クラウドに保存しました。';
  } catch (e) {
    if (e.status === 409) { accountReady = false; accountVersion = null; accountNotice = '別の端末で更新されています。自動保存を停止しました。バックアップしてからクラウドのデータを取得してください。' }
    else accountNotice = '保存失敗：' + e.message;
  } finally {
    accountBusy = false; render();
    if (accountPending && accountReady) { accountPending = false; accountMarkDirty() }
  }
}
function accountMarkDirty() {
  if (accountSuppress || !accountUser) return;
  if (accountBusy) { accountPending = true; return }
  if (!accountReady) return;
  if (accountTimer) clearTimeout(accountTimer);
  accountTimer = setTimeout(() => { accountTimer = null; accountUpload(true) }, 1100);
}
async function accountLogout() {
  if (accountTimer) { clearTimeout(accountTimer); accountTimer = null }
  const token = accountToken;
  accountSaveToken(''); accountUser = null; accountReady = false; accountVersion = null; accountNotice = 'ログアウトしました。ローカルのデータは残ります。'; render();
  if (token) try { await fetch(accountApiBase() + '/api/auth/logout', { method: 'POST', mode: 'cors', headers: { Authorization: 'Bearer ' + token } }) } catch (_) { }
}

async function accountSubmitCardForReview(card) {
  if (!accountUser) throw Error('公開申請にはログインが必要です。');
  const result = await accountRequest('/api/cards/submit', { method: 'POST', body: { card } });
  return result;
}
async function accountLoadPublicCards() {
  if (!accountUser) return;
  try {
    const result = await accountRequest('/api/cards/public');
    const localIds = new Set(USER_CARDS.map(c => c.id));
    PUBLIC_CARDS = (Array.isArray(result.cards) ? result.cards : []).filter(c => !localIds.has(c.id));
    syncCardDatabase(); if (typeof render === 'function') render();
  } catch (e) { console.warn('公開カードを取得できませんでした', e) }
}
