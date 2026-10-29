/* 売ってないTCG / ビビッドアーミー 非公式ブラウザ対戦エンジン */
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
const AI_ACTION_DELAY_MS=1400;
const ACTION_REVEAL_DELAY_MS=450;
const ACTION_RESULT_DELAY_MS=800;
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const $=(q)=>document.querySelector(q);
const escapeHTML=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rand=n=>Math.floor(Math.random()*n);
const roll=p=>Math.random()<p;
const shuffled=a=>{let r=a.slice();for(let i=r.length-1;i>0;i--){const k=rand(i+1);[r[i],r[k]]=[r[k],r[i]]}return r};
let config={mode:'ai',picks:[FORMATIONS[0].ids.slice(),FORMATIONS[4].ids.slice()],activeSide:0,view:'battle',showDetails:null,editorSide:null};
let game=null;let selected=null;let waiting=false;let lastOutcome='';let armoredResolver=null;let sacrificeResolver=null;
const LSKEY='tcg_vivid_state_v2';
function log(line){if(!game)return;game.log.unshift(line);game.log=game.log.slice(0,110)}
function ownerOf(h){return game.players.findIndex(s=>s.team.includes(h))}
function field(side){return game.players[side].field.map(uid=>game.players[side].team.find(h=>h.uid===uid)).filter(h=>h && h.hp>0)}
function bench(side){return game.players[side].team.filter(h=>h.hp>0&&!game.players[side].field.includes(h.uid))}
// 自分のフィールドの並び順を変更する。field配列は隣接攻撃などの位置判定にも使われる。
function reorderFieldUnits(side,fromUid,toUid){
 if(!game||game.phase!=='acting'||selected||waiting)return false;
 const activeSide=game.mode==='ai'?0:(game.current?.side??-1);
 if(side!==activeSide||(game.mode==='local'&&game.current?.side!==side))return false;
 const p=game.players[side],from=p.field.indexOf(fromUid),to=p.field.indexOf(toUid);
 if(from<0||to<0||from===to)return false;
 p.field.splice(from,1);p.field.splice(to,0,fromUid);
 log(`配置変更：${side?'赤':'青'}チームのフィールド位置を変更`);
 persist();
 return true;
}
function shiftFieldUnit(side,uid,delta){
 if(!game||!game.players?.[side])return false;
 const p=game.players[side],from=p.field.indexOf(uid),to=from+Number(delta);
 if(from<0||to<0||to>=p.field.length)return false;
 return reorderFieldUnits(side,uid,p.field[to]);
}
function alive(side){return game.players[side].team.filter(h=>h.hp>0)}
function others(side){return field(1-side)}
function teammate(h){return field(ownerOf(h))}
function heroName(h){return h?.name||'対象'}
function mkRuntime(id,side){let c=HERO_MAP[id];return {uid:side+'_'+id,id,name:c.name,maxHp:c.hp,hp:c.hp,baseA:c.attack,baseD:c.defense,baseS:c.speed,buffs:[],marks:0,armor:{light:false,heavy:false},armorPref:'auto',nextBarrier:0,burn:0,poison:0,sleep:0,confusion:0,charm:0,combustion:0,banSkills:0,banAttackTurn:-1,skipNextAction:0,nextIn:[],nextOut:[],nextHalf:0,immuneTurn:-1,shieldTurn:-1,tauntTurn:-1,entered:false,enteredTurn:0,wasInFieldPreviousTurn:false,acted:false,turnStartHp:c.hp,damageTakenThisTurn:0,fukutsuUsed:false,actionNameCursor:0,flags:{},usedSkills:{},traitUses:0,deathProcessed:false,side}}
function buildDeck(ids){let specials=[...new Set(ids.flatMap(id=>HERO_MAP[id].skills.flatMap(s=>s.special)))];let cards=[];
 if(specials.length){cards.push(...Array(14).fill('1MP'),...Array(9).fill('2MP'),...Array(7).fill('3MP'));let spec=Array.from({length:20},(_,i)=>specials[i%specials.length]+'カード');cards.push(...spec)}
 else cards.push(...Array(21).fill('1MP'),...Array(16).fill('2MP'),...Array(13).fill('3MP'));
 // 10補助カード：全種類各1枚
 cards.push(...SUPPORTS.filter(x=>x!=='市販結界装置'));if(cards.length!==60)throw Error('deck length '+cards.length);
 return shuffled(cards)}
function makePlayer(side){let ids=config.picks[side];return {team:ids.map(id=>mkRuntime(id,side)),field:[],deck:buildDeckForSide(side,ids),discard:[],hand:[],handSort:'drawn',handSortOrder:'asc',mpMod:0,assistUsed:false,usedArmor:false,attacks:0}}
function draw(side,n=1){let p=game.players[side];for(let i=0;i<n;i++){if(!p.deck.length){if(!p.discard.length)break;p.deck=shuffled(p.discard);p.discard=[];log(`${side?'赤':'青'}：捨て札を山札へシャッフル`)}p.hand.push(p.deck.pop())}}
function searchDeck(side,fn){let deck=game.players[side].deck,idx=deck.findIndex(fn);if(idx<0)return false;let card=deck.splice(idx,1)[0];game.players[side].hand.push(card);game.players[side].deck=shuffled(deck);log(`${side?'赤':'青'}：山札から${card}を獲得`);return true}
function buff(h,stat,amount,next=1){h.buffs.push({stat,amount,until:game.turn+next});if(amount<0&&typeof sourceOnDebuff==='function')sourceOnDebuff(h)}
function stat(h,s){let b=s==='attack'?h.baseA:s==='defense'?h.baseD:h.baseS;b+=h.buffs.filter(x=>x.stat===s&&x.until>=game.turn).reduce((a,x)=>a+x.amount,0);
 if(s==='speed'){if(h.armor.light)b+=10;if(h.armor.heavy)b-=10}
 if(s==='defense'&&h.id===1029&&others(ownerOf(h)).some(e=>e.combustion))b+=10;
 if(typeof sourceStatBonus==='function')b+=(sourceStatBonus(h,s)||0);
 if(s==='attack')b+=officialTraitAttackBonus(h);
 if(s==='defense')b+=officialTraitDefenseBonus(h);
 if(s==='speed')b+=officialTraitSpeedBonus(h);
 return Math.max(0,b)}
