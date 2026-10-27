/* TCG ブラウザ対戦エンジン */
'use strict';
const FORMATIONS=[
  {key:'mag',name:'陸軍｜磁気波動',ids:[1000,1001,1002,1003,1004,1005],color:'#77e9e5'},
  {key:'counter',name:'陸軍｜反撃',ids:[1006,1007,1008,1009,1010,1011],color:'#ffb880'},
  {key:'spread',name:'海軍｜大盾・拡散',ids:[1012,1013,1014,1015,1016,1017],color:'#8da8ff'},
  {key:'status',name:'海軍｜状態異常',ids:[1018,1019,1020,1021,1022,1023],color:'#c6a7fc'},
  {key:'burn',name:'空軍｜燃焼',ids:[1024,1025,1026,1027,1028,1029],color:'#ff8e7b'},
  {key:'combo',name:'空軍｜通常攻撃・連撃',ids:[1030,1031,1032,1033,1034,1035],color:'#f9dc79'}
];
const SUPPORTS=['いずみのみず','にがいお茶','つちのかたまり','かみなりのたね','かんぽうゼリー','流れる魔力','止められた魔力','まほうの甲冑','ひらめきの一手','ヒメアオホノカ','市販結界装置'];
const HERO_MAP=Object.fromEntries(CARD_DATA.map(c=>[c.id,c]));
const TARG={1000:["enemy"],1001:["enemy"],1002:["enemy"],1003:["enemy"],1004:["ally"],1005:["enemy"],1006:["enemy"],1007:["enemy"],1008:["enemy"],1009:["enemy"],1010:["ally"],1011:["enemy"],1012:["enemy"],1013:["enemy"],1014:["enemy"],1015:["enemy"],1016:["enemy"],1017:["enemy"],1018:["enemy"],1019:["enemy"],1020:["enemy"],1021:["enemy"],1022:["enemy"],1023:["enemy"],1024:["enemy"],1025:["enemy"],1026:["enemy"],1027:["enemy"],1028:["ally"],1029:["enemy"],1030:["enemy"],1031:["enemy"],1032:["enemy"],1033:["enemy"],1034:["enemy"],1035:["enemy"]};
const HELP={
'いずみのみず':'味方1人のHP+30','にがいお茶':'味方1人の次の攻撃ダメージ+30','つちのかたまり':'味方1人のぼうぎょ+30（このターン）','かみなりのたね':'味方1人のすばやさ+30（このターン）','かんぽうゼリー':'味方1人の状態異常を1つ解除','流れる魔力':'このターン味方の技必要MP−1','止められた魔力':'このターン敵の技必要MP+1','まほうの甲冑':'このターン味方フィールド全員の敵攻撃を防ぐ（1戦1回）','ひらめきの一手':'手札をランダム1枚捨て、1枚引く','ヒメアオホノカ':'味方フィールド全員のHP+10（簡易裁定）','市販結界装置':'味方1人への次の攻撃を無効化。やみカードを使う攻撃は半減'};
const $=(q)=>document.querySelector(q);
const escapeHTML=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rand=n=>Math.floor(Math.random()*n);
const roll=p=>Math.random()<p;
const shuffled=a=>{let r=a.slice();for(let i=r.length-1;i>0;i--){const k=rand(i+1);[r[i],r[k]]=[r[k],r[i]]}return r};
let config={mode:'ai',picks:[FORMATIONS[0].ids.slice(),FORMATIONS[4].ids.slice()],activeSide:0,view:'battle',showDetails:null,editorSide:null};
let game=null;let selected=null;let waiting=false;let lastOutcome='';let armoredResolver=null;
const LSKEY='tcg_match_adjusted_v4';
function log(line){if(!game)return;game.log.unshift(line);game.log=game.log.slice(0,110)}
function ownerOf(h){return game.players.findIndex(s=>s.team.includes(h))}
function field(side){return game.players[side].field.map(uid=>game.players[side].team.find(h=>h.uid===uid)).filter(h=>h && h.hp>0)}
function bench(side){return game.players[side].team.filter(h=>h.hp>0&&!game.players[side].field.includes(h.uid))}
function alive(side){return game.players[side].team.filter(h=>h.hp>0)}
function others(side){return field(1-side)}
function teammate(h){return field(ownerOf(h))}
function heroName(h){return h?.name||'対象'}
function mkRuntime(id,side){let c=HERO_MAP[id];return {uid:side+'_'+id,id,name:c.name,maxHp:c.hp,hp:c.hp,baseA:c.attack,baseD:c.defense,baseS:c.speed,buffs:[],marks:0,combustion:0,oneHitShield:0,armor:{light:false,heavy:false},armorPref:'auto',nextBarrier:0,burn:0,poison:0,sleep:0,confusion:0,charm:0,banSkills:0,nextIn:[],nextOut:[],nextHalf:0,immuneTurn:-1,shieldTurn:-1,entered:false,acted:false,flags:{},side}}
function buildDeck(ids){let specials=[...new Set(ids.flatMap(id=>HERO_MAP[id].skills.flatMap(s=>s.special)))];let cards=[];
 if(specials.length){cards.push(...Array(14).fill('1MP'),...Array(9).fill('2MP'),...Array(7).fill('3MP'));let spec=Array.from({length:20},(_,i)=>specials[i%specials.length]+'カード');cards.push(...spec)}
 else cards.push(...Array(21).fill('1MP'),...Array(16).fill('2MP'),...Array(13).fill('3MP'));
 // 10補助カード：全種類各1枚
 cards.push(...SUPPORTS.filter(x=>x!=='市販結界装置'));if(cards.length!==60)throw Error('deck length '+cards.length);
 return shuffled(cards)}
