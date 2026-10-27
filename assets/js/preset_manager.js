/* 名前付き6人編成：ローカル保存、JSONバックアップ。クラウド同期は account.js。 */
const PRESET_STORAGE_KEY='tcg_vivid_named_formations_v1';
const PRESET_FORMAT='uttenai-tcg-formations-v1';
const MAX_PRESETS=200;
let savedFormations=[],presetSide=0,presetEditingId=null,presetNotice='';

function newPresetId(){return typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():`f_${Date.now()}_${Math.random().toString(36).slice(2,12)}`}
function validPreset(p){
 if(!p||typeof p!=='object')return false;
 if(typeof p.id!=='string'||p.id.length>100||!p.id)return false;
 if(typeof p.name!=='string'||!p.name.trim()||p.name.trim().length>60)return false;
 if(!Array.isArray(p.ids)||p.ids.length!==6||new Set(p.ids).size!==6||!p.ids.every(n=>Number.isSafeInteger(n)&&n>0))return false;
 if(p.includeDeck!==undefined&&typeof p.includeDeck!=='boolean')return false;
 if(p.includeDeck===true&&p.deck!==null&&!validateDeckArray(p.deck))return false;
 if(p.createdAt!==undefined&&!Number.isFinite(p.createdAt))return false;
 if(p.updatedAt!==undefined&&!Number.isFinite(p.updatedAt))return false;
 return true;
}
function normalizePresets(input){
 if(!Array.isArray(input)||input.length>MAX_PRESETS)throw Error(`保存可能な編成は最大${MAX_PRESETS}件です`);
 let ids=new Set();return input.map(p=>{
  if(!validPreset(p))throw Error('編成データの形式、カード番号、またはデッキ条件が不正です');
  if(ids.has(p.id))throw Error('保存IDが重複しています');ids.add(p.id);
  return {id:p.id,name:p.name.trim(),ids:p.ids.slice(),includeDeck:!!p.includeDeck,deck:p.includeDeck?(p.deck?.slice()||null):null,createdAt:p.createdAt||Date.now(),updatedAt:p.updatedAt||Date.now()};
 });
}
function saveFormations(){
 try{localStorage.setItem(PRESET_STORAGE_KEY,JSON.stringify({format:PRESET_FORMAT,formations:savedFormations}));accountMarkDirty()}
 catch(e){presetNotice='保存に失敗しました。JSON書き出しでバックアップしてください。';throw e}
}
function initializeFormations(){
 try{
  let local=JSON.parse(localStorage.getItem(PRESET_STORAGE_KEY)||'null');
  savedFormations=normalizePresets(Array.isArray(local)?local:(local?.formations||[]));
 }catch(e){console.warn('保存編成の読込失敗',e);savedFormations=[];presetNotice='保存編成を読み込めませんでした。JSONバックアップから復元してください。'}

}
function currentPresetNames(){return savedFormations.slice().sort((a,b)=>b.updatedAt-a.updatedAt)}
function presetText(p){return p.ids.map(id=>HERO_MAP[id]?.name||`No.${id}（未登録）`).join(' / ')}
function presetAvailable(p){return p.ids.every(id=>!!HERO_MAP[id])}
function saveNamedFormation(name,side,includeDeck,editId){
 name=String(name||'').trim();if(!name||name.length>60)throw Error('編成名は1〜60文字で入力してください');
 let ids=config.picks[side]?.slice();if(!ids||ids.length!==6||new Set(ids).size!==6||ids.some(id=>!HERO_MAP[id]))throw Error('有効なキャラクターを重複なしで6人選んでください');
 let deck=includeDeck?(deckSlots[side]?.slice()||null):null;
 if(deck&&!validateDeckArray(deck))throw Error('保存対象の60枚デッキが不正です');
 const prev=editId?savedFormations.find(x=>x.id===editId):null;
 const item={id:prev?.id||newPresetId(),name,ids,includeDeck:!!includeDeck,deck,createdAt:prev?.createdAt||Date.now(),updatedAt:Date.now()};
 if(!prev&&savedFormations.length>=MAX_PRESETS)throw Error(`最大${MAX_PRESETS}編成までです`);
 if(prev)savedFormations=savedFormations.map(x=>x.id===prev.id?item:x);else savedFormations.unshift(item);
 saveFormations();presetEditingId=null;return item;
}
function useNamedFormation(id,side){
 const item=savedFormations.find(x=>x.id===id);
 if(!item)throw Error('保存した編成が見つかりません');
 if(!presetAvailable(item))throw Error('未登録のカードがあります。カード管理から該当カードを追加してください');
 config.picks[side]=item.ids.slice();saveConfig();
 if(item.includeDeck){deckSlots[side]=item.deck?.slice()||null;saveDeckSlots()}
 presetNotice=`「${item.name}」を${sideLabel(side)}に適用しました。${game?'進行中の対戦には影響せず、次の新規対戦から使用します。':'対戦を開始すると使用されます。'}`;
}
function exportNamedFormations(){downloadData('TCG_保存編成.json',JSON.stringify({format:PRESET_FORMAT,exportedAt:new Date().toISOString(),formations:savedFormations},null,2))}
function importNamedFormations(data){
 const records=Array.isArray(data)?data:data?.formations;
 if(data?.format&&data.format!==PRESET_FORMAT)throw Error('未対応の保存形式です');
 const incoming=normalizePresets(records);
 let merged=new Map(savedFormations.map(p=>[p.id,p]));for(let p of incoming){const old=merged.get(p.id);if(!old||p.updatedAt>=old.updatedAt)merged.set(p.id,p)}
 if(merged.size>MAX_PRESETS)throw Error('取り込み後の編成が上限を超えます');
 savedFormations=[...merged.values()];saveFormations();presetNotice=`${incoming.length}件を読み込みました。現在の保存編成との重複は更新日時が新しい方を採用しました。`;
}
function renderPresetPage(){
 const edit=savedFormations.find(x=>x.id===presetEditingId);
 const list=currentPresetNames();
 return `<section class="pagehead"><p class="eyebrow">SAVED SQUADS · ACCOUNT SYNC</p><h1>マイ編成 <span>${savedFormations.length}件保存</span></h1><p>好きな6人を組み合わせ、名前を付けて複数保存できます。60枚デッキも必要に応じて一緒に保存し、青・赤どちらにも呼び出せます。</p></section>
 <section class="panel preset-workspace"><div class="section-top"><div><p class="eyebrow">BUILD & SAVE</p><h2>${edit?'既存編成を更新':'現在の6人を名前付きで保存'}</h2></div></div>
 <div class="preset-sides"><button data-act="presetSide" data-side="0" class="${presetSide===0?'active':''}">青チーム</button><button data-act="presetSide" data-side="1" class="${presetSide===1?'active':''}">赤 / AIチーム</button></div>
 <div class="preset-current-roster">${(config.picks[presetSide]||[]).map(id=>`<button class="roster-mini" data-act="detail" data-id="${id}">${escapeHTML(HERO_MAP[id]?.name||`No.${id}`)}</button>`).join('')}</div>
 <button class="small-outline" data-act="editor" data-side="${presetSide}">6人を選び直す →</button>
 <div class="preset-save-form"><label>編成名<input id="presetName" type="text" maxlength="60" placeholder="例：磁気×連撃の速攻チーム" value="${escapeHTML(edit?.name||'')}"></label>
 <label class="preset-checkbox"><input id="presetWithDeck" type="checkbox" ${edit?.includeDeck?'checked':''}> 現在の60枚デッキもセットで保存（未設定なら自動デッキ）</label></div>
 <div class="preset-actions"><button class="primary-btn" data-act="presetSave">${edit?'この編成を上書き保存':'名前を付けて保存する'}</button>${edit?'<button class="small-outline" data-act="presetCancelEdit">新規編成の登録に戻る</button>':''}<button class="small-outline" data-act="presetExport">全編成をJSONでバックアップ</button><label class="file-button">JSONを読み込む<input type="file" accept=".json,application/json" data-act="presetImportFile" hidden></label></div>
 ${presetNotice?`<div class="notice" role="status">${escapeHTML(presetNotice)}</div>`:''}</section>
 <section class="panel preset-library"><div class="section-top"><div><p class="eyebrow">MY FORMATION LIBRARY</p><h2>保存済みの編成</h2></div><span>${list.length}件</span></div>
 ${list.length?`<div class="preset-grid">${list.map(p=>`<article class="preset-card"><div class="preset-card-top"><span class="preset-key">6 CHARACTERS</span><span class="preset-date">${escapeHTML(new Date(p.updatedAt).toLocaleDateString('ja-JP'))}</span></div><h3>${escapeHTML(p.name)}</h3><p>${escapeHTML(presetText(p))}</p><div class="preset-card-sub">${p.includeDeck?`60枚デッキ：${p.deck?'保存済み':'自動編成'}`:'6人編成のみ'}${presetAvailable(p)?'':' · 未登録カードあり'}</div><div class="preset-buttons"><button class="small-outline" data-act="presetUse" data-id="${escapeHTML(p.id)}" data-side="0" ${!presetAvailable(p)?'disabled':''}>青で使う</button><button class="small-outline" data-act="presetUse" data-id="${escapeHTML(p.id)}" data-side="1" ${!presetAvailable(p)?'disabled':''}>赤で使う</button><button class="small-outline" data-act="presetEdit" data-id="${escapeHTML(p.id)}">上書き編集</button><button class="small-outline" data-act="presetRename" data-id="${escapeHTML(p.id)}">名前変更</button><button class="small-outline danger-button" data-act="presetDelete" data-id="${escapeHTML(p.id)}">削除</button></div></article>`).join('')}</div>`:'<div class="empty-preset">まだ編成がありません。上の6人を選び、名前を付けて保存してください。</div>'}</section>
 ${renderAccountPanel()}`;
}
