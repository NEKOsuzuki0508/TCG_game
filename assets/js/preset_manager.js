/* 自由編成ライブラリ + GitHub Repository Contents API 同期
 * 認証用トークンはブラウザ内にも、HTMLにも、リポジトリにも保存しない。
 */
const PRESET_STORAGE_KEY = 'tcg_vivid_named_formations_v1';
const CLOUD_SETTINGS_KEY = 'tcg_vivid_github_location_v1';
const CLOUD_SYNC_KEY = 'tcg_vivid_github_lastsha_v1';
const PRESET_FORMAT = 'uttenai-tcg-formations-v1';
const MAX_PRESETS = 200;
let savedFormations = [], presetSide = 0, presetEditingId = null, presetNotice = '', cloudNotice = '', cloudBusy = false;
let cloudSettings = { owner: '', repo: '', branch: 'main', path: 'data/tcg-formations.json' };
let cloudLastSync = { key: '', sha: null };

function newPresetId() { return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `f_${Date.now()}_${Math.random().toString(36).slice(2, 12)}` }
function validPreset(p) {
    if (!p || typeof p !== 'object') return false;
    if (typeof p.id !== 'string' || p.id.length > 100 || !p.id) return false;
    if (typeof p.name !== 'string' || !p.name.trim() || p.name.trim().length > 60) return false;
    if (!Array.isArray(p.ids) || p.ids.length !== 6 || new Set(p.ids).size !== 6 || !p.ids.every(n => Number.isSafeInteger(n) && n > 0)) return false;
    if (p.includeDeck !== undefined && typeof p.includeDeck !== 'boolean') return false;
    if (p.includeDeck === true && p.deck !== null && !validateDeckArray(p.deck)) return false;
    if (p.createdAt !== undefined && !Number.isFinite(p.createdAt)) return false;
    if (p.updatedAt !== undefined && !Number.isFinite(p.updatedAt)) return false;
    return true;
}
function normalizePresets(input) {
    if (!Array.isArray(input) || input.length > MAX_PRESETS) throw Error(`保存可能な編成は最大${MAX_PRESETS}件です`);
    let ids = new Set(); return input.map(p => {
        if (!validPreset(p)) throw Error('編成データの形式、カード番号、またはデッキ条件が不正です');
        if (ids.has(p.id)) throw Error('保存IDが重複しています'); ids.add(p.id);
        return { id: p.id, name: p.name.trim(), ids: p.ids.slice(), includeDeck: !!p.includeDeck, deck: p.includeDeck ? (p.deck?.slice() || null) : null, createdAt: p.createdAt || Date.now(), updatedAt: p.updatedAt || Date.now() };
    });
}
function saveFormations() {
    try { localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify({ format: PRESET_FORMAT, formations: savedFormations })) }
    catch (e) { presetNotice = '保存に失敗しました。JSON書き出しでバックアップしてください。'; throw e }
    if (typeof accountMarkDirty === 'function') accountMarkDirty();
}
function initializeFormations() {
    try {
        let local = JSON.parse(localStorage.getItem(PRESET_STORAGE_KEY) || 'null');
        savedFormations = normalizePresets(Array.isArray(local) ? local : (local?.formations || []));
    } catch (e) { console.warn('保存編成の読込失敗', e); savedFormations = []; presetNotice = '保存編成を読み込めませんでした。JSONバックアップから復元してください。' }
    try {
        let s = JSON.parse(localStorage.getItem(CLOUD_SETTINGS_KEY) || 'null');
        if (s && typeof s === 'object') cloudSettings = { owner: String(s.owner || ''), repo: String(s.repo || ''), branch: String(s.branch || 'main'), path: String(s.path || 'data/tcg-formations.json') };
        let synced = JSON.parse(localStorage.getItem(CLOUD_SYNC_KEY) || 'null'); if (synced && typeof synced.key === 'string' && (typeof synced.sha === 'string' || synced.sha === null)) cloudLastSync = synced;
    } catch (e) { console.warn('同期設定を読めません', e) }
}
function currentPresetNames() { return savedFormations.slice().sort((a, b) => b.updatedAt - a.updatedAt) }
function presetText(p) { return p.ids.map(id => HERO_MAP[id]?.name || `No.${id}（未登録）`).join(' / ') }
function presetAvailable(p) { return p.ids.every(id => !!HERO_MAP[id]) }
function saveNamedFormation(name, side, includeDeck, editId) {
    name = String(name || '').trim(); if (!name || name.length > 60) throw Error('編成名は1〜60文字で入力してください');
    let ids = config.picks[side]?.slice(); if (!ids || ids.length !== 6 || new Set(ids).size !== 6 || ids.some(id => !HERO_MAP[id])) throw Error('有効なキャラクターを重複なしで6人選んでください');
    let deck = includeDeck ? (deckSlots[side]?.slice() || null) : null;
    if (deck && !validateDeckArray(deck)) throw Error('保存対象の60枚デッキが不正です');
    const prev = editId ? savedFormations.find(x => x.id === editId) : null;
    const item = { id: prev?.id || newPresetId(), name, ids, includeDeck: !!includeDeck, deck, createdAt: prev?.createdAt || Date.now(), updatedAt: Date.now() };
    if (!prev && savedFormations.length >= MAX_PRESETS) throw Error(`最大${MAX_PRESETS}編成までです`);
    if (prev) savedFormations = savedFormations.map(x => x.id === prev.id ? item : x); else savedFormations.unshift(item);
    saveFormations(); presetEditingId = null; return item;
}
function useNamedFormation(id, side) {
    const item = savedFormations.find(x => x.id === id);
    if (!item) throw Error('保存した編成が見つかりません');
    if (!presetAvailable(item)) throw Error('未登録のカードがあります。カード管理から該当カードを追加してください');
    config.picks[side] = item.ids.slice(); saveConfig();
    if (item.includeDeck) { deckSlots[side] = item.deck?.slice() || null; saveDeckSlots() }
    presetNotice = `「${item.name}」を${sideLabel(side)}に適用しました。${game ? '進行中の対戦には影響せず、次の新規対戦から使用します。' : '対戦を開始すると使用されます。'}`;
}
function exportNamedFormations() { downloadData('売ってないTCG_保存編成.json', JSON.stringify({ format: PRESET_FORMAT, exportedAt: new Date().toISOString(), formations: savedFormations }, null, 2)) }
function importNamedFormations(data) {
    const records = Array.isArray(data) ? data : data?.formations;
    if (data?.format && data.format !== PRESET_FORMAT) throw Error('未対応の保存形式です');
    const incoming = normalizePresets(records);
    let merged = new Map(savedFormations.map(p => [p.id, p])); for (let p of incoming) { const old = merged.get(p.id); if (!old || p.updatedAt >= old.updatedAt) merged.set(p.id, p) }
    if (merged.size > MAX_PRESETS) throw Error('取り込み後の編成が上限を超えます');
    savedFormations = [...merged.values()]; saveFormations(); presetNotice = `${incoming.length}件を読み込みました。現在の保存編成との重複は更新日時が新しい方を採用しました。`;
}
function renderPresetPage() {
    const edit = savedFormations.find(x => x.id === presetEditingId);
    const list = currentPresetNames();
    return `<section class="pagehead"><p class="eyebrow">SAVED SQUADS · LOCAL / GITHUB</p><h1>マイ編成 <span>${savedFormations.length}件保存</span></h1><p>収録カードと追加登録したカードから好きな6人を組み合わせ、名前を付けて複数保存できます。60枚デッキも必要に応じて一緒に保存し、青・赤どちらにも呼び出せます。</p></section>
 <section class="panel preset-workspace"><div class="section-top"><div><p class="eyebrow">BUILD & SAVE</p><h2>${edit ? '既存編成を更新' : '現在の6人を名前付きで保存'}</h2></div></div>
 <div class="preset-sides"><button data-act="presetSide" data-side="0" class="${presetSide === 0 ? 'active' : ''}">青チーム</button><button data-act="presetSide" data-side="1" class="${presetSide === 1 ? 'active' : ''}">赤 / AIチーム</button></div>
 <div class="preset-current-roster">${(config.picks[presetSide] || []).map(id => `<button class="roster-mini" data-act="detail" data-id="${id}">${escapeHTML(HERO_MAP[id]?.name || `No.${id}`)}</button>`).join('')}</div>
 <button class="small-outline" data-act="editor" data-side="${presetSide}">6人を選び直す →</button>
 <div class="preset-save-form"><label>編成名<input id="presetName" type="text" maxlength="60" placeholder="例：磁気×連撃の速攻チーム" value="${escapeHTML(edit?.name || '')}"></label>
 <label class="preset-checkbox"><input id="presetWithDeck" type="checkbox" ${edit?.includeDeck ? 'checked' : ''}> 現在の60枚デッキもセットで保存（未設定なら自動デッキ）</label></div>
 <div class="preset-actions"><button class="primary-btn" data-act="presetSave">${edit ? 'この編成を上書き保存' : '名前を付けて保存する'}</button>${edit ? '<button class="small-outline" data-act="presetCancelEdit">新規編成の登録に戻る</button>' : ''}<button class="small-outline" data-act="presetExport">全編成をJSONでバックアップ</button><label class="file-button">JSONを読み込む<input type="file" accept=".json,application/json" data-act="presetImportFile" hidden></label></div>
 ${presetNotice ? `<div class="notice" role="status">${escapeHTML(presetNotice)}</div>` : ''}</section>
 <section class="panel preset-library"><div class="section-top"><div><p class="eyebrow">MY FORMATION LIBRARY</p><h2>保存済みの編成</h2></div><span>${list.length}件</span></div>
 ${list.length ? `<div class="preset-grid">${list.map(p => `<article class="preset-card"><div class="preset-card-top"><span class="preset-key">6 CHARACTERS</span><span class="preset-date">${escapeHTML(new Date(p.updatedAt).toLocaleDateString('ja-JP'))}</span></div><h3>${escapeHTML(p.name)}</h3><p>${escapeHTML(presetText(p))}</p><div class="preset-card-sub">${p.includeDeck ? `60枚デッキ：${p.deck ? '保存済み' : '自動編成'}` : '6人編成のみ'}${presetAvailable(p) ? '' : ' · 未登録カードあり'}</div><div class="preset-buttons"><button class="small-outline" data-act="presetUse" data-id="${escapeHTML(p.id)}" data-side="0" ${!presetAvailable(p) ? 'disabled' : ''}>青で使う</button><button class="small-outline" data-act="presetUse" data-id="${escapeHTML(p.id)}" data-side="1" ${!presetAvailable(p) ? 'disabled' : ''}>赤で使う</button><button class="small-outline" data-act="presetEdit" data-id="${escapeHTML(p.id)}">上書き編集</button><button class="small-outline" data-act="presetRename" data-id="${escapeHTML(p.id)}">名前変更</button><button class="small-outline danger-button" data-act="presetDelete" data-id="${escapeHTML(p.id)}">削除</button></div></article>`).join('')}</div>` : '<div class="empty-preset">まだ編成がありません。上の6人を選び、名前を付けて保存してください。</div>'}</section>
 <section class="panel preset-cloud"><div class="section-top"><div><p class="eyebrow">GITHUB CLOUD BACKUP</p><h2>GitHubに同期</h2></div><span class="cloud-mark">任意</span></div>
 <p>GitHub Pagesで公開するだけではユーザーごとの編成は保存されません。自分のGitHubリポジトリ内のJSONファイルに、編成一覧をバックアップ・復元できます。</p>
 <div class="cloud-form"><label>所有者（GitHubユーザー名）<input id="cloudOwner" autocomplete="off" placeholder="your-name" value="${escapeHTML(cloudSettings.owner)}"></label><label>リポジトリ名<input id="cloudRepo" autocomplete="off" placeholder="uttenai-tcg" value="${escapeHTML(cloudSettings.repo)}"></label><label>ブランチ<input id="cloudBranch" autocomplete="off" placeholder="main" value="${escapeHTML(cloudSettings.branch)}"></label><label>保存先パス<input id="cloudPath" autocomplete="off" placeholder="data/tcg-formations.json" value="${escapeHTML(cloudSettings.path)}"></label></div>
 <label class="cloud-token-label">GitHubアクセストークン（必要な操作のときだけ入力）<input id="cloudToken" type="password" autocomplete="off" spellcheck="false" placeholder="画面上のみ。サイトには保存されません"></label>
 <div class="preset-actions"><button class="small-outline" data-act="cloudConfig">保存先設定だけ記憶</button><button class="small-outline" data-act="cloudPull" ${cloudBusy ? 'disabled' : ''}>クラウドから読み込む</button><button class="primary-btn" data-act="cloudPush" ${cloudBusy ? 'disabled' : ''}>GitHubへ保存する</button></div>
 ${cloudNotice ? `<div class="notice" role="status">${escapeHTML(cloudNotice)}</div>` : ''}
 <p class="cloud-note">トークンは毎回入力し、ページにもブラウザの保存領域にも記録しません。書き込みには対象リポジトリ限定の <b>Contents: Read and write</b> 権限が必要です。公開リポジトリのJSONは他人にも読めます。初めて既存データに書き込むときは先に「クラウドから読み込む」を実行してください。同期は手動です。</p></section>`;
}
function captureCloudSettings() {
    const s = { owner: $('#cloudOwner')?.value.trim() || '', repo: $('#cloudRepo')?.value.trim() || '', branch: $('#cloudBranch')?.value.trim() || 'main', path: $('#cloudPath')?.value.trim() || 'data/tcg-formations.json' };
    if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37})$/.test(s.owner)) throw Error('GitHubユーザー名が不正です');
    if (!/^[a-zA-Z0-9_.-]{1,100}$/.test(s.repo) || s.repo === '.' || s.repo === '..') throw Error('リポジトリ名が不正です');
    if (!/^[a-zA-Z0-9_./-]{1,120}$/.test(s.branch) || s.branch.startsWith('/') || s.branch.includes('..')) throw Error('ブランチ名が不正です');
    if (!/^[a-zA-Z0-9_./-]{1,180}\.json$/.test(s.path) || s.path.startsWith('/') || s.path.split('/').some(x => !x || x === '.' || x === '..')) throw Error('保存先は例: data/tcg-formations.json と入力してください');
    cloudSettings = s;
    try { localStorage.setItem(CLOUD_SETTINGS_KEY, JSON.stringify(s)) } catch (e) { }
    return s;
}
function cloudKey(s) { return `${s.owner.toLowerCase()}/${s.repo.toLowerCase()}@${s.branch}:${s.path}` }
function githubEndpoint(s) { return 'https://api.github.com/repos/' + encodeURIComponent(s.owner) + '/' + encodeURIComponent(s.repo) + '/contents/' + s.path.split('/').map(encodeURIComponent).join('/') }
function githubHeaders(token) { return { 'Accept': 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', ...(token ? { 'Authorization': 'Bearer ' + token } : {}) } }
function encodeGithubContent(content) { const u = new TextEncoder().encode(content); let str = ''; for (let i = 0; i < u.length; i += 8192)str += String.fromCharCode(...u.subarray(i, i + 8192)); return btoa(str) }
function decodeGithubContent(content) { let raw = atob(content.replace(/\s/g, '')); let bytes = Uint8Array.from(raw, c => c.charCodeAt(0)); return new TextDecoder().decode(bytes) }
async function readGithubFile(s, token) {
    let resp = await fetch(githubEndpoint(s) + '?ref=' + encodeURIComponent(s.branch), { headers: githubHeaders(token), cache: 'no-store' });
    if (resp.status === 404) return null;
    if (!resp.ok) throw Error(`GitHub読み込み失敗（HTTP ${resp.status}）${resp.status === 401 ? '：認証を確認してください' : resp.status === 403 ? '：アクセス権限またはAPI制限を確認してください' : ''}`);
    let json = await resp.json(); if (json.type !== 'file' || typeof json.content !== 'string' || !json.sha) throw Error('GitHub上のファイルを読み取れません。1MB以下のJSONファイルを指定してください');
    return { sha: json.sha, text: decodeGithubContent(json.content) };
}
function recordCloudSha(s, sha) { cloudLastSync = { key: cloudKey(s), sha }; try { localStorage.setItem(CLOUD_SYNC_KEY, JSON.stringify(cloudLastSync)) } catch (e) { } }
async function performGithubSync(action) {
    if (cloudBusy) return;
    let s = captureCloudSettings();
    // 入力欄のトークンは一時変数でのみ保持し、DOMから直ちに消す。
    let token = $('#cloudToken')?.value.trim() || ''; if ($('#cloudToken')) $('#cloudToken').value = '';
    if (action === 'push' && !token) throw Error('GitHubへの保存には、対象リポジトリへ書き込めるトークンを入力してください');
    cloudBusy = true; cloudNotice = 'GitHubに接続しています…'; render();
    try {
        if (location.protocol === 'file:' || location.protocol === 'http:') throw Error('クラウド同期はGitHub PagesなどのHTTPSで公開したページから操作してください（ローカルHTML・HTTPではJSONバックアップをご利用ください）。');
        let remote = await readGithubFile(s, token);
        if (action === 'pull') {
            if (!remote) { recordCloudSha(s, null); cloudNotice = 'まだクラウドファイルがありません。ローカル編成を保存できます。'; return }
            let parsed = JSON.parse(remote.text); if (parsed.format !== PRESET_FORMAT) throw Error('GitHubのJSONはこのゲームの編成保存ファイルではありません');
            let incoming = normalizePresets(parsed.formations);
            let map = new Map(savedFormations.map(x => [x.id, x])); for (let p of incoming) { let local = map.get(p.id); if (!local || p.updatedAt > local.updatedAt) map.set(p.id, p) }
            if (map.size > MAX_PRESETS) throw Error('同期すると最大保存数を超えます');
            savedFormations = [...map.values()]; saveFormations(); recordCloudSha(s, remote.sha);
            cloudNotice = `クラウドの${incoming.length}件を読み込み、ローカルと統合しました。登録済み：${savedFormations.length}件。`; return;
        }
        if (remote && !(cloudLastSync.key === cloudKey(s) && cloudLastSync.sha === remote.sha)) throw Error('クラウドに未取得の更新があります。先に「クラウドから読み込む」で内容を確認してください。上書きはしていません。');
        if (!remote && cloudLastSync.key === cloudKey(s) && cloudLastSync.sha) throw Error('クラウドファイルが削除されています。先に読み込み直してください。');
        let data = JSON.stringify({ format: PRESET_FORMAT, updatedAt: new Date().toISOString(), formations: savedFormations }, null, 2);
        let payload = { message: `Update TCG saved formations (${savedFormations.length})`, content: encodeGithubContent(data), branch: s.branch }; if (remote) payload.sha = remote.sha;
        let result = await fetch(githubEndpoint(s), { method: 'PUT', headers: { ...githubHeaders(token), 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!result.ok) throw Error(`GitHub保存失敗（HTTP ${result.status}）${result.status === 409 ? '：他の端末で先に更新された可能性があります。読み込み直してください' : ''}`);
        let body = await result.json(); recordCloudSha(s, body.content?.sha || null);
        cloudNotice = `GitHubへの保存に成功しました。${savedFormations.length}編成が ${s.owner}/${s.repo}/${s.path} に記録されました。`;
    } catch (e) { cloudNotice = 'エラー：' + e.message }
    finally { token = ''; cloudBusy = false; render() }
}