function weakened(h){return !!(h.burn||h.poison||h.sleep||h.confusion||h.buffs.some(b=>b.amount<0&&b.until>=game.turn))}
function statDebuff(h){return h.buffs.some(b=>b.amount<0&&b.until>=game.turn)}
function sickness(h){return !!(h.burn||h.poison||h.sleep||h.confusion)}
function mostWounded(side){return field(side).slice().sort((a,b)=>(b.maxHp-b.hp)-(a.maxHp-a.hp))[0]}
function enemyAdjacent(t){let f=field(ownerOf(t)),i=f.findIndex(h=>h.uid===t.uid);return [f[i-1],f[i+1]].filter(Boolean)}
function heal(h,n){if(!h||h.hp<=0)return;let prev=h.hp;h.hp=Math.min(h.maxHp,h.hp+n);if(h.hp>prev)log(`＋ ${h.name} HP ${prev} → ${h.hp}`)}
function armorAdd(h,kind){if(!h||h.hp<=0)return;if(!h.armor[kind]){h.armor[kind]=true;log(`◇ ${h.name}：${kind==='light'?'軽甲':'重甲'}を装着`)}}
function magnet(h,n=1,skillOrigin=true){if(!h||h.hp<=0)return;let count=n;if(skillOrigin&&typeof hasField==='function'&&hasField(1-ownerOf(h),1002)&&roll(.5)){count++;log('ルネ「蒼雷華」：磁気波動を1枚追加');}for(let i=0;i<count;i++){if(h.marks<3){h.marks++;log(`⚡ ${h.name}に磁気波動（${h.marks}/3）`)}else{const side=1-ownerOf(h),bonus=((typeof hasField==='function'&&hasField(side,1001))?5:0)+((typeof hasField==='function'&&hasField(side,1010))?5:0);directDamage(null,h,15+bonus,'磁気波動の超過',false)}}}
function burst(h,n,initiator=null,neighbors=null){if(!h||h.hp<=0)return;let amt=Math.min(h.marks,n||h.marks);h.marks-=amt;if(amt){const adjacent=(neighbors||enemyAdjacent(h).slice());const side=1-ownerOf(h),bonus=((typeof hasField==='function'&&hasField(side,1001))?5:0)+((typeof hasField==='function'&&hasField(side,1010))?5:0);log(`⚡ ${h.name}の磁気波動${amt}枚が炸裂`);directDamage(null,h,(10+bonus)*amt,'磁気波動の炸裂',false);if(typeof sourceOnMagnet==='function')sourceOnMagnet(h,'burst',initiator,adjacent)}}
function ailment(h,kind){if(!h||h.hp<=0)return;if(kind==='burn'||kind==='poison'){h[kind]++;log(`状態異常：${h.name}に${kind==='burn'?'やけど':'どく'} ${h[kind]}`)}else if(kind==='charm'){h.charm=Math.max(1,h.charm||0);log(`状態異常：${h.name}にみりょう`)}else{h[kind]=Math.max(h[kind],kind==='sleep'?2:3);log(`状態異常：${h.name}に${kind==='sleep'?'ねむり':'こんらん'}`)}if(typeof sourceOnDebuff==='function')sourceOnDebuff(h)}
function cure(h){for(let k of ['sleep','burn','poison','confusion','charm'])if(h[k]>0){h[k]=k==='sleep'?0:h[k]-1;log(`治療：${h.name}の状態異常を1つ解除`);return true}return false}
function nextShield(h,n){h.nextIn.push(n)}
function extraAttack(h,n){h.nextOut.push(n)}
function wasAttacked(h){return (h.flags.attackedTurn||0)===game.turn}
function flagged(h,k){return h.flags[k]===game.turn}
function claim(h,k){if(flagged(h,k))return false;h.flags[k]=game.turn;return true}
function useLimitFromText(text){let s=String(text||'');if(/1ターンに1回|1ターンにつき1回|各ターンに1回/.test(s)&&!/バトル中|1バトル|ゲーム中/.test(s))return null;let m=s.match(/1バトルにつき最大\s*(\d+)\s*(?:こ|個|回)まで/);if(m)return Math.max(1,Number(m[1]));m=s.match(/バトル中(?:に)?(\d+)回まで(?:しか使えない)?/);if(m)return Math.max(1,Number(m[1]));if(/バトル中(?:に)?1(?:回|度)|1バトル(?:につき)?1回|ゲーム中(?:に)?1回|1回しか使えない|一度しか使えない|1回だけ|1度だけ/.test(s))return 1;return null}
function skillUseLimit(skill){return useLimitFromText(skill?.desc)}
function skillExhausted(h,skill,index){let limit=skillUseLimit(skill);return limit!==null&&Number(h.usedSkills?.[index]||0)>=limit}
function traitUseLimit(h){return useLimitFromText(HERO_MAP[h.id]?.trait)}
function traitExhausted(h){let limit=traitUseLimit(h);return limit!==null&&Number(h.traitUses||0)>=limit}
function selectableTrait(h){let t=String(HERO_MAP[h.id]?.trait||'');return /このとくせいを発動する際には|この特性を発動する際には|とくせいを発動する際には|発動するか選択する|発動するかを選択する/.test(t)&&!/仲間が敵から受けた攻撃/.test(t)}
function selectableTraitAtAction(h){return selectableTrait(h)&&!/ターン開始時/.test(String(HERO_MAP[h.id]?.trait||''))}
function activeTaunts(side){return field(1-side).filter(x=>x.tauntTurn===game.turn)}
function forceTauntTarget(src,target){if(!src||!target||!game||ownerOf(target)===ownerOf(src))return target;let forced=activeTaunts(ownerOf(src));if(!forced.length||forced.some(x=>x.uid===target.uid))return target;let picked=forced.length===1?forced[0]:forced[rand(forced.length)];log(`みがわり：${picked.name}が敵の攻撃対象を引き受けた`);return picked}
function validEnemyTarget(side,target){let forced=activeTaunts(side);return !forced.length||forced.some(x=>x.uid===target.uid)}
function tryRedirect(src,target,options={}){if(options.normal)return target;let side=ownerOf(target);for(let body of field(side)){if(body.uid===target.uid)continue;let chance=0;if(body.id===1009)chance=.3;else if(HERO_MAP[body.id]?.traitName==='せいかん')chance=.25;if(chance&&((HERO_MAP[body.id]?.traitName==='せいかん'&&roll(chance))||(HERO_MAP[body.id]?.traitName!=='せいかん'&&claim(body,'redirect')&&roll(chance)))){log(`防御：${body.name}が${target.name}への攻撃を引き受けた`);return body}}return target}
function rawAttackBonus(actor,target,side){let b=0;
 if(traitNameOf(actor)==='ほのおのとうし'&&actor.lastAttackedTurn===game.turn-1)b+=10;
 for(let h of field(side)){
  const tn=HERO_MAP[h.id]?.traitName||'';if(tn==='ふくつのしれいとう'&&h.hp>0&&h.hp<=h.maxHp/2)b+=10;if(tn==='たよれるしれいとう'&&h.hp>h.maxHp/2)b+=10}
 b-=actor.burn*10;
 if(actor.nextOut.length)b+=actor.nextOut.shift();
 if(typeof sourceAttackBonus==='function')b+=sourceAttackBonus(actor,target,side)||0;
 if(field(side).some(x=>traitNameOf(x)==='ファーストペンギン'&&stat(x,'speed')>=Math.max(...field(side).map(y=>stat(y,'speed')))))b+=10;
 if(target&&traitNameOf(actor)==='せんりがん'&&field(1-side).slice().sort((a,b)=>stat(a,'defense')-stat(b,'defense'))[0]?.uid===target.uid)b+=10;
 if(target&&traitNameOf(actor)==='どうぞう'&&(game.lastSkillSpecial||[]).includes('やみ'))b+=10;
 if(target&&traitNameOf(actor)==='こちふかば'&&(game.currentSkillSpecial||[]).includes('葉っぱ'))b+=10;
 if(target&&traitNameOf(actor)==='かぜのり'&&(game.lastSkillSpecial||[]).includes('風'))b+=10;
 if(target&&traitNameOf(actor)==='もえさし'&&(game.lastSkillSpecial||[]).includes('ほのお'))b+=10;
 if(target&&traitNameOf(actor)==='山ぐらし'&&(game.lastSkillSpecial||[]).includes('葉っぱ'))b+=10;
 if(target&&traitNameOf(actor)==='かわながれ'&&(game.lastSkillSpecial||[]).includes('水'))b+=10;
 if(target&&traitNameOf(actor)==='はんしゃきょう'&&(game.lastSkillSpecial||[]).includes('ひかり'))b+=10;
 if(target&&traitNameOf(actor)==='穴あけパンチ'){const foes=field(1-side),idx=foes.findIndex(x=>x.uid===target.uid);if(idx===0||idx===foes.length-1)b+=10}
 if(target&&traitNameOf(actor)==='ホチキス'){const own=game.players[side].field.indexOf(actor.uid),opp=game.players[1-side].field.indexOf(target.uid);if(own===opp)b+=10}
 if(target&&traitNameOf(actor)==='エイプリルフール'&&!actor.wasInFieldPreviousTurn&&actor.enteredTurn===game.turn)b+=stat(target,'attack')-stat(actor,'attack');
 if(target&&traitNameOf(actor)==='タレビン'&&(game.lastSkillSpecial||[]).includes('水')&&(game.currentSkillSpecial||[]).includes('水'))b+=10;
 return b}
function onArmorSpent(victim,kind){}
function queueDeathTrait(h){let c=HERO_MAP[h.id];if(!c||!(/死んだとき|HPが0以下になったとき/.test(c.trait||'')))return;if(!game.pendingDeathTraits)game.pendingDeathTraits=[];game.pendingDeathTraits.push({actorUid:h.uid,skillName:'死亡時とくせい：'+c.traitName,description:c.trait,targetUid:game.players[ownerOf(h)].team.find(x=>x.hp>0)?.uid||game.players[1-ownerOf(h)].team.find(x=>x.hp>0)?.uid||null,consumeAction:false,deathTrigger:true});log(`死亡時効果：${h.name}「${c.traitName}」の処理待ち`)}
function triggerDeathTrait(h){if(h.deathProcessed)return;h.deathProcessed=true;let c=HERO_MAP[h.id];if(!c)return;if(c.traitName==='やみへのさそい'){let side=ownerOf(h),names=new Set((c.skills||[]).map(x=>x.name));let targets=field(1-side).filter(x=>x.hp>0&&(HERO_MAP[x.id]?.skills||[]).some(sk=>names.has(sk.name)));if(targets.length){let target=targets[rand(targets.length)];log(`死亡時効果：${h.name}「やみへのさそい」→ 共通の技を持つ${target.name}を道連れにする`);updateHp(target,-target.hp)}else log(`死亡時効果：${h.name}「やみへのさそい」対象なし`);return}queueDeathTrait(h)}
function updateHp(h,val){if(!h||!game)return;let wasAlive=h.hp>0,oldHp=h.hp;h.hp=Math.max(0,Math.min(h.maxHp,h.hp+val));if(val<0&&wasAlive){h.damageTakenThisTurn=(h.damageTakenThisTurn||0)+Math.min(oldHp,-val);const trait=HERO_MAP[h.id]?.traitName;if(trait==='ふくつのこころ'&&!h.fukutsuUsed&&h.turnStartHp>0&&h.hp<h.turnStartHp/2){h.fukutsuUsed=true;const recovery=Math.floor((h.damageTakenThisTurn||0)/2);if(recovery>0){const before=h.hp;h.hp=Math.min(h.maxHp,h.hp+recovery);log(`とくせい：${h.name}「ふくつのこころ」HP ${before} → ${h.hp}（このターンの被ダメージの半分を回復）`)}}}if(wasAlive&&h.hp===0){for(let p of game.players)p.field=p.field.filter(u=>u!==h.uid);log(`退場：${h.name}が墓場へ`);triggerDeathTrait(h)}}
function directDamage(attacker,target,amount,reason='確定ダメージ',isAttack=false){if(!target||target.hp<=0)return 0;if(attacker)target=forceTauntTarget(attacker,target);if(!target||target.hp<=0)return 0;let dmg=amount;
 if(isAttack){dmg=applyDefencesSync(attacker,target,dmg,reason)}
 dmg=Math.max(0,dmg);if(dmg){let hp=target.hp;updateHp(target,-dmg);log(`${reason}：${target.name}に${dmg}ダメージ（${hp}→${target.hp}）`)}if(!waiting&&!game.pendingDeathTraits?.length)checkVictory();return dmg}