function makePlayer(side){let ids=config.picks[side];return {team:ids.map(id=>mkRuntime(id,side)),field:[],deck:buildDeckForSide(side,ids),discard:[],hand:[],mpMod:0,assistUsed:false,usedArmor:false,attacks:0}}
function draw(side,n=1){let p=game.players[side];for(let i=0;i<n;i++){if(!p.deck.length){if(!p.discard.length)break;p.deck=shuffled(p.discard);p.discard=[];log(`${side?'赤':'青'}：捨て札を山札へシャッフル`)}p.hand.push(p.deck.pop())}}
function searchDeck(side,fn){let deck=game.players[side].deck,idx=deck.findIndex(fn);if(idx<0)return false;let card=deck.splice(idx,1)[0];game.players[side].hand.push(card);game.players[side].deck=shuffled(deck);log(`${side?'赤':'青'}：山札から${card}を獲得`);return true}
function buff(h,stat,amount,next=1){h.buffs.push({stat,amount,until:game.turn+next});if(amount<0)sourceOnDebuff(h)}
function stat(h,s){let b=s==='attack'?h.baseA:s==='defense'?h.baseD:h.baseS;b+=h.buffs.filter(x=>x.stat===s&&x.until>=game.turn).reduce((a,x)=>a+x.amount,0);
 if(s==='speed'){if(h.armor.light)b+=10;if(h.armor.heavy)b-=10}
 b+=sourceStatBonus(h,s);
 return Math.max(0,b)}
