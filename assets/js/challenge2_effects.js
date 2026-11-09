/* Challenge Level 2: enhanced enemy formations (No.1200-1235). */
'use strict';
function c2Has(side,id){return field(side).some(h=>h.id===id&&h.hp>0)}
function c2Alive(side,id){return game.players[side].team.some(h=>h.id===id&&h.hp>0)}
function c2Debilitated(h){return !!(h&&(h.burn||h.poison||h.sleep||h.confusion||h.charm||h.combustion||statDebuff(h)))}
function c2Ailmented(h){return !!(h&&(h.burn||h.poison||h.sleep||h.confusion||h.charm||h.combustion))}
function c2True(actor,target,n,label){
  if(!target||target.hp<=0)return 0;
  let amount=n;
  const side=actor?ownerOf(actor):1-ownerOf(target);
  if(c2Alive(side,1210))amount+=10;
  if(/磁気波動/.test(label||'')&&c2Has(side,1201))amount+=10;
  if(c2Alive(side,1219)&&c2Debilitated(target))amount+=15;
  if(/拡散|隣接|連鎖電界|アクアスピア|インパクトスプレッド|レイジアンカー/.test(label||'')&&c2Has(side,1216))amount+=10;
  return directDamage(actor,target,amount,label||'確定ダメージ',false);
}
function c2HealTeam(side,n){for(const x of game.players[side].team)if(x.hp>0)heal(x,n)}
function c2ShieldTeam(side){for(const x of game.players[side].team)if(x.hp>0)x.nextBarrier=(x.nextBarrier||0)+1}
function c2GiveBurn(target,damage=15){
  if(!target||target.hp<=0||target.combustion)return false;
  target.combustion=1;target.combustionDamage=damage;
  log(target.name+'に燃焼を付与（行動前に確定'+damage+'ダメージ）');
  if(typeof challenge2OnDebuff==='function')challenge2OnDebuff(target);
  return true;
}
function c2MagneticPower(source){return source?Math.round(stat(source,'attack')*.5):20;}
function c2Mark(target,count=1,power=20){
  if(!target||target.hp<=0)return;
  const side=1-ownerOf(target);
  if(c2Alive(side,1202)&&roll(.8))count+=2;
  for(let i=0;i<count;i++){
    if(target.marks<3){
      target.marks++;
      target.c2Marks=target.c2Marks||[];
      target.c2Marks.push(power);
      log('⚡ '+target.name+'に磁気波動（'+target.marks+'/3）');
      if(c2Alive(side,1204))c2HealTeam(side,10);
    }else{
      c2True(null,target,15,'磁気波動の超過');
      if(c2Alive(side,1204))c2HealTeam(side,10);
      challenge2MagnetChain(target);
    }
  }
}
function challenge2MagnetChain(target){
  const side=1-ownerOf(target);
  if(!c2Alive(side,1203)||game.c2MagnetChainActive)return;
  game.c2MagnetChainActive=true;
  try{
    const near=enemyAdjacent(target).slice();
    for(const x of near){c2Mark(x,1,c2MagneticPower(game.players[side].team.find(h=>h.id===1203&&h.hp>0)));c2True(null,x,10,'エレナ「連鎖電界」');}
  }finally{game.c2MagnetChainActive=false}
}
function challenge2Burst(target,initiator=null){
  if(!target||target.hp<=0||!target.marks)return;
  const count=target.marks,powers=Array.isArray(target.c2Marks)?target.c2Marks.slice(0,count):[];
  target.marks=0;target.c2Marks=[];
  log('⚡ '+target.name+'の磁気波動'+count+'枚が炸裂');
  for(let i=0;i<count;i++){
    c2True(initiator,target,(powers[i]||20),'磁気波動の炸裂');
    if(c2Alive(1-ownerOf(target),1204))c2HealTeam(1-ownerOf(target),10);
  }
  challenge2MagnetChain(target);
  if(initiator&&initiator.id===1201&&target.hp>0&&Math.random()<.5)c2Mark(target,1+Math.floor(Math.random()*2),c2MagneticPower(initiator));
}
function challenge2StartMatch(){
  for(let side=0;side<2;side++){
    const team=game.players[side].team;
    const hpBoostSources=team.filter(h=>h.id===1200||h.id===1208);
    for(const source of hpBoostSources){
      c2ShieldTeam(side);
      for(const h of team){h.maxHp=Math.round(h.maxHp*1.5);h.hp=Math.min(h.maxHp,Math.round(h.hp*1.5));}
      log(source.name+'：味方全員に開幕シールド・HP+50%');
    }
    const shieldSources=team.filter(h=>[1214,1220,1226,1232].includes(h.id));
    for(const source of shieldSources){c2ShieldTeam(side);log(source.name+'：味方全員に開幕シールド');}
    if(team.some(h=>h.id===1202||h.id===1212||h.id===1218))for(const h of team)h.halfDamageUntil=game.turn+1;
    if(team.some(h=>h.id===1224))searchDeck(side,c=>/^[123]MP$/.test(c));
    for(const h of team)if(h.id>=1230&&h.id<=1235)h.combo35=true;
  }
}
function challenge2OnEnter(h,firstEntry){
  if(!firstEntry)return;
  const side=ownerOf(h);
  if([1206,1224,1230].includes(h.id)){
    for(const ally of teamAlive(side))ally.halfDamageUntil=Math.max(ally.halfDamageUntil||0,game.turn+1);
    log(h.name+'：味方全体の被ダメージを2ターン半減');
  }
}
function challenge2TurnStart(){
  for(let side=0;side<2;side++){
    const foes=field(1-side),allies=field(side);
    if(c2Alive(side,1213))for(const x of allies)buff(x,'defense',10,0);
    if(c2Alive(side,1219)&&foes.length)for(const x of shuffled(foes).slice(0,2)){buff(x,'attack',-10,0);buff(x,'defense',-10,0);}
    if(c2Alive(side,1225)){const pool=game.players[1-side].team.filter(x=>x.hp>0&&!x.combustion);if(pool.length)c2GiveBurn(pool[rand(pool.length)],25);}
    if(c2Has(side,1230)&&roll(.5))searchDeck(side,c=>/^[123]MP$/.test(c));
    if(game.players[side].c2OlgaDiscount){game.players[side].c2OlgaDiscount=false;game.players[side].mpMod-=1;log('オルガ「重爆撃陣形」：このターンの技コスト−1MP');}
  }
}
function challenge2StatBonus(h,s){
  if(!h||h.hp<=0)return 0;
  const side=ownerOf(h),foes=field(1-side),allies=field(side);
  let n=0;
  if(h.id===1229&&foes.some(x=>x.combustion))n+=s==='attack'?15:s==='defense'?20:s==='speed'?10:0;
  if(h.id===1235&&s==='speed')n+=h.c2EmmaSpeedBonus||0;
  if(s==='attack'){
    if(c2Has(side,1201))n+=20;
    if(c2Alive(1-side,1205)&&h.marks>0)n-=10;
    if(c2Has(side,1207))n+=20;
    if(h.id===1211)n+=allies.filter(x=>x.hp<x.maxHp).length*10+(game.players[side].team.some(x=>x.hp<=0)?20:0);
    if(h.id===1217&&allies.reduce((v,x)=>v+stat(x,'defense'),0)>=150)n+=20;
    if(c2Alive(side,1225)&&foes.some(x=>x.combustion))n+=20;
    if(c2Has(1-side,1222)&&c2Ailmented(h))n-=10;
    if(h.id===1223)n+=foes.filter(c2Debilitated).length*15;
    if(c2Has(side,1231))n+=20;
  }
  if(s==='defense'){
    if(c2Alive(1-side,1205)&&h.marks>0)n-=20;
  }
  return n;
}
function challenge2DamageBonus(actor,target){return actor&&target&&c2Alive(ownerOf(actor),1219)&&c2Debilitated(target)?15:0;}
function challenge2DamageReduce(actor,target,amount){
  if(!target||amount<=0)return amount;
  let reduced=false;
  if((target.halfDamageUntil||0)>=game.turn){amount=Math.ceil(amount/2);reduced=true;}
  if((target.skillDamageReduceUntil||-1)>=game.turn){amount=Math.max(0,amount-10);reduced=true;}
  if(reduced)challenge2DefenseTrigger(ownerOf(target));
  return amount;
}
function challenge2OnSkillCast(actor,target){
  const side=ownerOf(actor);
  if(c2Has(side,1206))for(const x of teamAlive(side))x.skillDamageReduceUntil=game.turn;
  if(c2Has(side,1212)){
    for(const x of field(side))buff(x,'defense',10,0);
    if(target&&target.hp>0)buff(target,'attack',-10,0);
  }
}
function challenge2DefenseTrigger(side){
  if(c2Alive(side,1213))for(const x of teamAlive(side))x.attackDamageBonus=(x.attackDamageBonus||0)+10;
}
function challenge2OnHit(actor,target,amount,options){
  if(!actor||!target||amount<=0||ownerOf(actor)===ownerOf(target))return;
  const side=ownerOf(target);
  if(c2Has(side,1207))c2True(null,actor,20,'立華つむぎ「金遁の術」');
  if(target.id===1209)c2True(null,actor,10,'ヴァネッサ「挑発の重盾」');
  if(c2Has(1-side,1218)){buff(target,'attack',-10,0);buff(target,'defense',-10,0);}
  if(actor.id===1227&&target.combustion)c2True(actor,target,15,'イグナ「連鎖爆炎」');
}
async function challenge2AfterNormal(actor,target){
  const side=ownerOf(actor),foes=field(1-side);
  if(c2Alive(side,1200)&&foes.length){
    const count=Math.min(foes.length,2+rand(2));
    const magneticDamage=Math.round(stat(actor,'attack')*.5);
    for(const x of shuffled(foes).slice(0,count))c2Mark(x,1,magneticDamage);
  }
  if(actor.id===1232&&!actor.c2NormalTraitUsed&&!actor.c2ExtraNormalActive&&target&&target.hp>0){
    actor.c2NormalTraitUsed=true;
    if(roll(.5)){actor.c2ExtraNormalActive=true;log('ビスコット「ストリングエアショー」：追加通常攻撃');
      for(let i=0;i<3&&target.hp>0;i++)await damage(actor,target,Math.round(stat(actor,'attack')*.35),0,{normal:true,name:'追加通常攻撃'});
      actor.c2ExtraNormalActive=false;
    }
  }
  if(actor.id===1235&&!actor.c2EmmaTraitUsed){actor.c2EmmaTraitUsed=true;if(roll(.5)){actor.c2EmmaSpeedBonus=(actor.c2EmmaSpeedBonus||0)+10;if(foes.length)c2True(actor,foes[rand(foes.length)],10,'エマ「オーバーブースト」');}}
}
function challenge2AfterAttack(actor,target,amount,options){
  const side=ownerOf(actor);
  if(c2Has(side,1231)&&game.players[side].attacks>=2&&target&&target.hp>0)c2True(actor,target,20,'ギャビー「グリルファング」');
  if(c2Has(side,1233)&&game.players[side].attacks>=2&&!game.players[side].c2MeimeiTriggered){
    game.players[side].c2MeimeiTriggered=true;
    const pool=field(1-side);if(pool.length)c2True(actor,pool[rand(pool.length)],15,'メイメイ「チェインレーダー」');
  }
}
function challenge2OnDebuff(target){
  if(!target||target.hp<=0)return;
  const side=1-ownerOf(target),source=field(side).find(x=>x.id===1221);
  if(source){const pool=field(ownerOf(target));if(pool.length)c2True(source,pool[rand(pool.length)],10,'ヴェイン「アビサルヴェノム」');}
}
function challenge2OnDirectDamage(target,amount,reason){
  if(!target||amount<=0||/レイジアンカー/.test(reason||''))return;
  const side=1-ownerOf(target),source=field(side).find(x=>x.id===1215);
  if(!source)return;
  for(const x of enemyAdjacent(target).slice())c2True(source,x,15,'リオ「レイジアンカー」');
}
function challenge2Combustion(target){
  const side=1-ownerOf(target);
  if(c2Alive(side,1226))c2True(null,target,10,'ルチル「ドロップオブスターズ」');
  if(c2Alive(side,1228)){
    const allies=game.players[side].team.filter(x=>x.hp>0).sort((a,b)=>(b.maxHp-b.hp)-(a.maxHp-a.hp));
    if(allies[0])heal(allies[0],15);
  }
}
function challenge2EndRound(){
  for(let side=0;side<2;side++)if(c2Has(side,1234)&&game.players[side].attacks>=3)game.players[side].c2OlgaDiscount=true;
}
async function challenge2SkillEffect(h,i,t){
  const id=h.id,side=ownerOf(h),foes=field(1-side),allies=field(side),sk=HERO_MAP[id].skills[i];
  const hit=async(target,power,bonus=0,opts={})=>{if(target&&target.hp>0)await damage(h,target,power,opts.trueOnly?power+bonus:bonus,{name:sk.name,...opts});};
  const fixed=(target,n,label=sk.name)=>c2True(h,target,n,label);
  switch(id){
    case 1200:{await hit(t,80);const pool=field(1-side);for(let k=0;k<3&&pool.length;k++)c2Mark(pool[rand(pool.length)],1,c2MagneticPower(h));break;}
    case 1201:{let x=foes.filter(x=>x.marks>0).sort((a,b)=>b.marks-a.marks)[0]||t;for(let k=0;k<2&&x&&x.hp>0;k++)await hit(x,25);if(x&&x.hp>0)challenge2Burst(x,h);break;}
    case 1202:await hit(t,90);if(t.hp>0)c2Mark(t,1,c2MagneticPower(h));break;
    case 1203:await hit(t,60);for(const x of foes.slice())if(x.marks)challenge2Burst(x,h);break;
    case 1204:{for(const x of allies)heal(x,30);const cureTarget=allies.find(x=>x.sleep||x.burn||x.poison||x.confusion||x.charm)||allies[0];if(cureTarget)cure(cureTarget);if(t&&t.hp>0)c2Mark(t,1,c2MagneticPower(h));break;}
    case 1205:await hit(t,100,0,{trueOnly:!!t.marks});break;
    case 1206:await hit(t,90);break;
    case 1207:{const below=t.hp<t.maxHp*.5;await hit(t,stat(h,'attack'));if(below&&t.hp>0)fixed(t,30,'リベンジスラッシュ追加');break;}
    case 1208:{const x=foes.slice().sort((a,b)=>a.hp-b.hp)[0];if(x){await hit(x,80);if(x.hp>0)fixed(x,20,'スナイプリベンジ追加');}break;}
    case 1209:await hit(t,stat(h,'defense'));if((h.damageTakenThisTurn||0)>0&&t.hp>0)fixed(t,30,'カウンターブラスト追加');break;
    case 1210:{const prev=t.lastHitTurn===game.turn-1;heal(t,prev?50:30);break;}
    case 1211:{const fallen=game.players[side].team.filter(x=>x.hp<=0).length;await hit(t,stat(h,'attack'));if(fallen)fixed(t,fallen*20,'ファイナルリベンジ追加');break;}
    case 1212:await hit(t,90);break;
    case 1213:await hit(t,90);if(stat(h,'defense')>=60&&t.hp>0)fixed(t,30,'完全解析追加');break;
    case 1214:{const near=enemyAdjacent(t).slice();await hit(t,70);for(const x of near)fixed(x,20,'アクアスピア拡散');break;}
    case 1215:{const near=enemyAdjacent(t).slice();await hit(t,70);for(const x of near)fixed(x,20,'インパクトスプレッド拡散');break;}
    case 1216:{for(const x of [t,...enemyAdjacent(t)])buff(x,'speed',-20,1);const ally=allies.slice().sort((a,b)=>stat(a,'defense')-stat(b,'defense'))[0];if(ally)buff(ally,'defense',10,1);break;}
    case 1217:{const triple=foes.length>=3;for(const x of foes.slice()){await hit(x,50,0,{redirect:false});if(triple&&x.hp>0)fixed(x,20,'ギガディフュージョン追加');}break;}
    case 1218:await hit(t,90);break;
    case 1219:await hit(t,stat(h,'attack'));if(t.hp>0)t.banSkills=1;break;
    case 1220:await hit(t,80);if(t.hp>0&&c2Debilitated(t))fixed(t,40,'チェインキャノン追加');break;
    case 1221:await hit(t,stat(h,'attack'));if(t.hp>0){if(roll(.5))ailment(t,'confusion');if(roll(.5))ailment(t,'poison');}break;
    case 1222:ailment(t,roll(.5)?'sleep':'charm');buff(t,'defense',-15,1);break;
    case 1223:await hit(t,100,0,{trueOnly:c2Debilitated(t)});break;
    case 1224:await hit(t,90);if(t.hp>0){if(!t.combustion)c2GiveBurn(t,25);else fixed(t,10,'バタフライエフェクト追加');}break;
    case 1225:{const was=!!t.combustion;await hit(t,80);if(was){t.combustion=0;if(t.hp>0)fixed(t,20,'フレイムスプレッド燃焼爆発');const pool=field(1-side).filter(x=>x.uid!==t.uid&&!x.combustion);if(pool.length)c2GiveBurn(pool[rand(pool.length)]);}break;}
    case 1226:for(const x of foes.slice()){await hit(x,40,0,{redirect:false});if(x.hp>0){if(x.combustion)buff(x,'defense',-20,1);else if(roll(.5))c2GiveBurn(x);}}break;
    case 1227:{const was=!!t.combustion;await hit(t,90);if(was){t.combustion=0;for(const x of field(1-side).slice())fixed(x,25,'ブラストチェイサー連鎖爆炎');}break;}
    case 1228:heal(t,20);{const pool=game.players[1-side].team.filter(x=>x.hp>0&&!x.combustion);if(pool.length)c2GiveBurn(pool[rand(pool.length)]);}break;
    case 1229:await hit(t,100,0,{trueOnly:!!t.combustion});break;
    case 1230:for(let k=0;k<3&&t&&t.hp>0;k++)await hit(t,30);break;
    case 1231:await hit(t,stat(h,'attack'));if(game.players[side].attacks>1&&t.hp>0)fixed(t,30,'ソニックストライク追加');break;
    case 1232:for(let k=0;k<3&&t&&t.hp>0;k++)await hit(t,40+k*15);break;
    case 1233:await hit(t,stat(h,'attack'));if(t.hp>0)fixed(t,game.players[side].attacks*10,'ソニックブレット追撃');break;
    case 1234:{const prior=game.players[side].attacks>0;for(const x of foes.slice()){await hit(x,40,0,{redirect:false});if(prior&&x.hp>0)fixed(x,20,'クラスターボム追加');}break;}
    case 1235:{const count=game.players[side].attacks>=3?3:2;for(let k=0;k<count&&t&&t.hp>0;k++)await hit(t,40);break;}
    default:return await executeImportedSkill(h,i,t);
  }
  return false;
}