// 非同期防御選択：軽甲/重甲の両方があれば、防御側の人間に選ばせる。
async function chooseArmor(h,damage){if(!h.armor.light&&!h.armor.heavy)return null;
 if(h.armor.light&&!h.armor.heavy)return 'light';if(!h.armor.light&&h.armor.heavy)return 'heavy';
 if(game.mode==='ai'&&ownerOf(h)===1)return damage<=15?'light':'heavy';
 if(h.armorPref!=='auto')return h.armorPref;
 return await new Promise(resolve=>{armoredResolver=resolve;game.pendingArmor={uid:h.uid,name:h.name,damage,side:ownerOf(h)};render()})}
function applyDefencesSync(attacker,target,damage,reason){if(target.shieldTurn===game.turn){log(`${target.name}は「まほうの甲冑」で無効化`);return 0}if(target.nextHalf>0){target.nextHalf--;damage=Math.ceil(damage/2)}if(target.nextIn.length){damage=Math.max(0,damage-target.nextIn.shift())}return damage}
function estimateAttackBonus(actor,target,side){let next=actor.nextOut.slice();let value=rawAttackBonus(actor,target,side);actor.nextOut=next;return value}
async function maybeUseLifeline(actor,target,power,bonusTrue,options,side){if(!actor||!target||ownerOf(actor)===ownerOf(target)||target.shieldTurn===game.turn)return target;let victimSide=ownerOf(target);let candidates=field(victimSide).filter(h=>h.uid!==target.uid&&HERO_MAP[h.id]?.traitName==='きせきのきずな'&&Number(h.traitUses||0)===0&&!traitExhausted(h));if(!candidates.length)return target;let attackPower=power+estimateAttackBonus(actor,target,side),defensePower=stat(target,'defense');let predicted=options.trueOnly?bonusTrue:(attackPower<=defensePower?10:attackPower-defensePower)+bonusTrue;if(target.hp-predicted>target.maxHp*.1)return target;if(game.mode==='ai'&&victimSide===1){let rescue=candidates[0];rescue.traitUses=1;log(`とくせい：${rescue.name}「きせきのきずな」で${target.name}への攻撃を引き受けた`);return rescue}return await new Promise(resolve=>{sacrificeResolver=resolve;game.pendingSacrifice={victimUid:target.uid,attackerUid:actor.uid,candidates:candidates.map(h=>({uid:h.uid,name:h.name})),predicted};render()}).then(uid=>{if(!uid)return target;let rescue=candidates.find(h=>h.uid===uid);if(!rescue)return target;rescue.traitUses=1;log(`とくせい：${rescue.name}「きせきのきずな」で${target.name}への攻撃を引き受けた`);return rescue})}
async function damage(actor,target,power,bonusTrue=0,options={}){
 if(!target||target.hp<=0)return 0;let side=ownerOf(actor);let originalTarget=target;let taunts=target&&ownerOf(target)!==side?activeTaunts(side):[];
 if(taunts.length){if(!taunts.some(x=>x.uid===target.uid))target=forceTauntTarget(actor,target)}else if(options.redirect!==false)target=tryRedirect(actor,target,options);
 if(!target||target.hp<=0)return 0;target=await maybeUseLifeline(actor,target,power,bonusTrue,options,side);if(!target||target.hp<=0)return 0;
 if(ownerOf(actor)!==ownerOf(target)&&((game.currentSkillSpecial||[]).includes('やみ')&&traitNameOf(target)==='もんばん'||(game.currentSkillSpecial||[]).includes('水')&&traitNameOf(target)==='地に足うまってる')){log(`とくせい：${target.name}が属性カードの攻撃効果を無効化`);return 0}
 let bonus=rawAttackBonus(actor,target,side);
 // 基本ルール：攻撃威力がぼうぎょ値以下なら、ぼうぎょを無視した確定10ダメージ。
 // ただし「攻撃を完全に防ぐ」効果がなければ、装甲などの数値軽減後も最低10を保証する。
 const attackPower=power+bonus, defensePower=stat(target,'defense');
 const minimumHit=!options.trueOnly && attackPower<=defensePower;
 let base=options.trueOnly?0:(minimumHit?10:attackPower-defensePower);
 if(minimumHit)log(`最低ダメージ保証：${actor.name}の攻撃威力${attackPower} ≦ ${target.name}のぼうぎょ${defensePower} → 確定10ダメージ（完全無効化以外は軽減後も保証）`);
 if(typeof sourceExtraTrue==='function')bonusTrue+=sourceExtraTrue(actor,target,side,bonusTrue)||0;
 let amount=base+bonusTrue; if(options.trueOnly)amount=bonusTrue;
 game.players[side].attacks++;
 // 「確定10」は最終的な最低保証。ぼうぎょ以外の数値軽減でも0にはならない。
 // ただし「攻撃そのものを防ぐ」完全無効化（まほうの甲冑）は別扱い。
 // 確定追加ダメージは別に加算し、通常の軽減処理を経てから最低保証を適用する。
 const completelyBlocked=target.shieldTurn===game.turn;
 amount=applyDefencesSync(actor,target,amount,options.name||'攻撃');
 if(typeof sourceDamageReduce==='function')amount=sourceDamageReduce(actor,target,amount)||0;
 amount=officialTraitDamageReduce(actor,target,amount,options);
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
 if(amount>0){target.flags.attackedTurn=game.turn;target.lastAttackedTurn=game.turn;
   if(typeof sourceOnHit==='function')sourceOnHit(actor,target,amount,options);
   officialTraitOnHit(actor,target,amount,options);
   // 攻撃から派生する被弾・反撃を処理（追撃が反撃を再誘発しない）
   if(target.flags.counterReady){target.flags.counterReady=false;counter(target,actor,20,'反撃の準備')}
   }
 // 多段追撃の実行（ここでのダメージは攻撃回数に含めない）

 if(options.normal&&typeof sourceAfterNormal==='function')sourceAfterNormal(actor,target);
 if(typeof sourceAfterAttack==='function')sourceAfterAttack(actor,target,amount,options);officialTraitAfterAttack(actor,target,options);
 if(target.hp===0||originalTarget.hp===0)checkVictory();
 return amount;
}
function counter(h,enemy,amount,name){if(!enemy||enemy.hp<=0)return;let dmg=amount+((typeof hasField==='function'&&hasField(ownerOf(h),1010))?5:0); game.counterThisTurn[ownerOf(h)]++;
 log(`反撃：${h.name}「${name}」`);directDamage(h,enemy,dmg,name,false)}
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
function checkVictory(){if(!game||game.phase==='ended')return false;if(game.pendingDeathTraits?.length||game.manualPending?.deathTrigger)return false;let a=alive(0).length,b=alive(1).length;
 if(!a||!b){finish(!a&&!b?-1:(!a?1:0));return true}return false}
function finish(winner){game.phase='ended';game.winner=winner;selected=null;log(winner<0?'引き分け':`${winner===0?'青':'赤'}側の勝利！`);render();persist()}
function startMatch(){game={mode:config.mode,phase:'select',turn:0,players:[makePlayer(0),makePlayer(1)],log:[],counterThisTurn:[0,0],planned:[null,null],currentSelectSide:0,order:[],current:null,winner:null,pendingArmor:null,pendingDeathTraits:[],actionNameCharLog:[],lastSkillSpecial:[],lastSkillNameBySide:[],lastSpecialUsedBySide:[[],[]]};
 for(let side=0;side<2;side++){if(validateDeckArray(deckSlots[side]))log(`${side?'赤':'青'}：保存済みの60枚カスタムデッキを使用`);draw(side,5);}
 for(let side=0;side<2;side++)for(let h of game.players[side].team){let tr=HERO_MAP[h.id]?.traitEffect;if(tr==='opening_draw')draw(side,1);if(tr==='opening_armor')game.players[side].team.forEach(a=>{a.armor.light=true;a.armor.heavy=true})}
 if(typeof sourceStartMatch==='function')sourceStartMatch();
 beginRound();config.view='battle';render()}
function beginRound(){if(checkVictory())return;game.turn++;game.phase='select';game.planned=[null,null];game.currentSelectSide=0;game.current=null;selected=null;dropRoundFlags();for(let p of game.players)for(let h of p.team){h.turnStartHp=h.hp;h.damageTakenThisTurn=0;h.acted=false}for(let side=0;side<2;side++)draw(side,2);if(typeof sourceTurnStart==='function')sourceTurnStart();officialTraitTurnStart();if(game.phase==='ended')return;log(`━━ ターン${game.turn} 開始：各プレイヤー2枚ドロー`);persist()}
function commitSelection(side,uidList){if(!uidList||uidList.length<1||uidList.length>3)return alert('1〜3人を選択してください。');if(uidList.some(uid=>!alive(side).some(h=>h.uid===uid)))return alert('選択に誤りがあります');let requiredTaunts=game.players[side].team.filter(h=>h.hp>0&&h.tauntTurn===game.turn);if(requiredTaunts.some(h=>!uidList.includes(h.uid))){if(typeof plannedChoices!=='undefined')plannedChoices=uidList.slice();alert('みがわりの効果中は、そのキャラクターを必ず出場させてください。');render();return}
 game.planned[side]=uidList.slice();selected=null;
 if(side===0){if(game.mode==='ai'){game.planned[1]=pickAiLineup(1);beginTurn()}else{game.currentSelectSide=1;game.phase='handoff';render()}}
 else {passPending=game.mode==='local';beginTurn()}}