function weakened(h){return !!(h.burn||h.poison||h.sleep||h.confusion||h.buffs.some(b=>b.amount<0&&b.until>=game.turn))}
function statDebuff(h){return h.buffs.some(b=>b.amount<0&&b.until>=game.turn)}
function sickness(h){return !!(h.burn||h.poison||h.sleep||h.confusion)}
function mostWounded(side){return field(side).slice().sort((a,b)=>(b.maxHp-b.hp)-(a.maxHp-a.hp))[0]}
function enemyAdjacent(t){let f=field(ownerOf(t)),i=f.findIndex(h=>h.uid===t.uid);return i<0?[]:[f[i-1],f[i+1]].filter(Boolean)}
function heal(h,n){if(!h||h.hp<=0)return;let prev=h.hp;h.hp=Math.min(h.maxHp,h.hp+n);if(h.hp>prev)log(`＋ ${h.name} HP ${prev} → ${h.hp}`)}
function armorAdd(h,kind){if(!h||h.hp<=0)return;if(!h.armor[kind]){h.armor[kind]=true;log(`◇ ${h.name}：${kind==='light'?'軽甲':'重甲'}を装着`)}}
// 磁気波動：1枚につき確定10ダメージ（ユーザー指定）。保持上限3枚。
// ルネの特性は「味方の技による付与時50%で+1枚」。ミヤの上限超過は確定15。
const MAGNET_BASE_DAMAGE = 10;
const MAGNET_FRANKA_BONUS = 5;
const MAGNET_MIA_OVERFLOW_DAMAGE = 15;
function magnet(h,n=1,fromSkill=false){
 if(!h||h.hp<=0||n<=0)return;
 const side=1-ownerOf(h),bonus=hasAlive(side,1002)?2:0;
 let total=n; if(fromSkill&&hasAlive(side,1002)&&roll(.5))total+=1;
 for(let i=0;i<total&&h.hp>0;i++){ 
  if(h.marks<3){h.marks++;log(`磁気波動：${h.name} ${h.marks}/3枚`);sourceOnMagnet(h,'apply');}
  else {
   // 上限超過は独立した確定ダメージ。フランカの+5は重複加算しない。
   const per=hasAlive(side,1000)?MAGNET_MIA_OVERFLOW_DAMAGE:MAGNET_BASE_DAMAGE;
   log(`磁気波動：${h.name}への付与上限を超過 → 確定${per}ダメージ`);
   directDamage(null,h,per,'磁気波動・上限超過',false);
   sourceOnMagnet(h,'overflow');
  }
 }
}
function burst(h,n,initiator=null){
 if(!h||h.hp<=0||!h.marks)return;
 const used=Math.min(h.marks,n||h.marks);
 h.marks-=used;
 const side=1-ownerOf(h),per=MAGNET_BASE_DAMAGE+(hasField(side,1001)?MAGNET_FRANKA_BONUS:0);
 const total=used*per;
 const neighbors=enemyAdjacent(h).slice();
 log(`磁気波動：${h.name}の${used}枚が炸裂 → ${used}×${per}＝確定${total}ダメージ`);
 directDamage(null,h,total,'磁気波動・炸裂',false);
 sourceOnMagnet(h,'burst',initiator,neighbors);
}
// 行動終了時に保持する磁気波動はすべて同時に炸裂し、残数は0になる。
// 一度の同時炸裂を1イベントとして扱い、炸裂時のとくせいは1回発動する。
function settleMagnetAfterAction(h){
 if(!h||h.hp<=0||!h.marks)return;
 const used=h.marks;
 h.marks=0;
 const sourceSide=1-ownerOf(h);
 const per=MAGNET_BASE_DAMAGE+(hasField(sourceSide,1001)?MAGNET_FRANKA_BONUS:0);
 const neighbors=enemyAdjacent(h).slice();
 log(`磁気波動：${h.name}の行動終了時、${used}枚すべて炸裂 → ${used}×${per}＝確定${used*per}ダメージ`);
 directDamage(null,h,used*per,'磁気波動・行動終了時の全炸裂',false);
 sourceOnMagnet(h,'burst',null,neighbors);
}
function ailment(h,kind){if(!h||h.hp<=0)return;if(kind==='burn'||kind==='poison'){h[kind]++;log(`状態異常：${h.name}に${kind==='burn'?'やけど':'どく'} ${h[kind]}`)}else{h[kind]=Math.max(h[kind],kind==='sleep'?2:3);log(`状態異常：${h.name}に${kind==='sleep'?'ねむり':'こんらん'}`)}sourceOnDebuff(h)}
function cure(h){if(h.combustion){h.combustion=0;log(`治療：${h.name}の燃焼を解除`);return true}if(h.marks){h.marks=0;log(`治療：${h.name}の磁気波動を解除`);return true}for(let k of ['sleep','burn','poison','confusion'])if(h[k]>0){h[k]=k==='sleep'?0:h[k]-1;log(`治療：${h.name}の状態異常を1つ解除`);let healers=field(ownerOf(h)).filter(x=>x.id===1022);for(let x of healers){if(!x.flags.cure){x.flags.cure=true;heal(h,10)}}return true}return false}
function nextShield(h,n){h.nextIn.push(n)}
function extraAttack(h,n){h.nextOut.push(n)}
function wasAttacked(h){return (h.flags.attackedTurn||0)===game.turn}
function flagged(h,k){return h.flags[k]===game.turn}
function claim(h,k){if(flagged(h,k))return false;h.flags[k]=game.turn;return true}
function tryRedirect(src,target){
 if(!src)return target;
 for(const body of field(ownerOf(target))){
  if(body.uid===target.uid)continue;
  if(body.id===1009&&claim(body,'redirect')&&roll(.3)){
   log(`ヴァネッサが単体攻撃を引き受けた`);return body;
  }
 }
 return target;
}
function rawAttackBonus(actor,target,side){
 let b=sourceAttackBonus(actor,target,side);
 b-=actor.burn*10;
 if(actor.nextOut.length)b+=actor.nextOut.shift();
 return b;
}
function onArmorSpent(target,kind){log(`${target.name}の${kind==='heavy'?'重甲':'軽甲'}が消費された`)}
function updateHp(h,val){h.hp=Math.max(0,Math.min(h.maxHp,h.hp+val));if(h.hp===0){for(let p of game.players)p.field=p.field.filter(u=>u!==h.uid);log(`退場：${h.name}が墓場へ`); if(!waiting){checkVictory()}}}
function directDamage(attacker,target,amount,reason='確定ダメージ',isAttack=false){if(!target||target.hp<=0)return 0;let dmg=amount;
 if(isAttack){if(target.oneHitShield>0){target.oneHitShield--;sourceOnShieldBlocked(target);log(`${target.name}の開幕シールドが${reason}を防いだ`);return 0}dmg=applyDefencesSync(attacker,target,dmg,reason);dmg=sourceDamageReduce(attacker,target,dmg)}
 dmg=Math.max(0,dmg);if(dmg){let hp=target.hp;updateHp(target,-dmg);log(`${reason}：${target.name}に${dmg}ダメージ（${hp}→${target.hp}）`)}return dmg}
