/* コスト・補助カード60枚の編成。キャラクター6人のチーム編成とは別に管理する。 */
'use strict';
const DECK_STORAGE_KEY='tcg_vivid_decks_v1';
const DECK_ELEMENT_CARDS=['ほのおカード','葉っぱカード','水カード','やみカード','風カード','どくカード','ひかりカード'];
const DECK_CARD_TYPES=['1MP','2MP','3MP',...DECK_ELEMENT_CARDS,...SUPPORTS];
const DECK_CARD_INFO={
 '1MP':'1MP分の技コスト','2MP':'2MP分の技コスト','3MP':'3MP分の技コスト',
 'ほのおカード':'火属性の技に使用','葉っぱカード':'葉っぱ属性の技に使用','水カード':'水属性の技に使用',
 'やみカード':'やみ属性の技に使用','風カード':'風属性の技に使用','どくカード':'どく属性の技に使用','ひかりカード':'ひかり属性の技に使用',
 ...HELP
};
let deckSlots=[null,null];
let deckEditSide=0;
let deckDraft=null;
let deckNotice='';
function deckRecommended(ids){
 const list=buildDeck(ids);
 return deckToCounts(list);
}
function deckToCounts(cards){
 const counts=Object.fromEntries(DECK_CARD_TYPES.map(name=>[name,0]));
 for(const name of cards){if(Object.hasOwn(counts,name))counts[name]++}
 return counts;
}
function deckExpand(counts){return DECK_CARD_TYPES.flatMap(name=>Array(Number(counts[name])||0).fill(name))}
function validateDeckCounts(counts){
 let errors=[];
 if(!counts || typeof counts!=='object')return {valid:false,errors:['カード構成がありません'],total:0,mp:[0,0,0]};
 let total=0;
 for(const name of DECK_CARD_TYPES){const qty=counts[name];if(!Number.isInteger(qty)||qty<0||qty>60)errors.push(name+'の枚数が不正');else total+=qty}
 if(total!==60)errors.push('合計は60枚（現在'+total+'枚）');
 const mp=[counts['1MP'],counts['2MP'],counts['3MP']];
 if(mp.some(q=>!Number.isInteger(q)||q<0))errors.push('MPカードの値が不正');
 else if(mp[0]<mp[1] || mp[1]<mp[2])errors.push('1MP ≧ 2MP ≧ 3MP の条件を満たしていません');
 return {valid:!errors.length,errors,total,mp};
}
function validateDeckArray(data){
 if(!Array.isArray(data)||data.length!==60)return false;
 if(!data.every(name=>typeof name==='string'&&DECK_CARD_TYPES.includes(name)))return false;
 return validateDeckCounts(deckToCounts(data)).valid;
}
function initDeckBuilder(){
 try{
  const saved=JSON.parse(localStorage.getItem(DECK_STORAGE_KEY)||'null');
  if(Array.isArray(saved)&&saved.length===2){deckSlots=saved.map(x=>validateDeckArray(x)?x.slice():null)}
 }catch(e){console.warn('デッキ保存の読み込み失敗',e)}
 deckDraft=deckSlots[0]?deckToCounts(deckSlots[0]):deckRecommended(config.picks[0]);
}
function saveDeckSlots(){try{localStorage.setItem(DECK_STORAGE_KEY,JSON.stringify(deckSlots))}catch(e){deckNotice='ブラウザに保存できませんでした。JSONでバックアップしてください。'}if(typeof accountMarkDirty==='function')accountMarkDirty()}
function buildDeckForSide(side,ids){
 if(validateDeckArray(deckSlots[side]))return shuffled(deckSlots[side]);
 return buildDeck(ids);
}
function openDeckEditor(side,resetDraft){
 const next=side===1?1:0;
 if(resetDraft||deckDraft===null||deckEditSide!==next){
  deckEditSide=next;
  deckDraft=deckSlots[next]?deckToCounts(deckSlots[next]):deckRecommended(config.picks[next]);
  deckNotice='';
 }
 config.view='deck';
}
function changeDeckCount(name,delta){
 if(!DECK_CARD_TYPES.includes(name)||!Number.isInteger(delta))return;
 deckDraft[name]=Math.max(0,Math.min(60,(deckDraft[name]||0)+delta));
 deckNotice='';
}
function changeDeckAbsolute(name,raw){
 if(!DECK_CARD_TYPES.includes(name))return;
 const n=Number(raw);
 if(!Number.isFinite(n))return;
 deckDraft[name]=Math.max(0,Math.min(60,Math.trunc(n)));
 deckNotice='';
}
function importDeckFile(json){
 let target;
 if(Array.isArray(json))target=json;
 else if(json&&Array.isArray(json.cards))target=json.cards;
 else if(json&&Array.isArray(json.decks)){
  const arr=json.decks;
  if(arr.length!==2)throw Error('デッキの保存形式が不正です');
  let invalid=arr.find(x=>x!==null&&!validateDeckArray(x));
  if(invalid)throw Error('60枚またはMPの枚数条件が不正なデッキがあります');
  deckSlots=arr.map(x=>x?x.slice():null);
  saveDeckSlots();
  deckDraft=deckSlots[deckEditSide]?deckToCounts(deckSlots[deckEditSide]):deckRecommended(config.picks[deckEditSide]);
  deckNotice='青・赤チームの保存デッキを復元しました。現在の対戦には影響しません。';
  return;
 }else throw Error('デッキJSONの形式が認識できません');
 if(!validateDeckArray(target))throw Error('60枚、1MP≧2MP≧3MPの条件、カード名を確認してください');
 deckDraft=deckToCounts(target);
 deckNotice='デッキ60枚を読み込みました。「保存する」で次の対戦に適用できます。';
}
function deckTeamRequirements(side){
 return [...new Set(config.picks[side].flatMap(id=>HERO_MAP[id]?.skills?.flatMap(s=>s.special||[])||[]))].map(x=>x+'カード');
}
function deckItem(name){
 const count=deckDraft[name]||0;
 return `<div class="deck-item"><div class="deck-item-label"><b>${escapeHTML(name)}</b><small>${escapeHTML(DECK_CARD_INFO[name]||'カード')}</small></div><div class="deck-qty"><button type="button" data-act="deckStep" data-card="${escapeHTML(name)}" data-delta="-1" aria-label="${escapeHTML(name)}を1枚減らす" ${count===0?'disabled':''}>−</button><input type="number" data-act="deckCount" data-card="${escapeHTML(name)}" inputmode="numeric" min="0" max="60" value="${count}" aria-label="${escapeHTML(name)}の枚数"><button type="button" data-act="deckStep" data-card="${escapeHTML(name)}" data-delta="1" aria-label="${escapeHTML(name)}を1枚増やす" ${count===60?'disabled':''}>＋</button></div></div>`;
}
function renderDeckEditor(){
 if(!deckDraft)openDeckEditor(0,true);
 const res=validateDeckCounts(deckDraft),requirements=deckTeamRequirements(deckEditSide);
 const missing=requirements.filter(x=>!deckDraft[x]);
 const totalStyle=res.total===60?'okay':res.total>60?'too-many':'short';
 const outline=`<div class="deck-summary"><div class="deck-number ${totalStyle}"><span>デッキ枚数</span><strong>${res.total}<em> / 60枚</em></strong><div class="deck-progress"><i style="width:${Math.min(res.total/60*100,100)}%"></i></div></div><div class="deck-summary-stat"><small>MP構成</small><b>${res.mp.join(' / ')}</b><span>1MP / 2MP / 3MP</span></div><div class="deck-summary-stat"><small>属性カード</small><b>${DECK_ELEMENT_CARDS.reduce((sum,n)=>sum+deckDraft[n],0)}枚</b><span>7属性から配分</span></div><div class="deck-summary-stat"><small>補助カード</small><b>${SUPPORTS.reduce((sum,n)=>sum+deckDraft[n],0)}枚</b><span>1ターンに1枚使用可能</span></div></div>`;
 return `<section class="pagehead"><p class="eyebrow">60-CARD DECK WORKSHOP</p><h1>デッキ編成 <span>60枚を自由に構築</span></h1><p>キャラクターの6人編成とは別に、技の支払いに使うMP・特殊コストと補助カードを選びます。作成した構成は次の対戦開始時にシャッフルして使用します。</p></section>
 <section class="deck-toolbar panel"><div class="deck-side-switch"><button type="button" data-act="deckSide" data-side="0" class="${deckEditSide===0?'active':''}">青チーム <small>${deckSlots[0]?'カスタム':'自動'}</small></button><button type="button" data-act="deckSide" data-side="1" class="${deckEditSide===1?'active':''}">赤 / AIチーム <small>${deckSlots[1]?'カスタム':'自動'}</small></button></div><div class="deck-head-actions"><button type="button" class="small-outline" data-act="deckAuto">おすすめ配分</button><button type="button" class="small-outline" data-act="deckZero">すべて0枚</button></div></section>
 ${outline}
 ${deckNotice?`<div class="notice" role="status">${escapeHTML(deckNotice)}</div>`:''}
 ${res.errors.length?`<div class="deck-invalid" role="alert"><strong>修正が必要</strong>　${escapeHTML(res.errors.join('／'))}</div>`:`<div class="deck-valid"><strong>編成条件を満たしています。</strong> 対戦用デッキとして保存できます。</div>`}
 ${missing.length?`<div class="deck-warning"><b>技に必要なカードがありません：</b>${escapeHTML(missing.join('、'))}。このままでも保存できますが、該当する持ち技の発動には注意してください。</div>`:''}
 <div class="deck-layout"><div class="deck-main"><section class="panel deck-section"><div class="section-top"><div><p class="eyebrow">MANA</p><h2>MPカード</h2></div><small>1MP ≧ 2MP ≧ 3MP</small></div><div class="deck-list">${['1MP','2MP','3MP'].map(deckItem).join('')}</div></section>
 <section class="panel deck-section"><div class="section-top"><div><p class="eyebrow">SPECIAL COST</p><h2>特殊コストカード</h2></div><small>技の属性コスト</small></div><div class="deck-list">${DECK_ELEMENT_CARDS.map(deckItem).join('')}</div></section></div>
 <section class="panel deck-section"><div class="section-top"><div><p class="eyebrow">SUPPORT</p><h2>補助カード</h2></div><small>公式新版の11種類</small></div><div class="deck-list">${SUPPORTS.map(deckItem).join('')}</div></section></div>
 <section class="panel deck-save-panel"><div class="deck-save-info"><h2>${sideLabel(deckEditSide)}に適用</h2><p>「保存する」で、このチームの60枚をブラウザに保存します。現在進行中の対戦にある山札・手札は変更されません。</p><p class="muted">カスタム未登録時は、選んだキャラクターの持ち技から作ったデッキを自動使用します。</p></div><div class="deck-save-actions"><button class="primary-btn" data-act="deckSave" ${res.valid?'':'disabled'}>この60枚を保存する</button><button class="small-outline" data-act="deckCopy" ${res.valid?'':'disabled'}>もう一方のチームへコピー</button><button class="small-outline" data-act="deckReset">自動編成に戻す</button></div></section>
 <section class="panel deck-transfer"><h2>デッキをバックアップ・復元</h2><p>青・赤両方の保存デッキをJSONとして書き出せます。別のブラウザに移す場合も使用できます。</p><div class="deck-transfer-actions"><button class="small-outline" data-act="deckExport">デッキをJSONで保存</button><label class="file-button">JSONを読み込む<input type="file" accept=".json,application/json" data-act="deckImportFile" hidden></label></div></section>`;
}