function pickAiLineup(side){let p=game.players[side];let prev=p.field, c=alive(side).slice();let forced=c.filter(h=>h.tauntTurn===game.turn);let ranked=c.sort((a,b)=>((prev.includes(b.uid)?20:0)+b.hp/8+stat(b,'speed')/3)-((prev.includes(a.uid)?20:0)+a.hp/8+stat(a,'speed')/3));return [...forced,...ranked.filter(h=>!forced.some(x=>x.uid===h.uid))].slice(0,3).map(h=>h.uid)}
function onEnter(h){const firstEntry=!h.entered;h.entered=true;h.enteredTurn=game.turn;let side=ownerOf(h);let tr=HERO_MAP[h.id]?.traitEffect;
 if(typeof sourceOnEnter==='function')sourceOnEnter(h,firstEntry);officialTraitOnEnter(h);
 if(firstEntry&&tr==='enter_draw')draw(side,1);if(firstEntry&&tr==='enter_shield')field(side).forEach(a=>nextShield(a,20));if(firstEntry&&tr==='enter_heal')field(side).forEach(a=>heal(a,10));
 if((typeof RESTORED_IDS!=='undefined'&&RESTORED_IDS.has(h.id))||(h.id>=1000&&h.id<=1035))return;
 switch(h.id){case 1000:for(let x of field(side))nextShield(x,20);log('ルネ：制御装甲、味方の次の被ダメージ−20');break;case 1003:searchDeck(side,c=>/^[123]MP$/.test(c));break;case 1024:for(let x of field(side))nextShield(x,20);log('ノルシュ：灼熱防空が発動');break;case 1026:h.nextHalf++;log('ルチル：次の被攻撃を半減');break;case 1030:for(let x of field(side))nextShield(x,20);log('フローリア：風の編制が発動');break;case 1033:draw(side,1);log('シエンラ：機動通信で1枚引く');break;}
}
function officialTraitFormation(side){const f=field(side);if(f.length!==3)return;for(const h of f){const tn=traitNameOf(h);if(tn==='じつはリーダー')for(const x of f)buff(x,'defense',10,0);if(tn==='じつはサブリーダー')for(const x of f)buff(x,'attack',10,0);if(tn==='じつはむしょく'&&!h.officialMaxHpBoosted){for(const x of f){x.maxHp+=10;x.hp=Math.min(x.maxHp,x.hp+10)}h.officialMaxHpBoosted=true;log('とくせい「じつはむしょく」：味方全員の最大HP＋10')}}}
function beginTurn(){game.phase='acting';for(let s=0;s<2;s++){let p=game.players[s],old=p.field.slice();for(let h of p.team)h.wasInFieldPreviousTurn=old.includes(h.uid);p.field=game.planned[s].slice();for(let h of field(s))if(!old.includes(h.uid))onEnter(h)}for(let s=0;s<2;s++)officialTraitFormation(s);
 // ステータス異常を場のキャラにのみ適用、行動順の前に解決。
 for(let s=0;s<2;s++)for(let h of field(s).slice()){if(h.burn)directDamage(null,h,h.burn*5,'やけどの継続ダメージ',false);if(h.poison)directDamage(null,h,h.poison*5,'どくの継続ダメージ',false);if(h.confusion){directDamage(null,h,10*Math.min(2,h.confusion),'こんらんの継続ダメージ',false);h.confusion=Math.max(0,h.confusion-1)}}
 if(processDeathQueue())return;if(checkVictory())return;log(`両軍の配置が確定。素早さ順に行動`);nextActor()}
function availableActors(){return [0,1].flatMap(s=>field(s).filter(h=>!h.acted).map(h=>({side:s,unit:h})))}
function nextActor(){if(game.phase==='ended')return;if(checkVictory())return;let all=availableActors();if(!all.length){endRound();return}
 const maximum=Math.max(...all.map(a=>stat(a.unit,'speed'))),high=all.filter(a=>stat(a.unit,'speed')===maximum);let chosen=high[rand(high.length)];
 let h=chosen.unit,s=chosen.side;
 if(h.skipNextAction>0){h.skipNextAction--;h.acted=true;log(`${h.name}は効果により行動できない`);return nextActor()}
 if(h.combustion>0){h.combustion=0;if(typeof sourceOnCombustion==='function')sourceOnCombustion(h);directDamage(null,h,10,'燃焼の継続ダメージ',false);if(h.hp<=0){h.acted=true;if(processDeathQueue())return;return nextActor()}}
 if(h.sleep&&traitNameOf(h)==='そろそろ起きなきゃ')h.sleep=Math.max(0,h.sleep-1);else if(h.sleep){h.sleep=Math.max(0,h.sleep-1);h.acted=true;log(`${h.name}はねむりで行動できない`);return nextActor()}
 if(h.poison&& !roll(Math.pow(.9,h.poison))){h.acted=true;log(`${h.name}の行動はどくで失敗`);return nextActor()}
 officialTraitAtAction(h);if(game.phase==='ended')return;
 if(h.hp<=0){h.acted=true;if(processDeathQueue())return;return nextActor()}
 game.current={side:s,uid:h.uid};selected=null;
 if(game.mode==='ai'&&s===1){game.actionBanner={side:s,actorUid:h.uid,actorName:h.name,skillName:'行動を選択中…',description:'AIが使用する技と対象を判断しています。',status:'思考中',resultLines:[]};render();persist();setTimeout(()=>takeAiAction(),AI_ACTION_DELAY_MS)}else{render();persist()}
}
function endRound(){if(typeof sourceEndRound==='function')sourceEndRound();for(let s=0;s<2;s++){let p=game.players[s];for(let h of p.team)h.buffs=h.buffs.filter(b=>b.until>game.turn)}
 // 戦闘終了条件：そのターン終了時、フィールド上の味方が全員倒れていた側が敗北。
 let lose0=game.planned[0].every(uid=>game.players[0].team.find(h=>h.uid===uid)?.hp<=0),lose1=game.planned[1].every(uid=>game.players[1].team.find(h=>h.uid===uid)?.hp<=0);if(lose0||lose1){finish(lose0&&lose1?-1:lose0?1:0);return}
 beginRound();render()}
async function takeAiAction(){if(!game||game.phase!=='acting'||!game.current||game.current.side!==1||waiting)return;
 let h=game.players[1].team.find(x=>x.uid===game.current.uid);if(!h||h.hp===0)return nextActor();
 let skills=HERO_MAP[h.id].skills;let candidates=skills.map((s,i)=>({s,i,p:getPayment(1,s)})).filter(x=>x.p&&!skillExhausted(h,x.s,x.i)&&canAiUseSkill(h,x.s,x.i)&&!(h.banAttackTurn===game.turn&&isAttackSkill(x.s)));
 let healing=candidates.filter(x=>/(回復|HP\+|HPを.+回復|治療)/.test(x.s.desc+' '+x.s.name));
 let chosen=(field(1).some(x=>x.hp<x.maxHp-30)&&healing.length&&roll(.55))?healing[rand(healing.length)]:(candidates.length&&roll(.78)?candidates[rand(candidates.length)]:null);
 let targ=chosen?skillTargetType(h,chosen.s,chosen.i):'enemy',pool=targ==='ally'?field(1):targ==='self'?[h]:targ==='any'?[...field(0),...field(1)]:field(0);
 let t=(targ==='none'?null:targ==='self'?h:targ==='ally'?(pool.slice().sort((a,b)=>(b.maxHp-b.hp)-(a.maxHp-a.hp))[0]):targ==='any'?pool[rand(pool.length)]:pool.slice().sort((a,b)=>a.hp-b.hp)[0]);
 if(!t&&targ!=='none'){chosen=null;t=field(0)[0]}
 if(!chosen&&!t){log(`${h.name}は対象がいないためパス`);endAction(h);return}
 if(chosen)await actSkill(h,chosen.i,t);else await actNormal(h,t);
}
async function actNormal(h,target){if(waiting||!target||h.hp<=0)return;if(h.banAttackTurn===game.turn){log(`${h.name}は攻撃制限中のため通常攻撃できない`);endAction(h);return}waiting=true;selected=null;let s=ownerOf(h);game.actionBanner={side:s,actorUid:h.uid,actorName:h.name,skillName:'通常攻撃',description:'コスト不要。こうげき値と相手のぼうぎょ値をもとにダメージを計算します。',status:'発動中',resultLines:[]};log(`${s?'赤':'青'} ${h.name}：通常攻撃`);game.actionNameCharLog=game.actionNameCharLog||[];game.actionNameCharLog.push({side:s,length:kanaCount('通常攻撃')});render();persist();await pause(ACTION_REVEAL_DELAY_MS);
 const normalHit=async()=>{let count=(h.id>=1030&&h.id<=1035)||HERO_MAP[h.id]?.traitEffect==='triple35'?3:1,power=count===3?Math.round(stat(h,'attack')*.35/10)*10:stat(h,'attack');
 for(let i=0;i<count;i++){if(target.hp<=0)break;await damage(h,target,power,0,{normal:true,name:'通常攻撃 '+(count>1?`${i+1}/${count}`:'')});if(game.phase==='ended')break}}
 await normalHit();if(h.id===1032&&claim(h,'extraNormal')&&roll(.3)&&target.hp>0&&game.phase!=='ended'){log('ビスコット：飛翔の連打が追加発動');await normalHit()}
 if(game.actionBanner?.actorUid===h.uid){game.actionBanner.status='処理完了';game.actionBanner.resultLines=game.log.slice(0,5).reverse();render();persist();await pause(ACTION_RESULT_DELAY_MS)}waiting=false;endAction(h)}