// 非同期防御選択：軽甲/重甲の両方があれば、防御側の人間に選ばせる。
async function chooseArmor(h,damage){if(!h.armor.light&&!h.armor.heavy)return null;
 if(h.armor.light&&!h.armor.heavy)return 'light';if(!h.armor.light&&h.armor.heavy)return 'heavy';
 if(game.mode==='ai'&&ownerOf(h)===1)return damage<=15?'light':'heavy';
 if(h.armorPref!=='auto')return h.armorPref;
 return await new Promise(resolve=>{armoredResolver=resolve;game.pendingArmor={uid:h.uid,name:h.name,damage,side:ownerOf(h)};render()})}
function applyDefencesSync(attacker,target,damage,reason){if(target.shieldTurn===game.turn){log(`${target.name}は「まほうの甲冑」で無効化`);return 0}if(target.nextHalf>0){target.nextHalf--;damage=Math.ceil(damage/2)}if(target.nextIn.length){damage=Math.max(0,damage-target.nextIn.shift())}return damage}
async function damage(actor,target,power,bonusTrue=0,options={}){
 if(!target||target.hp<=0)return 0;let side=ownerOf(actor);let originalTarget=target;
 if(options.redirect!==false&&!options.normal)target=tryRedirect(actor,target);
 if(!target||target.hp<=0)return 0;
 let bonus=rawAttackBonus(actor,target,side);
 // 基本ルール：攻撃威力がぼうぎょ値以下なら、ぼうぎょを無視した確定10ダメージ。
 // ただし「攻撃を完全に防ぐ」効果がなければ、装甲などの数値軽減後も最低10を保証する。
 const attackPower=power+bonus, defensePower=stat(target,'defense');
 const minimumHit=!options.trueOnly && attackPower<=defensePower;
 let base=options.trueOnly?0:(minimumHit?10:attackPower-defensePower);
 if(minimumHit)log(`最低ダメージ保証：${actor.name}の攻撃威力${attackPower} ≦ ${target.name}のぼうぎょ${defensePower} → 確定10ダメージ（完全無効化以外は軽減後も保証）`);
 bonusTrue+=sourceExtraTrue(actor,target,side,bonusTrue);
 let amount=base+bonusTrue; if(options.trueOnly)amount=bonusTrue;
 game.players[side].attacks++;
 // 「確定10」は最終的な最低保証。ぼうぎょ以外の数値軽減でも0にはならない。
 // ただし「攻撃そのものを防ぐ」完全無効化（まほうの甲冑）は別扱い。
 // 確定追加ダメージは別に加算し、通常の軽減処理を経てから最低保証を適用する。
 const singleShield=target.oneHitShield>0; if(singleShield){target.oneHitShield--;log(`防御：${target.name}の開幕シールドが攻撃を防いだ`);sourceOnShieldBlocked(target)}
 const completelyBlocked=target.shieldTurn===game.turn||singleShield;
 amount=completelyBlocked?0:applyDefencesSync(actor,target,amount,options.name||'攻撃');
 if(!completelyBlocked){amount=sourceDamageReduce(actor,target,amount);}
 if(!completelyBlocked&&amount>0&&(target.armor.light||target.armor.heavy)){
   let k=await chooseArmor(target,amount);
   if(k&&target.armor[k]){target.armor[k]=false;amount=Math.max(0,amount-(k==='light'?15:35));log(`防御：${target.name}の${k==='light'?'軽甲':'重甲'}が消費された`);onArmorSpent(target,k)}
 }
 // 市販結界装置：次に受ける攻撃を1回防ぐ。やみカード使用の技は半減にとどまる。
 let barrierBlocked=false;
 if(!completelyBlocked&&(target.nextBarrier||0)>0){
   target.nextBarrier--;
   const dark=!!(actor&&HERO_MAP[actor.id]?.skills?.some(sk=>sk.name===options.name&&sk.special?.includes('やみ')));
   if(dark){amount=Math.ceil(amount/2);log(`防御：${target.name}の市販結界装置がやみ攻撃を半減`)}
   else{amount=0;barrierBlocked=true;log(`防御：${target.name}の市販結界装置が攻撃を完全に防いだ`)}
 }
 if(minimumHit&&!completelyBlocked&&!barrierBlocked&&amount<10){
   log(`確定10保証：${target.name}への軽減後ダメージ${amount} → 10（完全無効化以外では残る）`);
   amount=10;
 }
 if(target.hp<=0)return 0;
 let before=target.hp;updateHp(target,-amount);
 log(`${actor.name}「${options.name||'攻撃'}」→ ${target.name}：${amount}ダメージ（${before}→${target.hp}）`);
 if(target.sleep&&amount>0){target.sleep=0;log(`${target.name}のねむりが解除された`)}
 if(amount>0){target.flags.attackedTurn=game.turn;target.flags.lastHitTurn=game.turn; sourceOnHit(actor,target,amount,options);}
 // source-specific follow-up attack effects; no obsolete special cases.
 
 sourceAfterAttack(actor,target,amount,options);
 if(target.hp===0||originalTarget.hp===0)checkVictory();
 return amount;
}
function counter(h,enemy,amount,name){if(!enemy||enemy.hp<=0)return;let dmg=amount; game.counterThisTurn[ownerOf(h)]++;
 log(`反撃：${h.name}「${name}」`);directDamage(h,enemy,dmg,name,false);
 for(let x of field(ownerOf(h)))if(x.id===1008&&claim(x,'counterPursuit'))directDamage(x,enemy,10,'仕返しの照準',false)}
