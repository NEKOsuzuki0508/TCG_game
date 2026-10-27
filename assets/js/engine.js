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
const TARG={1000:['enemy','none'],1001:['enemy','enemy'],1002:['enemy','enemy'],1003:['enemy','enemy'],1004:['enemy','enemy'],1005:['ally','enemy'],1006:['ally','enemy'],1007:['enemy','enemy'],1008:['enemy','ally'],1009:['self','enemy'],1010:['ally','ally'],1011:['enemy','enemy'],1012:['ally','ally'],1013:['enemy','ally'],1014:['enemy','ally'],1015:['ally','ally'],1016:['self','enemy'],1017:['enemy','self'],1018:['enemy','none'],1019:['enemy','enemy'],1020:['enemy','enemy'],1021:['enemy','enemy'],1022:['ally','none'],1023:['enemy','enemy'],1024:['enemy','none'],1025:['enemy','none'],1026:['enemy','enemy'],1027:['none','ally'],1028:['enemy','enemy'],1029:['enemy','ally'],1030:['enemy','ally'],1031:['enemy','ally'],1032:['enemy','enemy'],1033:['enemy','ally'],1034:['none','ally'],1035:['enemy','enemy']};
const HELP={
'いずみのみず':'味方1人のHP+30','にがいお茶':'味方1人の次の攻撃ダメージ+30','つちのかたまり':'味方1人のぼうぎょ+30（このターン）','かみなりのたね':'味方1人のすばやさ+30（このターン）','かんぽうゼリー':'味方1人の状態異常を1つ解除','流れる魔力':'このターン味方の技必要MP−1','止められた魔力':'このターン敵の技必要MP+1','まほうの甲冑':'このターン味方フィールド全員の敵攻撃を防ぐ（1戦1回）','ひらめきの一手':'手札をランダム1枚捨て、1枚引く','ヒメアオホノカ':'味方フィールド全員のHP+10（簡易裁定）','市販結界装置':'味方1人への次の攻撃を無効化。やみカードを使う攻撃は半減'};
const $=(q)=>document.querySelector(q);
const escapeHTML=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rand=n=>Math.floor(Math.random()*n);
const roll=p=>Math.random()<p;
const shuffled=a=>{let r=a.slice();for(let i=r.length-1;i>0;i--){const k=rand(i+1);[r[i],r[k]]=[r[k],r[i]]}return r};
let config={mode:'ai',picks:[FORMATIONS[0].ids.slice(),FORMATIONS[4].ids.slice()],activeSide:0,view:'battle',showDetails:null,editorSide:null};
let game=null;let selected=null;let waiting=false;let lastOutcome='';let armoredResolver=null;
const LSKEY='tcg_vivid_state_v1';
function log(line){if(!game)return;game.log.unshift(line);game.log=game.log.slice(0,110)}
function ownerOf(h){return game.players.findIndex(s=>s.team.includes(h))}
function field(side){return game.players[side].field.map(uid=>game.players[side].team.find(h=>h.uid===uid)).filter(h=>h && h.hp>0)}
function bench(side){return game.players[side].team.filter(h=>h.hp>0&&!game.players[side].field.includes(h.uid))}
function alive(side){return game.players[side].team.filter(h=>h.hp>0)}
function others(side){return field(1-side)}
function teammate(h){return field(ownerOf(h))}
function heroName(h){return h?.name||'対象'}
function mkRuntime(id,side){let c=HERO_MAP[id];return {uid:side+'_'+id,id,name:c.name,maxHp:c.hp,hp:c.hp,baseA:c.attack,baseD:c.defense,baseS:c.speed,buffs:[],marks:0,armor:{light:false,heavy:false},armorPref:'auto',nextBarrier:0,burn:0,poison:0,sleep:0,confusion:0,charm:0,banSkills:0,nextIn:[],nextOut:[],nextHalf:0,immuneTurn:-1,shieldTurn:-1,entered:false,acted:false,flags:{},side}}
function buildDeck(ids){let specials=[...new Set(ids.flatMap(id=>HERO_MAP[id].skills.flatMap(s=>s.special)))];let cards=[];
 if(specials.length){cards.push(...Array(14).fill('1MP'),...Array(9).fill('2MP'),...Array(7).fill('3MP'));let spec=Array.from({length:20},(_,i)=>specials[i%specials.length]+'カード');cards.push(...spec)}
 else cards.push(...Array(21).fill('1MP'),...Array(16).fill('2MP'),...Array(13).fill('3MP'));
 // 10補助カード：全種類各1枚
 cards.push(...SUPPORTS.filter(x=>x!=='市販結界装置'));if(cards.length!==60)throw Error('deck length '+cards.length);
 return shuffled(cards)}