async function actSkill(h,index,target){if(waiting||h.hp<=0)return;let side=ownerOf(h),skill=HERO_MAP[h.id].skills[index],payment=getPayment(side,skill);if(!payment){alert('必要なMP・属性カードが手札にありません。');return}
 if(skillExhausted(h,skill,index)){alert('この技はゲーム中の使用回数上限に達しています。');return}
 if(h.banSkills){h.banSkills=0;alert('このキャラクターは持ち技を封じられています。');return}
 if(h.sleep&&traitNameOf(h)==='そろそろ起きなきゃ'&&isAttackSkill(skill)&&skill.name!=='めざまし止めなきゃ'){log(`${h.name}はねむり中、「めざまし止めなきゃ」以外の攻撃技を使えない`);return}
 if(h.banAttackTurn===game.turn&&isAttackSkill(skill)){log(`${h.name}は攻撃制限中のため「${skill.name}」を使えない`);return}
 waiting=true;selected=null;consume(side,payment);if(skillUseLimit(skill)!==null){h.usedSkills=h.usedSkills||{};h.usedSkills[index]=Number(h.usedSkills[index]||0)+1}
 game.actionBanner={side,actorUid:h.uid,actorName:h.name,skillName:skill.name,description:skill.desc||'効果説明なし',status:'発動中',resultLines:[]};log(`${side?'赤':'青'} ${h.name}：「${skill.name}」を発動（${payment.length}枚消費）`);game.currentSkillSpecial=skill.special||[];game.lastSkillNameBySide=game.lastSkillNameBySide||[];game.lastSpecialUsedBySide=game.lastSpecialUsedBySide||[[],[]];game.actionNameCharLog=game.actionNameCharLog||[];game.actionNameCharLog.push({side,length:kanaCount(skill.name)});if((skill.special||[]).includes('やみ'))game.lastDarkSkillUsed=true;render();persist();await pause(ACTION_REVEAL_DELAY_MS);
 if(skill.name==='みがわり'){rememberLastSkillUse(side,skill);h.tauntTurn=game.turn+1;log(`${h.name}「みがわり」：次のターン、敵の攻撃をすべて引き受ける`);game.actionBanner.status='処理完了';game.actionBanner.resultLines=game.log.slice(0,5).reverse();waiting=false;endAction(h);return}
 if(target&&isAttackSkill(skill)&&ownerOf(target)!==side)target=forceTauntTarget(h,target);
 if(target&&skill.special.includes('やみ')&&traitNameOf(target)==='もんばん'){log(`とくせい：${target.name}「もんばん」がやみカードの効果を無効化`);rememberLastSkillUse(side,skill);game.actionBanner.status='処理完了';game.actionBanner.resultLines=game.log.slice(0,6).reverse();waiting=false;render();persist();await pause(ACTION_RESULT_DELAY_MS);endAction(h);return}
 if(target&&skill.special.includes('水')&&traitNameOf(target)==='地に足うまってる'){log(`とくせい：${target.name}「地に足うまってる」が水カードの効果を無効化`);rememberLastSkillUse(side,skill);game.actionBanner.status='処理完了';game.actionBanner.resultLines=game.log.slice(0,6).reverse();waiting=false;render();persist();await pause(ACTION_RESULT_DELAY_MS);endAction(h);return}
 if(skill.special.length){for(let x of field(side))if(x.id===1027&&claim(x,'flameHeal'))heal(h,10)}
 if(typeof sourceOnSkillCast==='function')sourceOnSkillCast(h,target);
 try{let manual=await skillEffect(h,index,target);if(manual){rememberLastSkillUse(side,skill);if(game.actionBanner)game.actionBanner.status='手動処理待ち';waiting=false;render();persist();return}}catch(e){console.error(e);log('効果処理にエラーが発生：'+e.message)}
 rememberLastSkillUse(side,skill);if(game.actionBanner?.actorUid===h.uid){game.actionBanner.status='処理完了';game.actionBanner.resultLines=game.log.slice(0,6).reverse();render();persist();await pause(ACTION_RESULT_DELAY_MS)}waiting=false;endAction(h)}
function rememberLastSkillUse(side,skill){game.lastSkillSpecial=skill?.special||[];game.lastSkillSide=side;game.lastSkillName=skill?.name||'';game.lastSkillNameBySide=game.lastSkillNameBySide||[];game.lastSkillNameBySide[side]=game.lastSkillName;game.lastLeafSkillUsed=(skill?.special||[]).includes('葉っぱ');}
function processDeathQueue(){if(!game||game.phase==='ended'||game.manualPending||!game.pendingDeathTraits?.length)return false;game.manualPending=game.pendingDeathTraits.shift();log('死亡時効果を手動裁定で処理：'+game.manualPending.skillName);render();persist();return true}
function activateTrait(h){if(!game||!h||h.hp<=0||!selectableTrait(h)||traitExhausted(h))return;let c=HERO_MAP[h.id];h.traitUses=Number(h.traitUses||0)+1;game.actionBanner={side:ownerOf(h),actorUid:h.uid,actorName:h.name,skillName:'とくせい：'+c.traitName,description:c.trait,status:'発動中',resultLines:[]};game.actionNameCharLog=game.actionNameCharLog||[];game.actionNameCharLog.push({side:ownerOf(h),length:kanaCount(c.traitName)});log(`${h.name}：とくせい「${c.traitName}」を発動宣言`);if(h.id===2){for(let ally of field(ownerOf(h))){let old=ally.hp;ally.hp=Math.max(ally.hp,Math.ceil(ally.maxHp/2));if(ally.hp>old)log(`とくせい：${ally.name} HP ${old} → ${ally.hp}`)}game.actionBanner.status='処理完了';game.actionBanner.resultLines=game.log.slice(0,6).reverse();render();persist();return}if(h.id===5){if(game.phase!=='select'||!game.players[ownerOf(h)].field.includes(h.uid)){h.traitUses=Math.max(0,h.traitUses-1);alert('「いそぎのようじ」はターン開始時、フィールドにいる場合のみ発動できます。');return}game.players[ownerOf(h)].field=[];if(typeof plannedChoices!=='undefined')plannedChoices=[];log('いそぎのようじ：フィールドの仲間全員をベンチへ戻した');game.actionBanner.status='処理完了';game.actionBanner.resultLines=game.log.slice(0,6).reverse();render();persist();return}game.manualPending={actorUid:h.uid,skillName:'とくせい：'+c.traitName,description:c.trait,targetUid:field(ownerOf(h))[0]?.uid||game.players[ownerOf(h)].team.find(x=>x.hp>0)?.uid||null,consumeAction:c.traitName==='やまぶし',traitActivation:true,resumePhase:game.phase};if(game.actionBanner)game.actionBanner.status='手動処理待ち';render();persist()}
function endAction(h){if(!game||game.phase==='ended'){render();persist();return}h.acted=true;h.actionNameCursor=(game.actionNameCharLog||[]).length;if(typeof sourceOnEndAction==='function')sourceOnEndAction(h);
 if(h.marks>0)burst(h);
 game.currentSkillSpecial=[];
 if(h.banSkills>0){h.banSkills=0} // 技封印は次の行動順終了で解除
 if(processDeathQueue())return;if(!checkVictory())nextActor();render();persist()}