function frontSkillCost(side,skill){let p=game.players[side];return Math.max(0,skill.cost+p.mpMod)}
function getPayment(side,skill){let hand=game.players[side].hand,usedSpecial=[];for(let sp of skill.special){let idx=hand.findIndex((v,i)=>!usedSpecial.includes(i)&&v===sp+'カード');if(idx===-1)return null;usedSpecial.push(idx)}
 let need=frontSkillCost(side,skill);
 let mp=hand.map((v,i)=>({i,v:parseInt(v)||0})).filter(x=>x.v>0&&!usedSpecial.includes(x.i));
 let states=new Map([[0,[]]]),maxSum=need+3;
 for(let card of mp){let next=new Map(states);for(let [sum,idx] of states){let total=sum+card.v;if(total>maxSum)continue;let found=next.get(total);let candidate=idx.concat(card.i);if(!found||candidate.length<found.length)next.set(total,candidate)}states=next}
 let best=null;for(let [sum,idx] of states){if(sum<need)continue;if(!best||sum<best.sum||(sum===best.sum&&idx.length<best.idx.length))best={sum,idx}}

 return best?usedSpecial.concat(best.idx):null}
function consume(side,payment){let p=game.players[side];payment.slice().sort((a,b)=>b-a).forEach(i=>p.discard.push(...p.hand.splice(i,1)));}
function dropRoundFlags(){for(let p of game.players){p.assistUsed=false;p.attacks=0;p.mpMod=0;p.sourceSkillReductions=0;p.defenceTriggeredBonus=0;for(let h of p.team){h.acted=false;h.flags={};h.buffs=h.buffs.filter(x=>x.until>=game.turn)}}game.counterThisTurn=[0,0]}
function checkVictory(){if(!game||game.phase==='ended')return false;let a=alive(0).length,b=alive(1).length;
 if(!a||!b){finish(!a&&!b?-1:(!a?1:0));return true}return false}
function finish(winner){game.phase='ended';game.winner=winner;selected=null;log(winner<0?'引き分け':`${winner===0?'青':'赤'}側の勝利！`);render();persist()}
function startMatch(){game={mode:config.mode,phase:'select',turn:0,players:[makePlayer(0),makePlayer(1)],log:[],counterThisTurn:[0,0],planned:[null,null],currentSelectSide:0,order:[],current:null,winner:null,pendingArmor:null};
 for(let side=0;side<2;side++){if(validateDeckArray(deckSlots[side]))log(`${side?'赤':'青'}：保存済みの60枚カスタムデッキを使用`);draw(side,5);}
 for(let side=0;side<2;side++)for(let h of game.players[side].team){let tr=HERO_MAP[h.id]?.traitEffect;if(tr==='opening_draw')draw(side,1);if(tr==='opening_armor')game.players[side].team.forEach(a=>{a.armor.light=true;a.armor.heavy=true})}
 sourceStartMatch();
 beginRound();config.view='battle';render()}
function beginRound(){if(checkVictory())return;game.turn++;game.phase='select';game.planned=[null,null];game.currentSelectSide=0;game.current=null;selected=null;dropRoundFlags();for(let side=0;side<2;side++)draw(side,2);log(`━━ ターン${game.turn} 開始：各プレイヤー2枚ドロー`);persist()}
function commitSelection(side,uidList){if(!uidList||uidList.length<1||uidList.length>3)return alert('1〜3人を選択してください。');if(uidList.some(uid=>!alive(side).some(h=>h.uid===uid)))return alert('選択に誤りがあります');
 game.planned[side]=uidList.slice();selected=null;
 if(side===0){if(game.mode==='ai'){game.planned[1]=pickAiLineup(1);beginTurn()}else{game.currentSelectSide=1;game.phase='handoff';render()}}
 else {passPending=game.mode==='local';beginTurn()}}