function makePlayer(side){let ids=config.picks[side];return {team:ids.map(id=>mkRuntime(id,side)),field:[],deck:buildDeckForSide(side,ids),discard:[],hand:[],mpMod:0,assistUsed:false,usedArmor:false,attacks:0}}
function draw(side,n=1){let p=game.players[side];for(let i=0;i<n;i++){if(!p.deck.length){if(!p.discard.length)break;p.deck=shuffled(p.discard);p.discard=[];log(`${side?'赤':'青'}：捨て札を山札へシャッフル`)}p.hand.push(p.deck.pop())}}
function searchDeck(side,fn){let deck=game.players[side].deck,idx=deck.findIndex(fn);if(idx<0)return false;let card=deck.splice(idx,1)[0];game.players[side].hand.push(card);game.players[side].deck=shuffled(deck);log(`${side?'赤':'青'}：山札から${card}を獲得`);return true}
function buff(h,stat,amount,next=1){h.buffs.push({stat,amount,until:game.turn+next})}
function stat(h,s){let b=s==='attack'?h.baseA:s==='defense'?h.baseD:h.baseS;b+=h.buffs.filter(x=>x.stat===s&&x.until>=game.turn).reduce((a,x)=>a+x.amount,0);
 if(s==='speed'){if(h.armor.light)b+=10;if(h.armor.heavy)b-=10;if(h.id===1004&&others(ownerOf(h)).some(e=>e.marks))b+=10;if(h.id===1028&&others(ownerOf(h)).some(e=>e.burn))b+=10}
 if(s==='defense'&&h.id===1029&&others(ownerOf(h)).some(e=>e.burn))b+=10;
 return Math.max(0,b)}
function weakened(h){return !!(h.burn||h.poison||h.sleep||h.confusion||h.buffs.some(b=>b.amount<0&&b.until>=game.turn))}
function statDebuff(h){return h.buffs.some(b=>b.amount<0&&b.until>=game.turn)}
function sickness(h){return !!(h.burn||h.poison||h.sleep||h.confusion)}
function mostWounded(side){return field(side).slice().sort((a,b)=>(b.maxHp-b.hp)-(a.maxHp-a.hp))[0]}
function enemyAdjacent(t){let f=field(ownerOf(t)),i=f.findIndex(h=>h.uid===t.uid);return [f[i-1],f[i+1]].filter(Boolean)}
function heal(h,n){if(!h||h.hp<=0)return;let prev=h.hp;h.hp=Math.min(h.maxHp,h.hp+n);if(h.hp>prev)log(`＋ ${h.name} HP ${prev} → ${h.hp}`)}
function armorAdd(h,kind){if(!h||h.hp<=0)return;if(!h.armor[kind]){h.armor[kind]=true;log(`◇ ${h.name}：${kind==='light'?'軽甲':'重甲'}を装着`)}}
function magnet(h,n=1){if(!h||h.hp<=0)return;for(let i=0;i<n;i++){if(h.marks<3){h.marks++;log(`⚡ ${h.name}に磁気波動（${h.marks}/3）`)}else{directDamage(null,h,10,'磁気波動の超過',false)}}}
function burst(h,n){if(!h||h.hp<=0)return;let amt=Math.min(h.marks,n||h.marks);h.marks-=amt;if(amt){log(`⚡ ${h.name}の磁気波動${amt}枚が炸裂`);directDamage(null,h,10*amt,'磁気波動の炸裂',false)}}
function ailment(h,kind){if(!h||h.hp<=0)return;if(kind==='burn'||kind==='poison'){h[kind]++;log(`状態異常：${h.name}に${kind==='burn'?'やけど':'どく'} ${h[kind]}`)}else{h[kind]=Math.max(h[kind],kind==='sleep'?2:3);log(`状態異常：${h.name}に${kind==='sleep'?'ねむり':'こんらん'}`)}}
function cure(h){for(let k of ['sleep','burn','poison','confusion'])if(h[k]>0){h[k]=k==='sleep'?0:h[k]-1;log(`治療：${h.name}の状態異常を1つ解除`);let healers=field(ownerOf(h)).filter(x=>x.id===1022);for(let x of healers){if(!x.flags.cure){x.flags.cure=true;heal(h,10)}}return true}return false}
function nextShield(h,n){h.nextIn.push(n)}
function extraAttack(h,n){h.nextOut.push(n)}
function wasAttacked(h){return (h.flags.attackedTurn||0)===game.turn}
function flagged(h,k){return h.flags[k]===game.turn}
function claim(h,k){if(flagged(h,k))return false;h.flags[k]=game.turn;return true}
function tryRedirect(src,target){let side=ownerOf(target);for(let body of field(side)){if(body.uid===target.uid)continue;let chance=0;if(body.id===1009)chance=.5;else if(body.id===1016&&body.armor.heavy)chance=.3;else if(body.id===1005&&src.marks>0)chance=.3;if(chance&&claim(body,'redirect')&&roll(chance)){log(`防御：${body.name}が${target.name}への攻撃を引き受けた`);return body}}return target}
function rawAttackBonus(actor,target,side){let b=0;
 if(actor.id===1001&&target.marks)b+=10;
 if(actor.id===1011&&game.counterThisTurn[side])b+=10;
 if(actor.id===1020&&weakened(target))b+=10;
 if(actor.id===1021&&target.poison)b+=10;
 if(actor.id===1023&&sickness(target)&&statDebuff(target))b+=20;
 if(actor.id===1035&&game.players[side].attacks>=2)b+=10;
 for(let h of field(side)){if(h.id===1019&&weakened(target))b+=10;if(h.id===1025&&target.burn)b+=10;if(h.id===1031&&game.players[side].attacks>=1)b+=10}
 b-=actor.burn*10;
 if(actor.nextOut.length)b+=actor.nextOut.shift();
 return b}