const doHit=async(h,t,power,trueDmg=0,name='持ち技')=>await damage(h,t,power,trueDmg,{name});
async function attackAdjacent(h,t,value,boost=false){for(let a of enemyAdjacent(t).slice()){let n=value+(boost&&h.id===1017&&h.armor.light?10:0);if(a.hp>0)await attackSplash(h,a,n)}}
async function attackSplash(h,target,amount){if(target.hp<=0)return;target=forceTauntTarget(h,target);if(!target||target.hp<=0)return;let d=amount;d=applyDefencesSync(h,target,d,'拡散攻撃');let k=await chooseArmor(target,d);if(k&&target.armor[k]){target.armor[k]=false;d=Math.max(0,d-(k==='light'?15:35));onArmorSpent(target,k);log(`${target.name}の装甲が拡散攻撃で消費された`)}directDamage(h,target,d,'拡散の確定ダメージ',false)}
function burnGroup(side){return field(side).filter(h=>h.burn>0)}
function canAttack(h){return !!h&&h.hp>0}
// 36人×2技をカード本文に従って解決。
async function skillEffect(h,i,t){let s=ownerOf(h),f=field(s),en=field(1-s),id=h.id,shot=async(p,bonus=0)=>{if(t&&t.hp>0)await doHit(h,t,p,bonus,HERO_MAP[id].skills[i].name)};
 if(id<=91)return await executeImportedSkill(h,i,t);
 if(typeof restoredSkillEffect==='function'&&typeof RESTORED_IDS!=='undefined'&&RESTORED_IDS.has(id))return await restoredSkillEffect(h,i,t);
 if(id>=1000&&id<=1035)return sourceManualSkill(h,i,t);
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

// 公式No.1〜91の効果はカード本文を優先して処理する。曖昧な選択・コピー・巻き戻しは手動裁定へ送る。
function kanaCount(value){const hira=String(value||'').replace(/[ァ-ヶ]/g,ch=>String.fromCharCode(ch.charCodeAt(0)-0x60));return (hira.match(/[ぁ-ゖー]/g)||[]).length}
function traitNameOf(h){return h?.copiedTraitName||HERO_MAP[h?.id]?.traitName||''}
function traitTextOf(h){return h?.copiedTraitText||HERO_MAP[h?.id]?.trait||''}
function officialTraitAttackBonus(h){if(!game||!h||h.hp<=0)return 0;const side=ownerOf(h),f=field(side),idx=f.findIndex(x=>x.uid===h.uid),tn=traitNameOf(h);let b=0;
 if(tn==='いっぴきおおかみ'&&idx>=0&&f.length<3)b+=((idx===0?1:0)+(idx===f.length-1?1:0))*10;
 if(tn==='ツンデレ'&&f.length>=2)b+=20;
 if(tn==='さんばんめ'&&idx===0)b+=10;
 if(tn==='もう死んだのか？')b+=game.players[1-side].team.filter(x=>x.hp<=0).length*10;
 if(tn==='旅人'&&h.enteredTurn===game.turn&&!h.wasInFieldPreviousTurn)b+=10;
 {const myIdx=game.players[side].field.indexOf(h.uid),foeUid=game.players[1-side].field[myIdx],foe=game.players[1-side].team.find(x=>x.uid===foeUid);if(traitNameOf(foe)==='戦わずして')b-=10}
 return b}
function officialTraitDefenseBonus(h){if(!game||!h||h.hp<=0)return 0;const side=ownerOf(h),f=field(side),tn=traitNameOf(h);let b=0;
 if(tn==='ツンデレ'&&f.length===1)b+=10;
 if(tn==='ガーデニング'&&(game.lastSkillSpecial||[]).includes('葉っぱ'))b+=10;
 return b}
function officialTraitSpeedBonus(h){if(!game||!h||h.hp<=0)return 0;return 0}
function officialTraitDamageReduce(actor,target,amount,options={}){if(!target||!actor)return amount;const tn=traitNameOf(target),name=String(options.name||'');let reduce=0;
 if(tn==='たいいくがよかった'){const n=kanaCount(name);if(n>=8&&n<=10)reduce+=10;else if(n>10)reduce+=20}
 if(tn==='しゅっぱんしゃ'){const side=ownerOf(target),events=(game.actionNameCharLog||[]).slice(Number(target.actionNameCursor||0)).filter(x=>x.side!==side);const n=events.reduce((a,x)=>a+x.length,0);if(n>=24&&n<=30)reduce+=20;else if(n>30)reduce+=30}
 if(reduce){log(`とくせい：${target.name}「${tn}」で被ダメージ−${reduce}`);amount=Math.max(0,amount-reduce)}
 return amount}
function officialTraitOnHit(actor,target,amount,options={}){if(!actor||!target||ownerOf(actor)===ownerOf(target))return;const tn=traitNameOf(target),side=ownerOf(target),f=game.players[side].team,lineup=game.planned?.[side]||game.players[side].field,idx=lineup.indexOf(target.uid);
 if(tn==='せんもんかには'){directDamage(target,actor,10,`とくせい：${target.name}「せんもんかには」`,false)}
 if(idx>=0){for(const guard of f){if(guard.hp<=0||traitNameOf(guard)!=='こいするおとめ')continue;const gi=lineup.indexOf(guard.uid),protectedUid=gi>0?lineup[gi-1]:lineup[gi+1];if(protectedUid===target.uid){directDamage(guard,actor,30,`とくせい：${guard.name}「こいするおとめ」`,false);break}}}
}
function officialTraitAfterAttack(actor,target,options={}){if(!actor||!target||target.hp<=0)return;const tn=traitNameOf(actor);
 if(tn==='こねこのひとみ'||tn==='こねこ'){if(roll(.2)){target.banAttackTurn=Math.max(target.banAttackTurn||-1,game.turn+1);log(`とくせい：${actor.name}「${tn}」で${target.name}は次のターン攻撃できない`)}}
 if(tn==='きたかぜこぞう'&&roll(.2)){buff(target,'defense',-20,1);log(`とくせい：${actor.name}「きたかぜこぞう」で${target.name}のぼうぎょ−20`)}
 if(tn==='マジシャン'&&roll(.1))ailment(target,'confusion')
}
function officialTraitOnEnter(h){if(!game||!h||h.hp<=0)return;const tn=traitNameOf(h),side=ownerOf(h),f=field(side),idx=f.findIndex(x=>x.uid===h.uid),neighbors=[f[idx-1],f[idx+1]].filter(Boolean);
 if(tn==='キャラバン')draw(side,1);
 if(tn==='はやおき')searchDeck(side,c=>/^[123]MP$/.test(c));
 if(tn==='フィルン')for(const x of f)heal(x,10);
 if(tn==='ふうじんみならい')for(const x of f)buff(x,'speed',10,1);
 if(tn==='みお'&&roll(.5))heal(h,10);
 if(tn==='きゅーた'||tn==='マンジャ'){const pool=neighbors.slice().sort((a,b)=>a.hp-b.hp);if(pool[0])heal(pool[0],10)}
 if(tn==='みらい')for(const x of neighbors)if(stat(x,'defense')<=stat(h,'defense'))heal(x,10);
 if(tn==='あとつぎ'&&f.some(x=>x.uid!==h.uid&&x.hp>0&&x.hp<=x.maxHp*.1))buff(h,'attack',10,1);
 if(tn==='なりすまし'){const pool=[...field(0),...field(1)].filter(x=>x.uid!==h.uid);if(pool.length){const picked=pool[rand(pool.length)];h.copiedTraitName=traitNameOf(picked);h.copiedTraitText=traitTextOf(picked);log(`とくせい：${h.name}「なりすまし」→ ${picked.name}のとくせい「${h.copiedTraitName||'なし'}」をコピー`)}}
 if(tn==='みぃ'&&h.maxHp>0)h.turnStartHp=h.hp;
}
function officialTraitTurnStart(){if(!game)return;for(let side=0;side<2;side++){const f=field(side);for(const h of f){const tn=traitNameOf(h);
 if(tn==='ポーションマスター'){const seq=['attack','defense','speed'];const stage=Number(h.potionStage||0);buff(h,seq[stage],10,0);h.potionStage=(stage+1)%3;if(roll(.1)){h.maxHp+=10;heal(h,10);log(`とくせい：${h.name}「ポーションマスター」で最大HP＋10`)}}
 if(tn==='運命のコイン')buff(h,'attack',roll(.5)?20:-20,0);
 if(tn==='ゆめみのささやき'){const i=f.findIndex(x=>x.uid===h.uid),neighbor=f[i-1]||f[i+1];if(neighbor){const st=['attack','defense','speed'][rand(3)];buff(neighbor,st,10,0);log(`とくせい：${h.name}「ゆめみのささやき」→ ${neighbor.name}の${st}＋10`)}}
 if(tn==='げいじゅつか'){if(roll(.5)){buff(h,'attack',20,0);buff(h,'defense',-20,0)}else{buff(h,'attack',-20,0);buff(h,'defense',20,0)}}
 }
 }
 if(game.turn%2===0){for(let side=0;side<2;side++)for(const h of field(side)){const tn=traitNameOf(h);if(tn==='しんきろうに魅せられて'){const pool=field(1-side);if(pool.length)directDamage(null,pool[rand(pool.length)],10,`とくせい：${h.name}「${tn}」`,false)}if(tn==='マッドサイエンス'){const pool=[...field(0),...field(1)];if(pool.length)directDamage(null,pool[rand(pool.length)],10,`とくせい：${h.name}「${tn}」`,false)}}}
 for(let side=0;side<2;side++)for(const h of field(side))if(traitNameOf(h)==='こどものえがお')for(const x of field(side))if(x.uid!==h.uid&&x.maxHp<h.maxHp)heal(x,10)
}
function officialTraitAtAction(h){if(!h||h.hp<=0)return;const tn=traitNameOf(h);if(tn==='ラッキー！'){const pool=field(1-ownerOf(h));if(pool.length){const t=pool[rand(pool.length)];directDamage(h,t,10,`とくせい：${h.name}「ラッキー！」`,false)}}}
function isAttackSkill(skill){const d=String(skill?.desc||'');return /\d+\s*ダメージ|HP\s*[-−]\s*\d+|攻撃のダメージ|確定\d+ダメージ/.test(d)||['damage','true_damage'].includes(skill?.effect?.type)}
function skillTargetType(h,skill,index=0){const d=String(skill?.desc||''),name=String(skill?.name||'');if(name==='みがわり')return 'self';if(h?.id>=1000&&TARG[h.id]?.[index])return TARG[h.id][index];
 if(/敵全体|敵全員|敵のキャラクター全員|フィールド上の敵全員|すべての敵|全ての敵|フィールド上の全て|フィールド上のすべて|味方全員|味方全て|味方キャラクター全員|味方のキャラクター全員|フィールドに出ている味方キャラクター全員|すべての仲間|全ての仲間|両軍全員/.test(d))return 'none';
 if(/フィールド上のキャラクター.{0,8}(?:1人|一人|1体|一体)|キャラクター一人/.test(d))return 'any';
 if(/味方|仲間/.test(d)&&!/(敵|相手)/.test(d))return /(?:1人|一人|1体|一体)/.test(d)?'ally':'none';
 if(/このキャラクター|自分自身|自身/.test(d)&&!/(敵|相手|味方|仲間)のキャラクター/.test(d))return 'self';
 if(/次に受ける攻撃|敵の攻撃を受けない|攻撃を受けない/.test(d)&&!/(敵|相手|味方|仲間)のキャラクター1人/.test(d))return 'self';
 if(/山札から|カードを引く|手札を/.test(d)&&!/(敵|相手|味方|仲間)のキャラクター/.test(d))return 'none';
 return skill?.target||'enemy'}
function officialSkillNeedsManual(skill){const d=String(skill?.desc||'');return /コピー|使えるようになる|同じとくせい|同じ技|状態を.{0,8}戻す|前ターン終了時|好きなステータス|どちらか|いずれかを選択|選択する|入れ替え|手順\d+|相手プレイヤーに宣言|発動するか選択|そのうち\d+枚|確率|%|サイコロ|方位磁針|ふなよい/.test(d)}
function canAutoResolveOfficialSkill(skill){const d=String(skill?.desc||''),n=String(skill?.name||'');if(n==='みがわり'||n==='たかいたか～い')return true;if(officialSkillNeedsManual(skill))return false;return /\d+\s*ダメージ|HP\s*[+＋−-]\s*\d+|HPを.{0,12}回復|最大値の半分まで回復|(?:こうげき|攻撃|ぼうぎょ|防御|すばやさ|素早さ)\s*[+＋−-]\s*\d+|(?:やけど|どく|ねむり|こんらん|みりょう)状態|状態異常を\d*つ?解除|山札から.{0,12}枚|カードを\d+枚引く|攻撃できなく|行動できなく|攻撃を受けない|次に受ける攻撃.{0,10}(?:防ぐ|無効)|ベンチに戻る|ベンチに戻す|最大HP\s*[+＋−-]\s*\d+|ダメージ.{0,8}[+＋−-]\s*\d+/.test(d)}
function canAiUseSkill(h,skill,index){if(h.id<=91)return canAutoResolveOfficialSkill(skill);if(typeof RESTORED_IDS!=='undefined'&&RESTORED_IDS.has(h.id)&&index===0)return true;return !!TARG[h.id]||skill?.effect?.type!=='manual'}
async function executeOfficialSkill(h,index,target){const sk=HERO_MAP[h.id].skills[index],d=String(sk.desc||''),side=ownerOf(h),tn=traitNameOf(target);if(officialSkillNeedsManual(sk)){game.manualPending={actorUid:h.uid,skillName:sk.name,description:sk.desc,targetUid:target?.uid||h.uid,consumeAction:true};log(`手動裁定が必要：${h.name}「${sk.name}」`);return true}
 if(target&&((sk.special||[]).includes('やみ')&&tn==='もんばん'||(sk.special||[]).includes('水')&&tn==='地に足うまってる')){log(`とくせい：${target.name}のとくせいが属性カードの効果を無効化`);return false}
 if(sk.name==='たかいたか～い'){const foes=field(1-side);const foe=foes.slice().sort((a,b)=>a.hp-b.hp)[0];if(foe){const ah=h.hp,th=foe.hp;updateHp(h,-h.hp);updateHp(foe,-foe.hp);log(`${h.name}「${sk.name}」：自身HP ${ah}→0、${foe.name} HP ${th}→0`);return false}}
 const targetType=skillTargetType(h,sk,index),enemyAll=/敵全体|敵全員|敵のキャラクター全員|フィールド上の敵全員|すべての敵|全ての敵/.test(d),allyAll=/味方全員|味方全て|味方キャラクター全員|味方のキャラクター全員|フィールドに出ている味方キャラクター全員|すべての仲間|全ての仲間/.test(d),fieldAll=/フィールド上の全て|フィールド上のすべて|両軍全員/.test(d);
 let targets=enemyAll?field(1-side):allyAll?field(side):fieldAll?[...field(0),...field(1)]:target?[target]:(targetType==='self'?[h]:[]);if(/ランダムな敵/.test(d)&&!enemyAll){const pool=field(1-side);targets=pool.length?[pool[rand(pool.length)]]:[]}
 const originalTargets=targets.slice();targets=targets.filter(x=>!(((sk.special||[]).includes('やみ')&&traitNameOf(x)==='もんばん')||((sk.special||[]).includes('水')&&traitNameOf(x)==='地に足うまってる')));for(const x of originalTargets.filter(x=>!targets.includes(x)))log(`とくせい：${x.name}が属性カードの効果を無効化`);if(originalTargets.length&&!targets.length)return false;
 let applied=false;
 const directHp=d.match(/(?:HP|体力)\s*[-−]\s*(\d+)/);if(directHp&&targets.length){for(const x of targets)updateHp(x,-Number(directHp[1]));log(`${sk.name}：${targets.map(x=>x.name).join('、')}のHPを直接減少`);applied=true}
 const damageMatch=d.match(/(?:確定\s*)?(\d+)\s*ダメージ/);if(damageMatch){const amount=Number(damageMatch[1]),fixed=/確定\s*\d+\s*ダメージ/.test(d);if(targets.length){for(const x of targets.slice()){if(x.hp<=0)continue;if(((sk.special||[]).includes('やみ')&&traitNameOf(x)==='もんばん')||((sk.special||[]).includes('水')&&traitNameOf(x)==='地に足うまってる')){log(`とくせい：${x.name}「もんばん」がやみカードの効果を無効化`);continue}if(fixed)await damage(h,x,0,amount,{trueOnly:true,name:sk.name});else await damage(h,x,amount,0,{name:sk.name})}applied=true}}
 const halfHeal=/HPを最大値の半分まで回復|HPを最大HPの半分まで回復/.test(d);const healMatch=d.match(/HP\s*[+＋]\s*(\d+)|HPを\s*(\d+)\s*回復|HPを(\d+)回復/);if(halfHeal&&targets.length){for(const x of targets){const before=x.hp;x.hp=Math.max(x.hp,Math.ceil(x.maxHp/2));if(x.hp>before)log(`回復：${x.name} HP ${before}→${x.hp}`)}applied=true}else if(healMatch&&targets.length){const amount=Number(healMatch[1]||healMatch[2]||healMatch[3]);for(const x of targets)heal(x,amount);applied=true}
 const maxHpMatch=d.match(/最大HP\s*[+＋]\s*(\d+)/);if(maxHpMatch&&targets.length){for(const x of targets){x.maxHp+=Number(maxHpMatch[1]);log(`${x.name}の最大HP＋${maxHpMatch[1]}`)}applied=true}
 const drawMatch=d.match(/山札から\s*(?:MPカードを\s*)?(\d+)\s*枚|カードを\s*(\d+)\s*枚引く/);if(drawMatch){const count=Number(drawMatch[1]||drawMatch[2]||1);if(/MPカード/.test(d)){for(let n=0;n<count;n++)searchDeck(side,c=>/^[123]MP$/.test(c))}else draw(side,count);applied=true}
 const statRe=/(こうげき|攻撃|ぼうぎょ|防御|すばやさ|素早さ)\s*([+＋−-])\s*(\d+)/g;let sm;while((sm=statRe.exec(d))){const statName=/こうげき|攻撃/.test(sm[1])?'attack':/ぼうぎょ|防御/.test(sm[1])?'defense':'speed',amount=Number(sm[3])*(/[−-]/.test(sm[2])?-1:1);const statTargets=/味方全員|味方全て|味方キャラクター全員|味方のキャラクター全員|フィールドに出ている味方キャラクター全員|すべての仲間|全ての仲間/.test(d)?field(side):/敵全体|敵全員|敵のキャラクター全員|フィールド上の敵全員|すべての敵|全ての敵/.test(d)?field(1-side):targets.length?targets:[h];for(const x of statTargets)buff(x,statName,amount,/このターンのみ|このターンの間/.test(d)?0:/次のターン終了時まで|次のターンまで/.test(d)?1:0);log(`${sk.name}：${statTargets.map(x=>x.name).join('、')}の${statName}${amount>0?'+':''}${amount}`);applied=true}
 const statusMap=[['やけど','burn'],['どく','poison'],['ねむり','sleep'],['こんらん','confusion'],['みりょう','charm']];for(const [label,key] of statusMap){if(new RegExp(label+'(?:状態|を付与|にする|にさせる)').test(d)&&targets.length){for(const x of targets)ailment(x,key);applied=true}}
 if(/状態異常を\d*つ?解除|状態異常を治療/.test(d)&&targets.length){for(const x of targets)cure(x);applied=true}
 if(/攻撃できなく/.test(d)&&targets.length){for(const x of targets){x.banAttackTurn=Math.max(x.banAttackTurn||-1,game.turn+(/次のターン/.test(d)?1:0));log(`${x.name}は${x.banAttackTurn>game.turn?'次のターン':'このターン'}攻撃できない`)}applied=true}
 if(/行動できなく|行動不能/.test(d)&&! /攻撃できなく/.test(d)&&targets.length){for(const x of targets){x.skipNextAction=Math.max(x.skipNextAction||0,1);log(`${x.name}は次の行動を行えない`)}applied=true}
 if(/次に受ける攻撃.{0,12}(?:防ぐ|無効)|攻撃を受けない/.test(d)){for(const x of (targets.length?targets:[h])){if(/このターン/.test(d))x.shieldTurn=game.turn;else x.nextBarrier=(x.nextBarrier||0)+1;log(`${x.name}：次の攻撃を防ぐ効果を付与`)}applied=true}
 const reduceMatch=d.match(/(?:被ダメージ|受けるダメージ|攻撃のダメージ)\s*[-−]\s*(\d+)/);if(reduceMatch&&targets.length){const amount=Number(reduceMatch[1]);for(const x of targets)x.nextIn.push(amount);applied=true}
 if(/ベンチに戻す/.test(d)&&targets.length){for(const x of targets){game.players[ownerOf(x)].field=game.players[ownerOf(x)].field.filter(uid=>uid!==x.uid);log(`${x.name}をベンチへ戻した`)}applied=true}else if(/このキャラクターはベンチに戻る|自分をベンチに戻る|ベンチに戻る/.test(d)){game.players[side].field=game.players[side].field.filter(uid=>uid!==h.uid);log(`${h.name}がベンチへ戻る`);applied=true}
 if(!applied){game.manualPending={actorUid:h.uid,skillName:sk.name,description:sk.desc,targetUid:target?.uid||h.uid,consumeAction:true};log(`自動処理に未対応のため手動裁定：${h.name}「${sk.name}」`);return true}
 log(`公式カード効果を処理：${h.name}「${sk.name}」`);return false}

// 追加カードは、カード入力画面で指定した自動処理だけを実行する。
// 複雑な能力は必ず手動裁定に移行し、無言で無効化しない。
async function executeImportedSkill(h,i,t){let sk=HERO_MAP[h.id].skills[i],effect=sk.effect||{type:'manual',value:0};let amount=Math.max(0,Math.floor(Number(effect.value)||0));let s=ownerOf(h);
 if(h.id<=91)return await executeOfficialSkill(h,i,t);
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
 const names={attack_down:'こうげき減少',defense_down:'ぼうぎょ減少',speed_down:'すばやさ減少',charm:'みりょう付与',damage:'HP減少',heal:'HP回復',attack:'こうげき増加',defense:'ぼうぎょ増加',speed:'すばやさ増加',burn:'やけど付与',poison:'どく付与',sleep:'ねむり付与',confusion:'こんらん付与',magnet:'磁気波動付与',cure:'状態異常解除',light:'軽甲付与',heavy:'重甲付与',draw:'カードを引く'};
 const before={hp:t.hp,maxHp:t.maxHp,attack:stat(t,'attack'),defense:stat(t,'defense'),speed:stat(t,'speed'),burn:t.burn,poison:t.poison,sleep:t.sleep,confusion:t.confusion,charm:t.charm,marks:t.marks,light:t.armor.light,heavy:t.armor.heavy,hand:game.players[ownerOf(h)].hand.length};
 switch(op){case 'damage':updateHp(t,-amount);break;case 'heal':heal(t,amount);break;case 'attack':case 'defense':case 'speed':buff(t,op,amount,1);break;case 'attack_down':case 'defense_down':case 'speed_down':buff(t,op.replace('_down',''),-amount,1);break;case 'burn':case 'poison':case 'sleep':case 'confusion':ailment(t,op);break;case 'charm':ailment(t,'charm');break;case 'magnet':magnet(t,1);break;case 'cure':cure(t);break;case 'light':case 'heavy':armorAdd(t,op);break;case 'draw':draw(ownerOf(h),Math.max(1,amount));break;default:return}
 const after={hp:t.hp,maxHp:t.maxHp,attack:stat(t,'attack'),defense:stat(t,'defense'),speed:stat(t,'speed'),burn:t.burn,poison:t.poison,sleep:t.sleep,confusion:t.confusion,charm:t.charm,marks:t.marks,light:t.armor.light,heavy:t.armor.heavy,hand:game.players[ownerOf(h)].hand.length};
 const diffs=[];for(const key of ['hp','maxHp','attack','defense','speed'])if(before[key]!==after[key])diffs.push(`${({hp:'HP',maxHp:'最大HP',attack:'こうげき',defense:'ぼうぎょ',speed:'すばやさ'})[key]} ${before[key]}→${after[key]}`);for(const key of ['burn','poison','sleep','confusion','charm','marks'])if(before[key]!==after[key])diffs.push(`${({burn:'やけど',poison:'どく',sleep:'ねむり',confusion:'こんらん',charm:'みりょう',marks:'磁気波動'})[key]} ${before[key]}→${after[key]}`);for(const key of ['light','heavy'])if(before[key]!==after[key])diffs.push(`${key==='light'?'軽甲':'重甲'} ${before[key]?'あり':'なし'}→${after[key]?'あり':'なし'}`);if(before.hand!==after.hand)diffs.push(`操作側の手札 ${before.hand}→${after.hand}`);
 const reason=p.skillName||'手動調整';log(`手動パラメーター調整［${reason}］${t.name}：${diffs.join('、')||names[op]||op}（操作：${names[op]||op}${['damage','heal','attack','defense','speed','attack_down','defense_down','speed_down','draw'].includes(op)?' '+amount:''}）`);if(game.actionBanner)game.actionBanner.resultLines=game.log.slice(0,6).reverse();persist();render()}
async function finishManual(){let p=game?.manualPending;if(!p)return;let h=game.players.flatMap(x=>x.team).find(x=>x.uid===p.actorUid);game.manualPending=null;log('手動裁定完了：'+(p.skillName||'効果処理'));if(game.actionBanner){game.actionBanner.status='処理完了';game.actionBanner.resultLines=game.log.slice(0,6).reverse()};if(p.deathTrigger){render();persist();await pause(ACTION_RESULT_DELAY_MS);if(processDeathQueue())return;if(!checkVictory()&&game.phase==='acting')nextActor();render();persist();return}if(h&&p.consumeAction){render();persist();waiting=true;await pause(ACTION_RESULT_DELAY_MS);waiting=false;endAction(h)}else if(game.pendingDeathTraits?.length)processDeathQueue();else {checkVictory();render();persist()}}

function startAssist(side,name,target){if(waiting||game.phase!=='acting'||!game.current||game.current.side!==side)return;let p=game.players[side];if(p.assistUsed)return;
 let idx=p.hand.indexOf(name);if(idx<0)return;
 if(name==='まほうの甲冑'&&p.usedArmor){alert('まほうの甲冑は1試合に1回です');return}
 p.hand.splice(idx,1);p.discard.push(name);p.assistUsed=true;selected=null;log(`${side?'赤':'青'} 補助：「${name}」`);
 switch(name){case 'いずみのみず':heal(target,30);break;case 'にがいお茶':extraAttack(target,30);break;case 'つちのかたまり':buff(target,'defense',30,0);break;case 'かみなりのたね':buff(target,'speed',30,0);break;case 'かんぽうゼリー':cure(target);break;case '流れる魔力':p.mpMod-=1;break;case '止められた魔力':game.players[1-side].mpMod+=1;break;case 'まほうの甲冑':p.usedArmor=true;field(side).forEach(x=>x.shieldTurn=game.turn);break;case 'ひらめきの一手':if(p.hand.length){let j=rand(p.hand.length);p.discard.push(...p.hand.splice(j,1))}draw(side);break;case 'ヒメアオホノカ':field(side).forEach(h=>heal(h,10));break;case '市販結界装置':target.nextBarrier=(target.nextBarrier||0)+1;log(`${target.name}に市販結界装置を設置`);break;}
 render();persist()}
function targetOfAssist(name){return ['いずみのみず','にがいお茶','つちのかたまり','かみなりのたね','かんぽうゼリー','市販結界装置'].includes(name)?'ally':'none'}
function saveConfig(){try{localStorage.setItem('tcg_vivid_config',JSON.stringify({picks:config.picks,mode:config.mode}))}catch(e){}}
function persist(){if(!game)return;try{localStorage.setItem(LSKEY,JSON.stringify(game))}catch(e){}}
function restore(){try{let c=JSON.parse(localStorage.getItem('tcg_vivid_config')||'null');if(c&&c.picks?.every(p=>p.length===6))config={...config,...c};let saved=JSON.parse(localStorage.getItem(LSKEY)||'null');if(saved?.players?.length===2&&['select','acting','handoff','ended'].includes(saved.phase)){game=saved;game.pendingDeathTraits=game.pendingDeathTraits||[];for(let p of game.players){p.handSort=['drawn','type','mp'].includes(p.handSort)?p.handSort:'drawn';p.handSortOrder=['asc','desc'].includes(p.handSortOrder)?p.handSortOrder:'asc';for(let h of p.team){h.usedSkills=h.usedSkills||{};h.traitUses=Number(h.traitUses||0);if(h.tauntTurn===undefined)h.tauntTurn=-1;if(h.banAttackTurn===undefined)h.banAttackTurn=-1;if(h.skipNextAction===undefined)h.skipNextAction=0;if(h.combustion===undefined)h.combustion=0;if(h.turnStartHp===undefined)h.turnStartHp=h.hp;if(h.damageTakenThisTurn===undefined)h.damageTakenThisTurn=0;if(h.fukutsuUsed===undefined)h.fukutsuUsed=false;if(h.actionNameCursor===undefined)h.actionNameCursor=0;if(h.wasInFieldPreviousTurn===undefined)h.wasInFieldPreviousTurn=false}}waiting=false;game.pendingArmor=null;if(game.phase==='acting'&&game.current?.side===1&&game.mode==='ai')setTimeout(takeAiAction,AI_ACTION_DELAY_MS)}}catch(e){console.warn('保存データ復元失敗',e)}}