function pickAiLineup(side){let p=game.players[side];let prev=p.field, c=alive(side).slice();return c.sort((a,b)=>((prev.includes(b.uid)?20:0)+b.hp/8+stat(b,'speed')/3)-((prev.includes(a.uid)?20:0)+a.hp/8+stat(a,'speed')/3)).slice(0,3).map(h=>h.uid)}
function onEnter(h){
 if(h.entered)return;
 h.entered=true;
 let side=ownerOf(h),tr=HERO_MAP[h.id]?.traitEffect;
 if(tr==='enter_draw')draw(side,1);
 if(tr==='enter_shield')field(side).forEach(a=>nextShield(a,20));
 if(tr==='enter_heal')field(side).forEach(a=>heal(a,10));
 sourceOnEnter(h);
}
function beginTurn(){game.phase='acting';for(let s=0;s<2;s++){let p=game.players[s],old=p.field.slice();p.field=game.planned[s].slice();for(let h of field(s))if(!old.includes(h.uid))onEnter(h)}
 sourceTurnStart();
 // ステータス異常を場のキャラにのみ適用、行動順の前に解決。
 for(let s=0;s<2;s++)for(let h of field(s).slice()){if(h.burn)directDamage(null,h,h.burn*5,'やけどの継続ダメージ',false);if(h.poison)directDamage(null,h,h.poison*5,'どくの継続ダメージ',false);if(h.confusion){directDamage(null,h,10*Math.min(2,h.confusion),'こんらんの継続ダメージ',false);h.confusion=Math.max(0,h.confusion-1)}}
 if(checkVictory())return;log(`両軍の配置が確定。素早さ順に行動`);nextActor()}
function availableActors(){return [0,1].flatMap(s=>field(s).filter(h=>!h.acted).map(h=>({side:s,unit:h})))}
function nextActor(){if(game.phase==='ended')return;if(checkVictory())return;let all=availableActors();if(!all.length){endRound();return}
 const maximum=Math.max(...all.map(a=>stat(a.unit,'speed'))),high=all.filter(a=>stat(a.unit,'speed')===maximum);let chosen=high[rand(high.length)];
 let h=chosen.unit,s=chosen.side;
 if(h.combustion&&h.hp>0){h.combustion=0;directDamage(null,h,10,'燃焼・行動直前',false);sourceOnCombustion(h);if(h.hp<=0)return nextActor();}
 if(h.sleep){h.sleep=Math.max(0,h.sleep-1);h.acted=true;log(`${h.name}はねむりで行動できない`);settleMagnetAfterAction(h);return nextActor()}
 if(h.poison&& !roll(Math.pow(.9,h.poison))){h.acted=true;log(`${h.name}の行動はどくで失敗`);settleMagnetAfterAction(h);return nextActor()}
 game.current={side:s,uid:h.uid};selected=null;render();persist();
 if(game.mode==='ai'&&s===1){setTimeout(()=>takeAiAction(),350)}
 }
function endRound(){sourceEndRound();for(let s=0;s<2;s++){let p=game.players[s];for(let h of p.team)h.buffs=h.buffs.filter(b=>b.until>game.turn)}
 // 戦闘終了条件：そのターン終了時、フィールド上の味方が全員倒れていた側が敗北。
 let lose0=game.planned[0].every(uid=>game.players[0].team.find(h=>h.uid===uid)?.hp<=0),lose1=game.planned[1].every(uid=>game.players[1].team.find(h=>h.uid===uid)?.hp<=0);if(lose0||lose1){finish(lose0&&lose1?-1:lose0?1:0);return}
 beginRound();render()}
async function takeAiAction(){if(!game||game.phase!=='acting'||!game.current||game.current.side!==1||waiting)return;
 let h=game.players[1].team.find(x=>x.uid===game.current.uid);if(!h||h.hp===0)return nextActor();
 let skills=HERO_MAP[h.id].skills;let candidates=skills.map((s,i)=>({s,i,p:getPayment(1,s)})).filter(x=>x.p && (TARG[h.id]||x.s.effect?.type!=='manual'));
 let healing=candidates.filter(x=>/(回復|処置|整備スプレー|修繕|物資運搬|編隊補給|補給ルート|快速装着|軽甲再編)/.test(x.s.name));
 let chosen=(field(1).some(x=>x.hp<x.maxHp-30)&&healing.length&&roll(.55))?healing[rand(healing.length)]:(candidates.length&&roll(.78)?candidates[rand(candidates.length)]:null);
 let targ=chosen?(TARG[h.id]?.[chosen.i]||chosen.s.target||'enemy'):'enemy', pool=targ==='ally'?field(1):targ==='self'?[h]:field(0);
 let t=(targ==='none'?null:targ==='ally'?(pool.slice().sort((a,b)=>(b.maxHp-b.hp)-(a.maxHp-a.hp))[0]):pool.slice().sort((a,b)=>a.hp-b.hp)[0]);
 if(!t&&targ!=='none'){chosen=null;t=field(0)[0]}
 if(!chosen&&!t){log(`${h.name}は対象がいないためパス`);endAction(h);return}
 if(chosen)await actSkill(h,chosen.i,t);else await actNormal(h,t);
 }
