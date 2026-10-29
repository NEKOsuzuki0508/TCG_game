/* カード管理：ローカル保存 / 手入力 / 公式リスト・JSON一括取り込み */
const USER_CARD_KEY='tcg_user_cards_v2';
const MAX_IMPORTED_CARDS=500;
const EFFECT_LABELS={manual:'手動裁定（説明文を見て操作）',damage:'単体ダメージ（ぼうぎょ適用）',true_damage:'単体確定ダメージ',heal:'味方HP回復',draw:'MP・カードをドロー',armor_light:'軽甲付与',armor_heavy:'重甲付与',burn:'やけど付与',poison:'どく付与',sleep:'ねむり付与',buff_attack:'こうげき強化',buff_defense:'ぼうぎょ強化',buff_speed:'すばやさ強化',shield:'次に受けるダメージを軽減'};
const TRAIT_LABELS={manual:'説明文のみ（対戦中に手動裁定）',none:'効果なし',triple35:'通常攻撃を35％×3回（10刻みに四捨五入）',opening_draw:'開戦時にカードを1枚引く',opening_armor:'開戦時に全味方へ軽甲・重甲',enter_draw:'初出場時にカードを1枚引く',enter_shield:'初出場時に味方出場者の次の被ダメージ−20',enter_heal:'初出場時に味方出場者のHP＋10'};
// v3: Official source is built-in (No.1–91); move the 36 legacy unofficial IDs to 1000–1035.
// Backup old saves before upgrading; never overwrite arbitrary user-created cards.
const SCHEMA_V3_KEY='tcg_card_numbers_schema_v3';
function migrationId(x){return Number.isInteger(x)&&x>=88&&x<=123?x+912:x}
function migrateOldBrowserData(){
 try{
  if(localStorage.getItem(SCHEMA_V3_KEY))return;
  for(const key of [USER_CARD_KEY,'tcg_vivid_config','tcg_vivid_state_v1']){
   const raw=localStorage.getItem(key);if(raw!==null)try{localStorage.setItem(key+'_before_1000_migration',raw)}catch(err){}
  }
  const saved=JSON.parse(localStorage.getItem(USER_CARD_KEY)||'[]');
  if(Array.isArray(saved)){
   // Cards 1–91 now come from the latest official source, so archived former copies are cleared.
   const keep=saved.filter(c=>!(Number.isInteger(c?.id)&&c.id>=1&&c.id<=91&&c.origin==='公式カード'));
   localStorage.setItem(USER_CARD_KEY,JSON.stringify(keep));
  }
  const cfg=JSON.parse(localStorage.getItem('tcg_vivid_config')||'null');
  if(cfg&&Array.isArray(cfg.picks)){
   cfg.picks=cfg.picks.map(ids=>Array.isArray(ids)?ids.map(migrationId):ids);
   localStorage.setItem('tcg_vivid_config',JSON.stringify(cfg));
  }
  const match=JSON.parse(localStorage.getItem('tcg_vivid_state_v1')||'null');
  if(match?.players?.length===2){
   // Only migrate a saved old-battle instance if old No.88–123 actually denotes our unofficial hero.
   const oldNames=['ルネ','フランカ','ミヤ','アステル','レニア','ドーガ'];
   const hasLegacy=match.players.some(p=>p.team?.some(c=>c.id>=88&&c.id<=123&&c.id<94&&oldNames.includes(c.name))) ||
      match.players.some(p=>p.team?.some(c=>c.id>=94&&c.id<=123));
   if(hasLegacy){
    const remap=(x)=>{
     if(Array.isArray(x))return x.map(remap);
     if(x&&typeof x==='object'){
      const out={};for(const [key,v] of Object.entries(x)){
       const newKey=key.replace(/([01]_)(\d{2,3})(?!\d)/g,(all,prefix,old)=>prefix+migrationId(Number(old)));
       out[newKey]=key==='id'&&Number.isInteger(v)?migrationId(v):remap(v);
      }return out;
     }
     if(typeof x==='string')return x.replace(/([01]_)(\d{2,3})(?!\d)/g,(all,prefix,old)=>prefix+migrationId(Number(old)));
     return x;
    };
    localStorage.setItem('tcg_vivid_state_v1',JSON.stringify(remap(match)));
   }
  }
  localStorage.setItem(SCHEMA_V3_KEY,'done');
 }catch(e){console.warn('以前のカード登録データの移行は完了しませんでした',e)}
}
migrateOldBrowserData();
function readUserCards(){try{let data=JSON.parse(localStorage.getItem(USER_CARD_KEY)||'[]');return Array.isArray(data)?data.filter(c=>c&&Number.isInteger(c.id)&&c.id>0&&c.name&&Array.isArray(c.skills)).slice(0,MAX_IMPORTED_CARDS):[]}catch(e){return []}}
let USER_CARDS=readUserCards();
function syncCardDatabase(){const prior=Object.fromEntries(CARD_DATA.map(c=>[c.id,c]));let baseline=CARD_DATA.filter(c=>!c.userAdded);for(let c of USER_CARDS){let ix=baseline.findIndex(x=>x.id===c.id);if(ix>=0)continue;baseline.push({...c,userAdded:true})}CARD_DATA=baseline.sort((a,b)=>a.id-b.id);if(typeof HERO_MAP!=='undefined'){for(let id of Object.keys(HERO_MAP))delete HERO_MAP[id];for(let c of CARD_DATA)HERO_MAP[c.id]=c}}
syncCardDatabase();
let managePanel='list',editingCard=null,manageNotice='',manageSearch='',pasteDraft='';
function safeHTML(s){return String(s??'').replace(/[&<>"']/g,t=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[t]))}
function cleanCard(c){let n=Number(c.id);if(!Number.isInteger(n)||n<1||n>99999)throw Error('カード番号は1〜99999の整数にしてください');let origin=String(c.origin||'非公式追加');if(n<1000&&origin!=='公式カード')throw Error('非公式追加カードはNo.1000以上にしてください。公式カードは出典を「公式カード」に設定してください。');let name=String(c.name??'').trim();if(!name||name.length>90)throw Error('カード名を1〜90文字で入力してください');
 const stats={};for(let k of ['hp','attack','defense','speed']){let v=Number(c[k]);if(!Number.isFinite(v)||!Number.isInteger(v)||v<0||v>9999||(k==='hp'&&v===0))throw Error(name+' の '+k+' が不正です');stats[k]=v}
 const skills=Array.isArray(c.skills)?c.skills:[];if(skills.length>12)throw Error('1枚の持ち技は12個まで');let formatted=skills.map((s,i)=>{let label=String(s.name||'').trim();if(!label)throw Error(name+' の技'+(i+1)+'に名前がありません');let cost=Number(s.cost??0);if(!Number.isInteger(cost)||cost<0||cost>99)throw Error(label+' のMPコストが不正');let effect=s.effect||{type:'manual',value:0},type=EFFECT_LABELS[effect.type]?effect.type:'manual';return {name:label.slice(0,90),cost,special:Array.isArray(s.special)?s.special.filter(x=>['ほのお','葉っぱ','水','やみ','風','どく','ひかり'].includes(x)):[],costText:String(s.costText||'').slice(0,120),desc:String(s.desc||'').slice(0,1800),target:['enemy','ally','self','none'].includes(s.target)?s.target:'enemy',effect:{type,value:Math.max(0,Math.min(9999,Math.floor(Number(effect.value)||0)))}}});
 return {...stats,id:n,name,origin:origin.slice(0,60),faction:String(c.faction||'基本カード').slice(0,60),archetype:String(c.archetype||'基本カード').slice(0,60),role:String(c.role||'追加カード').slice(0,80),desc:String(c.desc||'').slice(0,3000),traitName:String(c.traitName||'とくせい').slice(0,100),trait:String(c.trait||'').slice(0,3000),traitEffect:TRAIT_LABELS[c.traitEffect]?c.traitEffect:'manual',skills:formatted,userAdded:true};
}
function commitUserCards(incoming){if(!Array.isArray(incoming))throw Error('カード配列がありません');if(incoming.length>MAX_IMPORTED_CARDS)throw Error('一度の取り込み上限は500枚です');let seen=new Set(),valid=[];
 for(let raw of incoming){let c=cleanCard(raw);if(seen.has(c.id))throw Error('No.'+c.id+' が重複しています');seen.add(c.id);if(CARD_DATA.some(x=>x.id===c.id&&!x.userAdded))throw Error('No.'+c.id+' は初期収録カードです。番号を変更してください');valid.push(c)}
 let merged=new Map(USER_CARDS.map(c=>[c.id,c]));valid.forEach(c=>merged.set(c.id,c));if(merged.size>MAX_IMPORTED_CARDS)throw Error('保存上限は500枚です');let data=[...merged.values()].sort((a,b)=>a.id-b.id);
 try{localStorage.setItem(USER_CARD_KEY,JSON.stringify(data))}catch(e){throw Error('ブラウザへの保存に失敗しました。容量またはプライベートモードを確認してください。')}
 USER_CARDS=data;syncCardDatabase();manageNotice=valid.length+'枚のカードを登録しました。編成編集画面から対戦に追加できます。';return valid.length;
}
function deleteUserCard(id){if(!USER_CARDS.some(c=>c.id===id))return;let fresh=USER_CARDS.filter(c=>c.id!==id);try{localStorage.setItem(USER_CARD_KEY,JSON.stringify(fresh))}catch(e){throw Error('保存できませんでした')};USER_CARDS=fresh;syncCardDatabase();if(typeof config!=='undefined'){config.picks=config.picks.map(ids=>ids.includes(id)?FORMATIONS[0].ids.slice():ids);saveConfig()}if(typeof game!=='undefined'&&game)manageNotice='進行中の対戦を続ける場合、既存のカード効果の参照に注意してください。'}
function nextUnusedCardId(){let n=1036;while(CARD_DATA.some(c=>c.id===n))n++;return n}
function makeBlankCard(){return {id:nextUnusedCardId(),name:'',origin:'非公式追加',faction:'基本カード',archetype:'基本カード',role:'追加キャラクター',desc:'',hp:160,attack:50,defense:50,speed:50,traitName:'',trait:'',traitEffect:'manual',skills:[{name:'',cost:2,special:[],desc:'',target:'enemy',effect:{type:'damage',value:60}}]}}
function guessFromSkillText(desc){const d=String(desc||'').trim().replace(/。$/,'');let m=d.match(/^敵(?:に|1人に|１人に|1体に)\s*(確定)?\s*(\d+)\s*ダメージ$/);if(m)return{target:'enemy',effect:{type:m[1]?'true_damage':'damage',value:Number(m[2])}};m=d.match(/^(?:味方|自分)\s*(?:1人|１人)?の?HPを?(\d+)回復$/);if(m)return{target:'ally',effect:{type:'heal',value:Number(m[1])}};return {target:/山札から/.test(d)&&!/敵|味方/.test(d)?'none':/味方|自分/.test(d)&&!/敵/.test(d)?'ally':'enemy',effect:{type:'manual',value:0}}}
function parseOfficialText(text){const source=String(text).replace(/\r\n?/g,'\n');const hs=[...source.matchAll(/^No\.\s*(\d+)[　\t ]+(.+)$/gm)];if(!hs.length)throw Error('「No.1　名前」の形式が見つかりません。公式カードリストの本文を貼り付けてください。');let cards=[],warnings=[];
 for(let ix=0;ix<hs.length;ix++){let h=hs[ix],id=Number(h[1]),name=h[2].trim(),part=source.slice(h.index+h[0].length,ix+1<hs.length?hs[ix+1].index:source.length),lines=part.split('\n').map(x=>x.trim()).filter(Boolean),stats=part.match(/HP\s*[:：]\s*(\d+)\s+こうげき\s*[:：]?\s*(\d+)\s+ぼうぎょ\s*[:：]\s*(\d+)\s+すばやさ\s*[:：]\s*(\d+)/);
 if(!stats){warnings.push('No.'+id+'：ステータスを読み取れずスキップ');continue}let card={id,name,origin:id>=1000?'非公式追加':'公式カード',faction:'基本カード',archetype:'基本カード',role:'追加カード',desc:'',hp:Number(stats[1]),attack:Number(stats[2]),defense:Number(stats[3]),speed:Number(stats[4]),traitName:'とくせい',trait:'',traitEffect:'manual',skills:[]};
 for(const line of lines){if(/^HP\s*[:：]/.test(line))continue;if(/^とくせい/.test(line)){let m=line.match(/^とくせい\s*[:：]\s*([^（(]+)\s*[（(](.*)$/);if(m){card.traitName=m[1].trim();card.trait=m[2].replace(/[）)]$/,'')}else card.trait=line;continue}
 if(/^[・●]/.test(line)){let m=line.match(/^[・●]\s*(.*?)\s*[（(]\s*(\d+)\s*MP(.*)$/);if(m){let extra=m[3].trim(),sp=[...extra.matchAll(/(ほのお|葉っぱ|水|やみ|風|どく|ひかり)カード/g)].map(x=>x[1]);let d=extra.replace(/^\s*(?:\+\s*(?:ほのお|葉っぱ|水|やみ|風|どく|ひかり)カード)+\s*/,'').replace(/^[,，]\s*/,'').replace(/[）)]$/,'');let guess=guessFromSkillText(d);card.skills.push({name:m[1].trim(),cost:Number(m[2]),special:sp,desc:d,target:guess.target,effect:guess.effect})}else if(card.skills.length){card.skills.at(-1).desc+=' '+line}else warnings.push('No.'+id+'：技の行を解釈できません');continue}
 if(!card.trait)card.desc+=(card.desc?'\n':'')+line;else if(card.skills.length)card.skills.at(-1).desc+=' '+line}
 cards.push(card)}if(!cards.length)throw Error('取り込めるカードがありません');return {cards,warnings};
}
function downloadData(name,data,type='application/json'){let blob=new Blob([data],{type:type+';charset=utf-8'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1200)}
function specialSelection(items){return ['ほのお','葉っぱ','水','やみ','風','どく','ひかり'].map(s=>`<label class="special-check"><input type="checkbox" name="sp_${s}" ${items.includes(s)?'checked':''}>${s}</label>`).join('')}
function manageSkillRow(s,i){return `<div class="skill-edit"><div class="boxheading"><strong>持ち技 <span class="skill-order">${i+1}</span></strong><button type="button" class="small-outline" data-act="removeSkill">削除</button></div><div class="manage-cols"><label>技の名前<input name="skillName" value="${safeHTML(s.name||'')}" required></label><label>必要MP<input type="number" name="skillCost" min="0" max="99" value="${s.cost??2}"></label></div><label>必要な特殊コスト（複数選択可）<div class="special-checks">${specialSelection(s.special||[])}</div></label><label>技の説明<textarea name="skillDesc" rows="2">${safeHTML(s.desc||'')}</textarea></label><div class="manage-cols"><label>対象<select name="skillTarget">${[['enemy','敵1人'],['ally','味方1人'],['self','自身'],['none','対象なし']].map(([key,label])=>`<option value="${key}" ${key===(s.target||'enemy')?'selected':''}>${label}</option>`).join('')}</select></label><label>自動処理の種類<select name="skillEffect">${Object.entries(EFFECT_LABELS).map(([key,label])=>`<option value="${key}" ${key===(s.effect?.type||'manual')?'selected':''}>${label}</option>`).join('')}</select></label></div><label>効果値（ダメージ・回復量等）<input type="number" name="skillValue" min="0" max="9999" value="${s.effect?.value??0}"></label></div>`}
function renderManager(){const e=editingCard;
 let header=`<section class="pagehead"><p class="eyebrow">CARD DATABASE EDITOR</p><h1>カード管理 <span>公式${OFFICIAL_SEED.length}枚・非公式36枚・追加${USER_CARDS.length}枚</span></h1><p>ゲームのカードデータをブラウザ上で追加・編集できます。公式カードのテキストをそのまま貼り付けるか、フォームから作成してください。</p></section>${manageNotice?`<div class="notice">${safeHTML(manageNotice)}</div>`:''}<div class="manager-tabs"><button data-act="manageTab" data-val="list" class="${managePanel==='list'?'on':''}">登録済み</button><button data-act="manageTab" data-val="edit" class="${managePanel==='edit'?'on':''}">1枚ずつ入力</button><button data-act="manageTab" data-val="import" class="${managePanel==='import'?'on':''}">まとめて取り込み</button></div>`;
 if(managePanel==='list'){let rows=USER_CARDS.filter(c=>!manageSearch||(`${c.name} ${c.id} ${c.traitName}`).includes(manageSearch));return header+`<section class="panel"><div class="section-top"><h2>登録したカード（${rows.length}枚）</h2><button class="primary-btn" data-act="newCard">＋ 新しいカード</button></div><div class="manager-tools"><input data-act="manageSearch" placeholder="名前・番号で検索" value="${safeHTML(manageSearch)}"><button class="small-outline" data-act="exportCards">JSONでバックアップ</button></div><div class="manager-list">${rows.length?rows.map(c=>`<div class="manager-entry"><div><small>No.${c.id}　${safeHTML(c.origin)}</small><b>${safeHTML(c.name)}</b><span>${safeHTML(c.traitName)} · 技${c.skills.length}個 ${c.skills.some(s=>s.effect?.type==='manual')?'<em>手動裁定あり</em>':'<em>技を自動処理可能</em>'}</span></div><div class="manager-entry-actions"><button data-act="editUser" data-id="${c.id}">編集</button><button data-act="deleteUser" data-id="${c.id}" class="danger-button">削除</button></div></div>`).join(''):'<p class="muted">追加カードはまだありません。公式No.1〜91は標準収録済みです。新しいカードを追加する場合は「まとめて取り込み」へ。</p>'}</div></section>`}
 if(managePanel==='import')return header+`<section class="panel"><h2>公式カード：新版ソースを標準収録</h2><p class="muted">「基本ルールとカードリスト2.txt」を正本として、No.1〜91 の公式カードを初期搭載しています。以前の公式87人を再登録する必要はありません。No.92は元のソースに情報がないため登録していません。</p><div class="import-summary"><strong>公式カード91枚</strong><span>持ち技259個 / 図鑑と編成選択に反映済み</span><button class="primary-btn" data-act="importOfficial">公式カードの図鑑を見る</button></div><h3>追加分をテキストで一括登録</h3><p class="muted">今後の公式カードは「No.92　名前」から、非公式カードはNo.1036以降で登録してください。公式以外は出典欄を「非公式追加」にします。</p><textarea id="pasteCardText" class="paste-area" rows="9" placeholder="No.92　新しい公式キャラクター&#10;紹介文&#10;HP: 160　こうげき: 50　ぼうぎょ: 50　すばやさ: 60&#10;とくせい：先手必勝（…）&#10;・一撃（2MP, 敵に60ダメージ）">${safeHTML(pasteDraft)}</textarea><div class="manager-actions"><button class="primary-btn" data-act="importText">本文から取り込む</button><label class="file-button">TXTファイルを選択<input id="cardTextFile" type="file" accept=".txt,text/plain" data-act="importTextFile" hidden></label></div><h3>JSONで移行・復元する</h3><p class="muted">ユーザーが追加したカードのみ書き出し・読み込みできます。標準収録127人を上書きすることはできません。</p><div class="manager-actions"><label class="file-button">JSONファイルを取り込む<input id="cardJsonFile" type="file" accept=".json,application/json" data-act="importJsonFile" hidden></label><button class="small-outline" data-act="exportCards">追加カードをJSONで保存</button></div><p class="manager-warning">※ 変動コスト・技のコピーなど自動処理できない効果は、原文を保持して手動裁定になります。</p></section>`;

 let c=e||makeBlankCard();return header+`<form id="cardManageForm" class="panel manage-form"><div class="boxheading"><h2>${USER_CARDS.some(x=>x.id===c.id)?'カード編集':'新しいカードの登録'}</h2><button type="button" class="small-outline" data-act="newCard">空のカードを作る</button></div><div class="manage-cols"><label>カードNo.<input type="number" name="id" min="1" max="99999" required value="${c.id}"></label><label>名前<input name="name" required maxlength="90" value="${safeHTML(c.name)}"></label></div><div class="manage-cols"><label>出典・分類<input name="origin" value="${safeHTML(c.origin||'非公式追加')}"></label><label>編成・系統<input name="archetype" value="${safeHTML(c.archetype||'基本カード')}"></label></div><label>キャラクター紹介<textarea name="desc" rows="2">${safeHTML(c.desc||'')}</textarea></label><div class="stat-edit-grid">${[['hp','HP'],['attack','こうげき'],['defense','ぼうぎょ'],['speed','すばやさ']].map(([k,v])=>`<label>${v}<input type="number" min="0" max="9999" name="${k}" value="${c[k]}" required></label>`).join('')}</div><div class="manage-cols"><label>とくせい名<input name="traitName" value="${safeHTML(c.traitName||'')}"></label><label>とくせいの処理<select name="traitEffect">${Object.entries(TRAIT_LABELS).map(([key,label])=>`<option value="${key}" ${key===c.traitEffect?'selected':''}>${label}</option>`).join('')}</select></label></div><label>とくせいの説明<textarea name="trait" rows="3">${safeHTML(c.trait||'')}</textarea></label><div class="boxheading"><h3>持ち技</h3><button type="button" class="small-outline" data-act="addSkill">＋ 技を追加</button></div><div id="manageSkillRows">${(c.skills||[]).map((s,i)=>manageSkillRow(s,i)).join('')}</div><div class="manager-actions"><button class="primary-btn" type="submit">このカードを保存する</button><button type="button" class="small-outline" data-act="manageTab" data-val="list">一覧に戻る</button></div><p class="muted">複雑なとくせいや技は文章を保持し、「手動裁定」で対戦中に処理できます。標準収録127人は編集できません。</p></form>`;
}
function captureManageForm(){let root=document.querySelector('#cardManageForm');if(!root)throw Error('入力フォームが見つかりません');const f=new FormData(root),skills=[];for(let row of root.querySelectorAll('.skill-edit')){const get=n=>row.querySelector(`[name="${n}"]`);const val=n=>get(n)?.value;skills.push({name:val('skillName'),cost:Number(val('skillCost')||0),special:[...row.querySelectorAll('input[type="checkbox"]:checked')].map(x=>x.name.slice(3)),desc:val('skillDesc'),target:val('skillTarget'),effect:{type:val('skillEffect'),value:Number(val('skillValue')||0)}})}return {id:Number(f.get('id')),name:f.get('name'),origin:f.get('origin'),faction:'基本カード',archetype:f.get('archetype'),role:'追加キャラクター',desc:f.get('desc'),hp:Number(f.get('hp')),attack:Number(f.get('attack')),defense:Number(f.get('defense')),speed:Number(f.get('speed')),traitName:f.get('traitName'),trait:f.get('trait'),traitEffect:f.get('traitEffect'),skills}}
