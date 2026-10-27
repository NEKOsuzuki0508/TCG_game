/*
 * Source-based 36-card game integration (No.1000–1035).
 * Text and stats are in assets/data/cards.json.
 * Magnetic wave base damage: 10 fixed damage per mark (user ruling).
 * Effects requiring a player decision can use manual adjudication.
 */
'use strict';
const RESTORED_IDS = new Set(Array.from({length:36},(_,i)=>1000+i));
const SHIELD_OPENERS = new Set([1000,1008,1014,1020,1026,1032]);
const halfTeams = [1006,1024,1030];
function sourceSide(h){return ownerOf(h)}
function teamAlive(s){return game.players[s].team.filter(x=>x.hp>0)}
function hasAlive(s,id){return teamAlive(s).some(x=>x.id===id)}
function hasField(s,id){return field(s).some(x=>x.id===id)}
function currentEnemySide(h){return 1-ownerOf(h)}
function damageBoostForTrue(side,amount){return amount+(hasField(side,1010)?10:0)}
function sourceTrue(attacker,target,amount,label='確定ダメージ',extra=false){
 if(!target||target.hp<=0)return;
 const side=attacker?ownerOf(attacker):1-ownerOf(target);
 // Source's damage boost only applies to true-damage attacks/counters, not DoT.
 const dmg=extra?damageBoostForTrue(side,amount):amount;
 directDamage(attacker,target,dmg,label,true);
}
function sourceStartMatch(){
 for(let side=0;side<2;side++){
  const members=teamAlive(side);
  if(members.some(x=>SHIELD_OPENERS.has(x.id))){
   for(let h of members)h.oneHitShield=1;
   log(`${side?'赤':'青'}：開戦シールドをベンチを含む6人に付与`);
  }
  if(members.some(x=>x.id===1002)){
   for(let h of members)h.sourceHalfUntil=2;
   log(`${side?'赤':'青'}：ルネ「蒼雷華」味方全員の被攻撃を2ターン半減`);
  }
  if(members.some(x=>x.id===1024))searchDeck(side,c=>/^[123]MP$/.test(c));
 }
}
function sourceOnEnter(h){
 if(halfTeams.includes(h.id)&&h.id!==1002){
  const side=ownerOf(h);
  for(let x of teamAlive(side))x.sourceHalfUntil=Math.max(x.sourceHalfUntil||0,game.turn+1);
  log(`${h.name}：初出場から2ターン、味方全員の被攻撃を半減`);
 }
}
function sourceTurnStart(){
 for(let side=0;side<2;side++){
  const members=teamAlive(side),enemies=teamAlive(1-side);
  if(hasAlive(side,1013))for(let h of members)buff(h,'defense',10,0);
  if(hasAlive(side,1019)){
   const two=shuffled(enemies).slice(0,2);
   for(let h of two){buff(h,'attack',-10,0);buff(h,'defense',-10,0)}
  }
  if(hasAlive(side,1025)){
   const possible=enemies.filter(h=>!h.combustion);
   if(possible.length)sourceGiveCombustion(possible[rand(possible.length)]);
  }
  if(hasAlive(side,1030)&&roll(.5))searchDeck(side,c=>/^[123]MP$/.test(c));
  const p=game.players[side];
  if(p.nextTurnMpDiscount){p.mpMod-=1;p.nextTurnMpDiscount=false;log(`オルガ：このターンの技MPコストを−1`)}
 }
}
function sourceStatBonus(h,s){
 if(!game)return 0;
 const side=ownerOf(h),enemy=1-side;
 let value=0;
 if(s==='attack'){
  if(hasField(side,1001))value+=20;
  if(hasField(side,1007))value+=10;
  if(hasField(side,1031))value+=10;
  if(hasField(side,1025)&&field(enemy).some(x=>x.combustion))value+=20;
  if(h.id===1011){value+=field(side).filter(x=>x.hp<x.maxHp).length*10;if(teamAlive(side).length<6)value+=20;}
  if(h.id===1023)value+=field(enemy).filter(x=>sourceDebilitated(x)).length*10;
  if(h.id===1029&&field(enemy).some(x=>x.combustion))value+=10;
  if(h.marks&&hasAlive(enemy,1005))value-=10;
  if(sourceDebilitated(h)&&hasField(enemy,1022))value-=10;
 }
 if(s==='defense'){
  if(h.id===1029&&field(enemy).some(x=>x.combustion))value+=10;
  
  if(h.marks&&hasAlive(enemy,1005))value-=20;
 }
 if(s==='attack'&&h.id===1017&&field(side).reduce((total,x)=>total+stat(x,'defense'),0)>=150)value+=20;
 return value;
}
function sourceDebilitated(h){return !!(h.burn||h.poison||h.sleep||h.confusion||h.charm||h.combustion||statDebuff(h))}
function sourceAttackBonus(actor,target,side){
 let b=0;
 if(actor.id===1027&&target.combustion)b+=0; // true extra is separate
 if(hasField(side,1019)&&sourceDebilitated(target))b+=10;
 if(hasField(side,1013))b+=game.players[side].defenceTriggeredBonus||0;
 return b;
}
function sourceExtraTrue(actor,target,side){
 let bonus=0;
 if(hasField(side,1031)&&game.players[side].attacks>=1)bonus+=20;
 if(actor.id===1027&&target.combustion)bonus+=15;
 return bonus;
}
function sourceDamageReduce(actor,target,amount){
 const side=ownerOf(target);
 if((target.sourceHalfUntil||0)>=game.turn)amount=Math.ceil(amount/2);
 if(hasField(side,1006)&&game.players[side].sourceSkillReductions>0)amount=Math.max(0,amount-game.players[side].sourceSkillReductions*10);
 return amount;
}
function sourceOnMagnet(target,event,initiator=null){
 const owner=ownerOf(target),side=1-owner;
 if(hasAlive(side,1004))for(let x of teamAlive(side))heal(x,10);

 if(event==='burst'||event==='overflow'){
  if(hasField(side,1003)&&!game._magnetEcho){
   game._magnetEcho=true;
   try{for(let h of enemyAdjacent(target)){sourceTrue(null,h,10,'エレナ「連鎖電界」',true);if(h.hp>0)magnet(h,1)}}finally{game._magnetEcho=false}
  }
  if(event==='burst'&&initiator?.id===1001&&roll(.5)&&target.hp>0)magnet(target,1+rand(2));
 }
}
function sourceOnDebuff(target){
 const side=1-ownerOf(target),v=field(side).find(x=>x.id===1021);
 if(v){let pool=field(ownerOf(target)).filter(x=>x.hp>0);if(pool.length)sourceTrue(v,pool[rand(pool.length)],10,'ヴェイン「アビサルヴェノム」',true)}
}
function sourceGiveCombustion(target){
 if(!target||target.hp<=0||target.combustion)return false;
 target.combustion=1;log(`${target.name}に燃焼を付与（行動前確定15・重複不可）`);sourceOnDebuff(target);return true;
}
function sourceOnCombustion(target){
 const side=1-ownerOf(target);
 if(hasAlive(side,1026))sourceTrue(null,target,10,'ルチル「紅蓮壁」の追加',true);
 if(hasAlive(side,1028)){
  const wounded=teamAlive(side).sort((a,b)=>(b.maxHp-b.hp)-(a.maxHp-a.hp))[0];
  if(wounded)heal(wounded,10);
 }
}
function sourceOnHit(actor,target,amount,options){
 const side=ownerOf(target),other=ownerOf(actor);
 if(hasField(side,1007))sourceTrue(null,actor,20,'立華つむぎ「金遁の術」',true);
 if(target.id===1009)sourceTrue(target,actor,10,'ヴァネッサ「挑発の重盾」',true);
 if(actor.id===1018){buff(target,'attack',-10,1);buff(target,'defense',-10,1);sourceOnDebuff(target)}
 if(target.hp>0&&target.oneHitShield===0&&hasField(side,1013)){
  // Defensive trait only triggers on an actual defensive event; handled at shield consumption.
 }
}
function sourceAfterNormal(actor,target){
 const side=ownerOf(actor);
 if(hasAlive(side,1000)){
  let enemies=shuffled(field(1-side));let n=Math.min(enemies.length,2+rand(2));
  for(let e of enemies.slice(0,n))magnet(e,1);
 }
 if(actor.id===1035&&roll(.5)){
  buff(actor,'speed',10,1);
  if(target.hp>0)sourceTrue(actor,target,10,'エマ「オーバーブースト」',true);
 }
}
function sourceAfterAttack(actor,target,amount,options){
 const side=ownerOf(actor),n=game.players[side].attacks;
 if(n>=2&&hasField(side,1033)){
  let mm=field(side).find(x=>x.id===1033);
  if(mm&&claim(mm,'chainRadar')){let foes=field(1-side);if(foes.length)sourceTrue(mm,foes[rand(foes.length)],15,'メイメイ「チェインレーダー」',true)}
 }
}
function sourceOnEndAction(h){/* 磁気波動の行動終了処理はengine.jsのsettleMagnetAfterActionが担当。 */}
function sourceOnSkillCast(h,target){
 const side=ownerOf(h);
 if(hasField(side,1012)){
  for(let x of teamAlive(side))buff(x,'defense',10,0);
  if(target&&ownerOf(target)!==side){buff(target,'attack',-10,1);sourceOnDebuff(target)}
 }
 if(hasField(side,1006))game.players[side].sourceSkillReductions=(game.players[side].sourceSkillReductions||0)+1;
}
function sourceOnShieldBlocked(target){
 const side=ownerOf(target);
 if(hasAlive(side,1013)){
  let p=game.players[side];p.defenceTriggeredBonus=(p.defenceTriggeredBonus||0)+10;
  log(`マリナ「ミスとフォグ」味方の攻撃ダメージ＋10`);
 }
}
function sourceEndRound(){
 for(let s=0;s<2;s++){
  if(hasField(s,1034)&&game.players[s].attacks>=3)game.players[s].nextTurnMpDiscount=true;
 }
}
function sourceManualSkill(h,i,t){
 const sk=HERO_MAP[h.id].skills[i];
 game.manualPending={actorUid:h.uid,skillName:sk.name,description:sk.desc,targetUid:t?.uid||h.uid,consumeAction:true};
 log(`${h.name}「${sk.name}」：対象の選択を含む手動裁定`);
 return true;
}
async function restoredSkillEffect(h,i,t){
 if(i!==0)return sourceManualSkill(h,i,t);
 const id=h.id,side=ownerOf(h),en=field(1-side),team=teamAlive(side),skill=HERO_MAP[id].skills[0];
 const hit=async(power,bonus=0,who=t,opts={})=>{if(who&&who.hp>0)return damage(h,who,opts.trueOnly?0:power,opts.trueOnly?(power+bonus):bonus,{name:skill.name,...opts})||0;return 0};
 const trueHit=async(power,who=t)=>hit(0,power,who,{trueOnly:true});
 switch(id){
 case 1000: await hit(80);break;
 case 1001: for(let k=0;k<2;k++)if(t.hp>0)await hit(25);burst(t,0,h);break;
 case 1002: await hit(90);magnet(t);break;
 case 1003: await hit(60);for(const e of en.slice())burst(e,0,h);break;
 case 1004: for(const a of team)heal(a,30);cure(team.find(x=>sickness(x))||h);if(en.length)magnet(t||en[0]);break;
 case 1005: await hit(100,0,t,{trueOnly:!!t.marks});break;
 case 1006: await hit(90);break;
 case 1007: await hit(stat(h,'attack'),t.hp<t.maxHp/2?30:0);break;
 case 1008: {const e=en.slice().sort((a,b)=>a.hp-b.hp)[0];if(e)await hit(80,20,e);break;}
 case 1009: await hit(stat(h,'defense'),wasAttacked(h)?30:0);break;
 case 1010: heal(t,(t.flags?.lastHitTurn||0)===game.turn-1?50:30);break;
 case 1011: await hit(stat(h,'attack'),(6-team.length)*20);break;
 case 1012: await hit(90);break;
 case 1013: await hit(90,stat(h,'defense')>=60?30:0);break;
 case 1014: case 1015: await hit(id===1014?70:70);for(const a of enemyAdjacent(t))sourceTrue(h,a,20+(hasField(side,1016)?10:0),skill.name+'・拡散',true);break;
 case 1016: for(const e of [t,...enemyAdjacent(t)])buff(e,'speed',-20,1);buff(team[0]||h,'defense',10,1);break;
 case 1017: for(const e of en.slice()){await hit(50,0,e);if(en.length>=3&&e.hp>0)sourceTrue(h,e,20,'ギガディフュージョン追加',true)}break;
 case 1018: await hit(90);break;
 case 1019: await hit(stat(h,'attack'));t.banSkills=1;break;
 case 1020: await hit(80,sourceDebilitated(t)?40:0);break;
 case 1021: await hit(stat(h,'attack'));if(t.hp>0&&roll(.5))ailment(t,'confusion');if(t.hp>0&&roll(.5))ailment(t,'poison');break;
 case 1022: return sourceManualSkill(h,i,t); // player chooses ねむり or みりょう
 case 1023: await hit(100,0,t,{trueOnly:(Number(!!t.burn)+Number(!!t.poison)+Number(!!t.sleep)+Number(!!t.confusion)+Number(!!t.charm)+Number(!!statDebuff(t)))>=2});break;
 case 1024: await hit(90);if(t.hp>0){if(!t.combustion)sourceGiveCombustion(t);else sourceTrue(h,t,10,'ノルシュ・燃焼追加',true)}break;
 case 1025: await hit(stat(h,'attack'));if(t.combustion){t.combustion=0;sourceTrue(h,t,20,'リヴィア・燃焼爆発',true);let other=shuffled(en.filter(x=>x.uid!==t.uid&&!x.combustion))[0];if(other)sourceGiveCombustion(other)}break;
 case 1026: for(const e of en.slice()){await hit(40,0,e);if(e.hp>0){if(e.combustion)buff(e,'defense',-20,1);else if(roll(.5))sourceGiveCombustion(e)}}break;
 case 1027: await hit(stat(h,'attack'));if(t.combustion){t.combustion=0;for(const e of en.slice())sourceTrue(h,e,25,'イグナ・連鎖爆炎',true)}break;
 case 1028: heal(t,20);{let foe=shuffled(en.filter(e=>!e.combustion))[0];if(foe)sourceGiveCombustion(foe)}break;
 case 1029: await hit(100,0,t,{trueOnly:!!t.combustion});break;
 case 1030: await hit(90);break;
 case 1031: await hit(stat(h,'attack'),game.players[side].attacks>0?30:0);break;
 case 1032: for(let j=0;j<3&&t.hp>0;j++)await hit(30+j*15);break;
 case 1033: await hit(stat(h,'attack'),game.players[side].attacks*10);break;
 case 1034: {let prior=game.players[side].attacks>0;for(const e of en.slice()){await hit(40,0,e);if(prior&&e.hp>0)sourceTrue(h,e,20,'オルガ・追加爆撃',true)}break;}
 case 1035: {let n=game.players[side].attacks>=3?3:2;for(let j=0;j<n&&t.hp>0;j++)await hit(40);break;}
 default: return sourceManualSkill(h,i,t);
 }
 return false;
}