async function actNormal(h,target){if(waiting||!target||h.hp<=0)return;waiting=true;selected=null;let s=ownerOf(h);log(`${s?'赤':'青'} ${h.name}：通常攻撃`);
 const normalHit=async()=>{let count=HERO_MAP[h.id]?.traitEffect==='triple35'?3:1,power=count===3?Math.round(stat(h,'attack')*.35/10)*10:stat(h,'attack');
 for(let i=0;i<count;i++){if(target.hp<=0)break;await damage(h,target,power,0,{normal:true,name:'通常攻撃 '+(count>1?`${i+1}/${count}`:'')});if(game.phase==='ended')break}}
 await normalHit();sourceAfterNormal(h,target);if(h.id===1032&&roll(.3)&&target.hp>0&&game.phase!=='ended'){log('ビスコット：特性による追加通常攻撃');await normalHit();sourceAfterNormal(h,target)}
 waiting=false;endAction(h)}
async function actSkill(h,index,target){if(waiting||h.hp<=0)return;let side=ownerOf(h),skill=HERO_MAP[h.id].skills[index],payment=getPayment(side,skill);if(!payment){alert('必要なMP・属性カードが手札にありません。');return}
 if(h.banSkills){h.banSkills=0;alert('このキャラクターは持ち技を封じられています。');return}
 waiting=true;selected=null;consume(side,payment);log(`${side?'赤':'青'} ${h.name}：「${skill.name}」を発動（${payment.length}枚消費）`);

 sourceOnSkillCast(h,target);
 try{let manual=await skillEffect(h,index,target);if(manual){waiting=false;render();persist();return}}catch(e){console.error(e);log('効果処理にエラーが発生：'+e.message)}
 waiting=false;endAction(h)}
function endAction(h){if(!game||game.phase==='ended'){render();persist();return}h.acted=true;
 if(h.marks>0)settleMagnetAfterAction(h);
 sourceOnEndAction(h);
 if(h.banSkills>0){h.banSkills=0} // 技封印は次の行動順終了で解除
 if(!checkVictory())nextActor();render();persist()}
const doHit=async(h,t,power,trueDmg=0,name='持ち技')=>await damage(h,t,power,trueDmg,{name});
async function attackAdjacent(h,t,value,boost=false){for(let a of enemyAdjacent(t).slice()){let n=value;if(a.hp>0)await attackSplash(h,a,n)}}
async function attackSplash(h,target,amount){if(target.hp<=0)return;let d=amount;d=applyDefencesSync(h,target,d,'拡散攻撃');let k=await chooseArmor(target,d);if(k&&target.armor[k]){target.armor[k]=false;d=Math.max(0,d-(k==='light'?15:35));onArmorSpent(target,k);log(`${target.name}の装甲が拡散攻撃で消費された`)}directDamage(h,target,d,'拡散の確定ダメージ',false)}
function burnGroup(side){return field(side).filter(h=>h.burn>0)}
function canAttack(h){return !!h&&h.hp>0}
// Source-based 36 cards are resolved in restored_cards.js.
async function skillEffect(h,i,t){
 if(h.id>=1000&&h.id<=1035)return await restoredSkillEffect(h,i,t);
 return await executeImportedSkill(h,i,t);
}