function onArmorSpent(victim,kind){let side=ownerOf(victim);for(let h of field(side)){
 if(h.id===1013&&claim(h,'armorSpent')){let m=mostWounded(side)||h;extraAttack(m,kind==='heavy'?20:10);log(`装甲反照：${m.name}の次の攻撃を強化`)}
 if(h.id===1015&&claim(h,'repaired'))heal(victim,kind==='heavy'?20:10)
 }}
function updateHp(h,val){h.hp=Math.max(0,Math.min(h.maxHp,h.hp+val));if(h.hp===0){for(let p of game.players)p.field=p.field.filter(u=>u!==h.uid);log(`退場：${h.name}が墓場へ`); if(!waiting){checkVictory()}}}
function directDamage(attacker,target,amount,reason='確定ダメージ',isAttack=false){if(!target||target.hp<=0)return 0;let dmg=amount;
 if(isAttack){dmg=applyDefencesSync(attacker,target,dmg,reason)}
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
 if(options.redirect!==false)target=tryRedirect(actor,target);
 if(!target||target.hp<=0)return 0;
 let bonus=rawAttackBonus(actor,target,side);
 // 基本ルール：攻撃威力がぼうぎょ値以下なら、ぼうぎょを無視した確定10ダメージ。
 // ただし「攻撃を完全に防ぐ」効果がなければ、装甲などの数値軽減後も最低10を保証する。
 const attackPower=power+bonus, defensePower=stat(target,'defense');
 const minimumHit=!options.trueOnly && attackPower<=defensePower;
 let base=options.trueOnly?0:(minimumHit?10:attackPower-defensePower);
 if(minimumHit)log(`最低ダメージ保証：${actor.name}の攻撃威力${attackPower} ≦ ${target.name}のぼうぎょ${defensePower} → 確定10ダメージ（完全無効化以外は軽減後も保証）`);
 let amount=base+bonusTrue; if(options.trueOnly)amount=bonusTrue;
 game.players[side].attacks++;
 // 「確定10」は最終的な最低保証。ぼうぎょ以外の数値軽減でも0にはならない。
 // ただし「攻撃そのものを防ぐ」完全無効化（まほうの甲冑）は別扱い。
 // 確定追加ダメージは別に加算し、通常の軽減処理を経てから最低保証を適用する。
 const completelyBlocked=target.shieldTurn===game.turn;
 amount=applyDefencesSync(actor,target,amount,options.name||'攻撃');
 if(amount>0&&(target.armor.light||target.armor.heavy)){
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
 if(amount>0){target.flags.attackedTurn=game.turn;
   // 攻撃から派生する被弾・反撃を処理（追撃が反撃を再誘発しない）
   for(let h of field(ownerOf(target))){
     if(h.id===1006&&claim(h,'shielded_'+target.uid))buff(target,'defense',10,1);
     if(h.id===1010&&claim(h,'aid'))heal(target,10);
   }
   if(target.flags.counterReady){target.flags.counterReady=false;counter(target,actor,20,'反撃の準備')}
   for(let h of field(ownerOf(target)))if(h.id===1007&&claim(h,'counter'))counter(h,actor,20,'応報の刃');
   if(actor.id===1018)buff(target,'attack',-10,1);
 }
 // 多段追撃の実行（ここでのダメージは攻撃回数に含めない）
 if(options.normal&&amount>0){
   if(actor.id===1002){} // ミヤは後述の味方通常攻撃誘発で実行
   if(actor.id===1014&&actor.armor.light&&claim(actor,'scatter')){let a=enemyAdjacent(target);if(a.length)directDamage(actor,a[0],15,'機動射角',true)}
   for(let h of field(side))if(h.id===1002&&claim(h,'magNormal')&&roll(.5))magnet(target,1);
 }
 if(game.players[side].attacks>=2){for(let h of field(side))if(h.id===1034&&claim(h,'comboHeal'))heal(mostWounded(side),10)}
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
function dropRoundFlags(){for(let p of game.players){p.assistUsed=false;p.attacks=0;p.mpMod=0;for(let h of p.team){h.acted=false;h.flags={};h.buffs=h.buffs.filter(x=>x.until>=game.turn)}}game.counterThisTurn=[0,0]}
function checkVictory(){if(!game||game.phase==='ended')return false;let a=alive(0).length,b=alive(1).length;
 if(!a||!b){finish(!a&&!b?-1:(!a?1:0));return true}return false}
function finish(winner){game.phase='ended';game.winner=winner;selected=null;log(winner<0?'引き分け':`${winner===0?'青':'赤'}側の勝利！`);render();persist()}
function startMatch(){game={mode:config.mode,phase:'select',turn:0,players:[makePlayer(0),makePlayer(1)],log:[],counterThisTurn:[0,0],planned:[null,null],currentSelectSide:0,order:[],current:null,winner:null,pendingArmor:null};
 for(let side=0;side<2;side++){if(validateDeckArray(deckSlots[side]))log(`${side?'赤':'青'}：保存済みの60枚カスタムデッキを使用`);draw(side,5);}
 for(let side=0;side<2;side++)for(let h of game.players[side].team){let tr=HERO_MAP[h.id]?.traitEffect;if(tr==='opening_draw')draw(side,1);if(tr==='opening_armor')game.players[side].team.forEach(a=>{a.armor.light=true;a.armor.heavy=true})}
 // 「バトル開始時」はベンチを含む全員へ適用。アイリスが初期編成にいれば発動。
 for(let side=0;side<2;side++)if(game.players[side].team.some(h=>h.id===1012)){
  game.players[side].team.forEach(h=>{h.armor.light=true;h.armor.heavy=true});log(`${side?'赤':'青'}：アイリス「二層防衛」味方6人全員に軽甲・重甲を配備`)}
 beginRound();config.view='battle';render()}
function beginRound(){if(checkVictory())return;game.turn++;game.phase='select';game.planned=[null,null];game.currentSelectSide=0;game.current=null;selected=null;dropRoundFlags();for(let side=0;side<2;side++)draw(side,2);log(`━━ ターン${game.turn} 開始：各プレイヤー2枚ドロー`);persist()}
function commitSelection(side,uidList){if(!uidList||uidList.length<1||uidList.length>3)return alert('1〜3人を選択してください。');if(uidList.some(uid=>!alive(side).some(h=>h.uid===uid)))return alert('選択に誤りがあります');
 game.planned[side]=uidList.slice();selected=null;
 if(side===0){if(game.mode==='ai'){game.planned[1]=pickAiLineup(1);beginTurn()}else{game.currentSelectSide=1;game.phase='handoff';render()}}
 else {passPending=game.mode==='local';beginTurn()}}
function pickAiLineup(side){let p=game.players[side];let prev=p.field, c=alive(side).slice();return c.sort((a,b)=>((prev.includes(b.uid)?20:0)+b.hp/8+stat(b,'speed')/3)-((prev.includes(a.uid)?20:0)+a.hp/8+stat(a,'speed')/3)).slice(0,3).map(h=>h.uid)}
function onEnter(h){if(h.entered)return;h.entered=true;let side=ownerOf(h);let tr=HERO_MAP[h.id]?.traitEffect;if(tr==='enter_draw')draw(side,1);if(tr==='enter_shield')field(side).forEach(a=>nextShield(a,20));if(tr==='enter_heal')field(side).forEach(a=>heal(a,10));switch(h.id){
case 1000: for(let x of field(side))nextShield(x,20);log('ルネ：制御装甲、味方の次の被ダメージ−20');break;
case 1003:searchDeck(side,c=>/^[123]MP$/.test(c));break;
case 1024:for(let x of field(side))nextShield(x,20);log('ノルシュ：灼熱防空が発動');break;
case 1026:h.nextHalf++;log('ルチル：次の被攻撃を半減');break;
case 1030:for(let x of field(side))nextShield(x,20);log('フローリア：風の編制が発動');break;
case 1033:draw(side,1);log('シエンラ：機動通信で1枚引く');break;
 }}
function beginTurn(){game.phase='acting';for(let s=0;s<2;s++){let p=game.players[s],old=p.field.slice();p.field=game.planned[s].slice();for(let h of field(s))if(!old.includes(h.uid))onEnter(h)}
 // ステータス異常を場のキャラにのみ適用、行動順の前に解決。
 for(let s=0;s<2;s++)for(let h of field(s).slice()){if(h.burn)directDamage(null,h,h.burn*5,'やけどの継続ダメージ',false);if(h.poison)directDamage(null,h,h.poison*5,'どくの継続ダメージ',false);if(h.confusion){directDamage(null,h,10*Math.min(2,h.confusion),'こんらんの継続ダメージ',false);h.confusion=Math.max(0,h.confusion-1)}}
 if(checkVictory())return;log(`両軍の配置が確定。素早さ順に行動`);nextActor()}
function availableActors(){return [0,1].flatMap(s=>field(s).filter(h=>!h.acted).map(h=>({side:s,unit:h})))}
function nextActor(){if(game.phase==='ended')return;if(checkVictory())return;let all=availableActors();if(!all.length){endRound();return}
 const maximum=Math.max(...all.map(a=>stat(a.unit,'speed'))),high=all.filter(a=>stat(a.unit,'speed')===maximum);let chosen=high[rand(high.length)];
 let h=chosen.unit,s=chosen.side;
 if(h.sleep){h.sleep=Math.max(0,h.sleep-1);h.acted=true;log(`${h.name}はねむりで行動できない`);return nextActor()}
 if(h.poison&& !roll(Math.pow(.9,h.poison))){h.acted=true;log(`${h.name}の行動はどくで失敗`);return nextActor()}
 game.current={side:s,uid:h.uid};selected=null;render();persist();
 if(game.mode==='ai'&&s===1){setTimeout(()=>takeAiAction(),350)}
 }
function endRound(){for(let s=0;s<2;s++){let p=game.players[s];for(let h of p.team)h.buffs=h.buffs.filter(b=>b.until>game.turn)}
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
 const normalHit=async()=>{let count=(h.id>=1030&&h.id<=1035)||HERO_MAP[h.id]?.traitEffect==='triple35'?3:1,power=count===3?Math.round(stat(h,'attack')*.35/10)*10:stat(h,'attack');
 for(let i=0;i<count;i++){if(target.hp<=0)break;await damage(h,target,power,0,{normal:true,name:'通常攻撃 '+(count>1?`${i+1}/${count}`:'')});if(game.phase==='ended')break}}
 await normalHit();if(h.id===1032&&claim(h,'extraNormal')&&roll(.4)&&target.hp>0&&game.phase!=='ended'){log('ビスコット：飛翔の連打が追加発動');await normalHit()}
 waiting=false;endAction(h)}
async function actSkill(h,index,target){if(waiting||h.hp<=0)return;let side=ownerOf(h),skill=HERO_MAP[h.id].skills[index],payment=getPayment(side,skill);if(!payment){alert('必要なMP・属性カードが手札にありません。');return}
 if(h.banSkills){h.banSkills=0;alert('このキャラクターは持ち技を封じられています。');return}
 waiting=true;selected=null;consume(side,payment);log(`${side?'赤':'青'} ${h.name}：「${skill.name}」を発動（${payment.length}枚消費）`);
 if(skill.special.length){for(let x of field(side))if(x.id===1027&&claim(x,'flameHeal'))heal(h,10)}
 try{let manual=await skillEffect(h,index,target);if(manual){waiting=false;render();persist();return}}catch(e){console.error(e);log('効果処理にエラーが発生：'+e.message)}
 waiting=false;endAction(h)}
function endAction(h){if(!game||game.phase==='ended'){render();persist();return}h.acted=true;
 if(h.marks>0){let n=h.marks;h.marks=0;directDamage(null,h,n*10,'磁気波動の行動後炸裂',false)}
 if(h.banSkills>0){h.banSkills=0} // 技封印は次の行動順終了で解除
 if(!checkVictory())nextActor();render();persist()}
const doHit=async(h,t,power,trueDmg=0,name='持ち技')=>await damage(h,t,power,trueDmg,{name});
async function attackAdjacent(h,t,value,boost=false){for(let a of enemyAdjacent(t).slice()){let n=value+(boost&&h.id===1017&&h.armor.light?10:0);if(a.hp>0)await attackSplash(h,a,n)}}
async function attackSplash(h,target,amount){if(target.hp<=0)return;let d=amount;d=applyDefencesSync(h,target,d,'拡散攻撃');let k=await chooseArmor(target,d);if(k&&target.armor[k]){target.armor[k]=false;d=Math.max(0,d-(k==='light'?15:35));onArmorSpent(target,k);log(`${target.name}の装甲が拡散攻撃で消費された`)}directDamage(h,target,d,'拡散の確定ダメージ',false)}
function burnGroup(side){return field(side).filter(h=>h.burn>0)}
function canAttack(h){return !!h&&h.hp>0}
// 標準収録キャラクターの技をカード本文に従って解決。
async function skillEffect(h,i,t){let s=ownerOf(h),f=field(s),en=field(1-s),id=h.id,shot=async(p,bonus=0)=>{if(t&&t.hp>0)await doHit(h,t,p,bonus,HERO_MAP[id].skills[i].name)};
 if(!TARG[id])return await executeImportedSkill(h,i,t);
 switch(id){
 case 1000: if(i===0){await shot(60);magnet(t)}else f.forEach(x=>buff(x,'defense',10,1));break;
 case 1001: if(i===0){await shot(70);if(t.marks)burst(t,1)}else{await shot(90);burst(t)}break;
 case 1002: if(i===0){await shot(50);magnet(t)}else{magnet(t);let other=en.find(x=>x.uid!==t.uid);if(other)magnet(other)}break;
 case 1003: if(i===0)magnet(t);else if(t.marks)directDamage(h,t,40,'断層解析',false);break;
 case 1004: if(i===0){await shot(60);magnet(t)}else if(t.marks){await shot(50);t.banSkills=1;log(`${t.name}の次の持ち技を封印`)}break;
 case 1005: if(i===0)nextShield(t,30);else await shot(80,t.marks?20:0);break;
 case 1006: if(i===0)nextShield(t,30);else await shot(70,field(s).some(x=>wasAttacked(x))?20:0);break;
 case 1007: if(i===0)await shot(70,wasAttacked(f[0]||h)||en.includes(t)&&wasAttacked(t)?20:field(s).some(x=>wasAttacked(x))?20:0);else await shot(t.hp<=t.maxHp/2?110:90);break;
 case 1008: if(i===0){t=en.slice().sort((a,b)=>a.hp-b.hp)[0];await shot(70)}else{nextShield(t,20);extraAttack(t,10)}break;
 case 1009: if(i===0)buff(h,'defense',20,0);else await shot(60,wasAttacked(h)?30:0);break;
 case 1010: if(i===0)heal(t,wasAttacked(t)?40:30);else{t.flags.counterReady=true;log(`${t.name}は反撃の準備をした`)}break;
 case 1011: if(i===0)await shot(90,game.counterThisTurn[s]>0?20:0);else{await shot(100);heal(h,10)}break;
 case 1012: if(i===0){armorAdd(t,'light');buff(t,'defense',10,1)}else armorAdd(t,'heavy');break;
 case 1013: if(i===0)await shot(80,h.armor.heavy?20:h.armor.light?10:0);else{armorAdd(t,'light');draw(s)}break;
 case 1014: if(i===0){await shot(60);await attackAdjacent(h,t,15)}else{armorAdd(t,'light');heal(t,10)}break;
 case 1015: if(i===0){armorAdd(t,'light');draw(s)}else{armorAdd(t,'heavy');heal(t,10)}break;
 case 1016: if(i===0){armorAdd(h,'heavy');heal(h,10)}else{await shot(70);if(h.armor.heavy){h.armor.heavy=false;directDamage(h,t,20,'盾の一撃の追加',false);log(`${h.name}は重甲を任意消費した`)}}break;
 case 1017: if(i===0){await shot(50);await attackAdjacent(h,t,20,true)}else {if(en.length>1){let a=en[0],b=en[1],p=game.players[1-s];let ai=p.field.indexOf(a.uid),bi=p.field.indexOf(b.uid);[p.field[ai],p.field[bi]]=[p.field[bi],p.field[ai]];log('潮目変更：敵2人の位置を交換')}armorAdd(h,'light')}break;
 case 1018: if(i===0){await shot(80);buff(t,'defense',-10,1)}else en.forEach(x=>buff(x,'attack',-10,1));break;
 case 1019: if(i===0){await shot(50);t.banSkills=1;log(`${t.name}は次の行動順に持ち技を使えない`)}else{buff(t,'attack',-10,1);buff(t,'defense',-10,1)}break;
 case 1020: if(i===0)await shot(80,weakened(t)?20:0);else buff(t,'defense',-20,1);break;
 case 1021: if(i===0)ailment(t,'poison');else await shot(70,t.poison?10:0);break;
 case 1022: if(i===0){cure(t);heal(t,20)}else {f.forEach(x=>{for(let key of ['attack','defense']){let debuffs=x.buffs.filter(b=>b.stat===key&&b.amount<0&&b.until>=game.turn);if(debuffs.length)buff(x,key,Math.min(10,-debuffs.reduce((a,b)=>a+b.amount,0)),1)}})}break;
 case 1023: if(i===0)await shot(100,sickness(t)&&statDebuff(t)?30:0);else{await shot(60);if(sickness(t))buff(t,'defense',-10,1)}break;
 case 1024: if(i===0){await shot(70);ailment(t,'burn')}else searchDeck(s,c=>/^[123]MP$/.test(c));break;
 case 1025: if(i===0){await shot(80);ailment(t,'burn')}else for(let x of en.slice())if(x.burn)directDamage(h,x,15,'残照',false);break;
 case 1026: if(i===0){await shot(60);ailment(t,'burn');await attackAdjacent(h,t,20)}else {await shot(50);game.players[s].field=game.players[s].field.filter(uid=>uid!==h.uid);log(`${h.name}がベンチへ戻る`)}break;
 case 1027: if(i===0)searchDeck(s,c=>c==='ほのおカード');else heal(t,30);break;
 case 1028: if(i===0)await shot(70,t.burn?15:0);else{await shot(50);if(t.burn)heal(h,20)}break;
 case 1029: if(i===0)await shot(100,t.burn?20:0);else nextShield(t,30);break;
 case 1030: if(i===0){await shot(40);if(t.hp>0)await shot(40)}else buff(t,'speed',20,1);break;
 case 1031: if(i===0)await shot(70,game.players[s].attacks>0?20:0);else extraAttack(t,20);break;
 case 1032: if(i===0){for(let n=0;n<3&&t.hp>0;n++)await shot(35)}else{await shot(60);nextShield(h,20)}break;
 case 1033: if(i===0){await shot(40);let ally=f.find(x=>x.uid!==h.uid&&x.hp>0);if(ally)extraAttack(ally,10)}else extraAttack(t,20);break;
 case 1034: if(i===0)searchDeck(s,c=>/^[123]MP$/.test(c));else heal(t,30);break;
 case 1035: if(i===0)await shot(70,game.players[s].attacks>=3?30:0);else{await shot(100);buff(h,'defense',-10,1)}break;
 }
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
 switch(op){case 'damage':updateHp(t,-amount);break;case 'heal':heal(t,amount);break;case 'attack':case 'defense':case 'speed':buff(t,op,amount,1);break;case 'attack_down':case 'defense_down':case 'speed_down':buff(t,op.replace('_down',''),-amount,1);break;case 'burn':case 'poison':case 'sleep':case 'confusion':ailment(t,op);break;case 'charm':t.charm=1;break;case 'magnet':magnet(t,1);break;case 'cure':cure(t);break;case 'light':case 'heavy':armorAdd(t,op);break;case 'draw':draw(ownerOf(t),Math.max(1,amount));break;default:return}
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