// 追加カードは、カード入力画面で指定した自動処理だけを実行する。
// 複雑な能力は必ず手動裁定に移行し、無言で無効化しない。
async function executeImportedSkill(h,i,t){let sk=HERO_MAP[h.id].skills[i],effect=sk.effect||{type:'manual',value:0};let amount=Math.max(0,Math.floor(Number(effect.value)||0));let s=ownerOf(h);
 if(effect.type==='manual'){game.manualPending={actorUid:h.uid,skillName:sk.name,description:sk.desc,targetUid:t?.uid||null,consumeAction:true};log('手動裁定が必要：'+h.name+'「'+sk.name+'」');return true}
 if(effect.type==='draw'){draw(s,Math.max(1,amount));return false}
 if(!t||t.hp<=0){log('この技の対象が存在しません');return false}
 switch(effect.type){case 'damage':await damage(h,t,amount,0,{name:sk.name});break;case 'true_damage':directDamage(h,t,amount,sk.name,true);break;
 case 'heal':heal(t,amount);break;case 'armor_light':armorAdd(t,'light');break;case 'armor_heavy':armorAdd(t,'heavy');break;case 'burn':ailment(t,'burn');break;case 'poison':ailment(t,'poison');break;case 'sleep':ailment(t,'sleep');break;
 case 'buff_attack':buff(t,'attack',amount,1);break;case 'buff_defense':buff(t,'defense',amount,1);break;case 'buff_speed':buff(t,'speed',amount,1);break;case 'shield':nextShield(t,amount);break;
 default:game.manualPending={actorUid:h.uid,skillName:sk.name,description:sk.desc,targetUid:t.uid,consumeAction:true};return true}
 log(h.name+'「'+sk.name+'」の追加カード効果を適用');return false
}
function applyManualChange(op,targetUid,amount){let p=game?.manualPending;if(!p)return;let t=game.players.flatMap(x=>x.team).find(x=>x.uid===targetUid);let h=game.players.flatMap(x=>x.team).find(x=>x.uid===p.actorUid);if(!t||!h)return;
 amount=Math.max(0,Math.min(9999,Math.floor(Number(amount)||0)));p.targetUid=t.uid;
 const names={attack_down:'こうげき減少',defense_down:'ぼうぎょ減少',speed_down:'すばやさ減少',charm:'みりょう記録',damage:'HP減少',heal:'HP回復',attack:'こうげき増加',defense:'ぼうぎょ増加',speed:'すばやさ増加',burn:'やけど付与',poison:'どく付与',sleep:'ねむり付与',confusion:'こんらん付与',magnet:'磁気波動付与',cure:'状態異常解除',light:'軽甲付与',heavy:'重甲付与',draw:'カードを引く'};
 switch(op){case 'damage':updateHp(t,-amount);break;case 'heal':heal(t,amount);break;case 'attack':case 'defense':case 'speed':buff(t,op,amount,1);break;case 'attack_down':case 'defense_down':case 'speed_down':buff(t,op.replace('_down',''),-amount,1);break;case 'burn':case 'poison':case 'sleep':case 'confusion':ailment(t,op);break;case 'charm':t.charm=1;break;case 'magnet':magnet(t,1);break;case 'combustion':sourceGiveCombustion(t);break;case 'cure':cure(t);break;case 'light':case 'heavy':armorAdd(t,op);break;case 'draw':draw(ownerOf(t),Math.max(1,amount));break;default:return}
 log('手動裁定：'+t.name+'に「'+(names[op]||op)+'」'+(['damage','heal','attack','defense','speed','attack_down','defense_down','speed_down','draw'].includes(op)?' '+amount:''));persist();render();
}
function finishManual(){let p=game?.manualPending;if(!p)return;let h=game.players.flatMap(x=>x.team).find(x=>x.uid===p.actorUid);game.manualPending=null;log('手動裁定完了');if(h&&p.consumeAction)endAction(h);else {render();persist()}}

function startAssist(side,name,target){if(waiting||game.phase!=='acting'||!game.current||game.current.side!==side)return;let p=game.players[side];if(p.assistUsed)return;
 let idx=p.hand.indexOf(name);if(idx<0)return;
 if(name==='まほうの甲冑'&&p.usedArmor){alert('まほうの甲冑は1試合に1回です');return}
 p.hand.splice(idx,1);p.discard.push(name);p.assistUsed=true;selected=null;log(`${side?'赤':'青'} 補助：「${name}」`);
 switch(name){case 'いずみのみず':heal(target,30);break;case 'にがいお茶':extraAttack(target,30);break;case 'つちのかたまり':buff(target,'defense',30,0);break;case 'かみなりのたね':buff(target,'speed',30,0);break;case 'かんぽうゼリー':cure(target);break;case '流れる魔力':p.mpMod-=1;break;case '止められた魔力':game.players[1-side].mpMod+=1;break;case 'まほうの甲冑':p.usedArmor=true;field(side).forEach(x=>x.shieldTurn=game.turn);break;case 'ひらめきの一手':if(p.hand.length){let j=rand(p.hand.length);p.discard.push(...p.hand.splice(j,1))}draw(side);break;case 'ヒメアオホノカ':field(side).forEach(h=>heal(h,10));break;case '市販結界装置':target.nextBarrier=(target.nextBarrier||0)+1;log(`${target.name}に市販結界装置を設置`);break;}
 render();persist()}
function targetOfAssist(name){return ['いずみのみず','にがいお茶','つちのかたまり','かみなりのたね','かんぽうゼリー','市販結界装置'].includes(name)?'ally':'none'}
function saveConfig(){try{localStorage.setItem('tcg_vivid_config',JSON.stringify({picks:config.picks,mode:config.mode}));accountMarkDirty()}catch(e){}}
function persist(){if(!game)return;try{localStorage.setItem(LSKEY,JSON.stringify(game))}catch(e){}}
function restore(){try{let c=JSON.parse(localStorage.getItem('tcg_vivid_config')||'null');if(c&&c.picks?.every(p=>p.length===6))config={...config,...c};let saved=JSON.parse(localStorage.getItem(LSKEY)||'null');if(saved?.players?.length===2&&['select','acting','handoff','ended'].includes(saved.phase)){game=saved;waiting=false;game.pendingArmor=null;if(game.phase==='acting'&&game.current?.side===1&&game.mode==='ai')setTimeout(takeAiAction,550)}}catch(e){console.warn('保存データ復元失敗',e)}}
