/*
 * No.1000–1035 — 『編成(調整).docx』調整版 (No.88–123) に基づく効果。
 * 変更指定: 磁気1枚=10、フランカ+5、ミヤの超過=15、連撃6人は特性で通常35%×3。
 * 複数対象を選ぶ効果の一部はサイト内で自動選択する。
 */
'use strict';
const RESTORED_IDS = new Set(Array.from({ length: 36 }, (_, i) => 1000 + i));
function teamAlive(side) { return game.players[side].team.filter(h => h.hp > 0) }
function hasAlive(side, id) { return teamAlive(side).some(h => baseCardId(h) === id) }
function hasField(side, id) { return field(side).some(h => baseCardId(h) === id) }
function sourceDebilitated(h) { return !!(h.burn || h.poison || h.sleep || h.confusion || h.charm || h.combustion || h.marks || statDebuff(h)) }
function sourceTrue(actor, target, n, label = '確定ダメージ', boost = true) {
    if (!target || target.hp <= 0) return 0;
    if (actor && ownerOf(actor) !== ownerOf(target) && ((game.currentSkillSpecial || []).includes('やみ') && traitNameOf(target) === 'もんばん' || (game.currentSkillSpecial || []).includes('水') && traitNameOf(target) === '地に足うまってる')) { log(`とくせい：${target.name}が属性カードの効果を無効化`); return 0 }
    const attackerSide = actor ? ownerOf(actor) : 1 - ownerOf(target);
    const b = boost && hasField(attackerSide, 1010) ? 5 : 0;
    return directDamage(actor, target, n + b, label, true);
}
function sourceStartMatch() {
    for (let side = 0; side < 2; side++) {
        for (const h of teamAlive(side)) if ([1008, 1014, 1020].includes(baseCardId(h))) {
            draw(side, 1); log(`${h.name}：ゲーム開始時の1枚ドロー`);
        }
    }
}
function sourceOnEnter(h, firstEntry = true) {
    if (!firstEntry) return;
    const side = ownerOf(h);
    if ([1002, 1006, 1012, 1018, 1024, 1030].includes(baseCardId(h))) {
        const drawn = searchDeck(side, c => /^[123]MP$/.test(c));
        if (baseCardId(h) === 1012) log(drawn ? 'アイリス「ハイドロバーン」：初回登場時、MPカードを1枚獲得' : 'アイリス「ハイドロバーン」：山札にMPカードがなく、ドローできなかった');
    }
    if ([1006, 1024, 1030].includes(baseCardId(h))) {
        h.sourceReduceUntil = game.turn;
        log(`${h.name}：このターン、味方全員が受ける攻撃ダメージ−10`);
    }
}
function sourceTurnStart() {
    for (let side = 0; side < 2; side++) {
        if (hasField(side, 1019)) {
            let pool = field(1 - side); if (pool.length) buff(pool[rand(pool.length)], 'attack', -10, 0);
        }
        if (hasField(side, 1025)) {
            const pool = field(1 - side).filter(x => !x.combustion);
            if (pool.length) sourceGiveCombustion(pool[rand(pool.length)]);
        }
        const p = game.players[side];
        if (p.adjustedOlgaBoost) {
            p.adjustedOlgaBoost = false;
            for (const h of teamAlive(side)) buff(h, 'attack', 10, 0);
            log('オルガ「重爆撃陣形」：このターン、味方全員のこうげき＋10');
        }
    }
}
function sourceStatBonus(h, s) {
    if (!game) return 0;
    const side = ownerOf(h), enemy = 1 - side; let b = 0;
    if (s === 'defense') {
        if (h.marks && hasField(enemy, 1005)) b -= 10;
        if (baseCardId(h) === 1029 && field(enemy).some(e => e.combustion)) b += 10;
    }
    if (s === 'attack') {
        if (baseCardId(h) === 1011) b += field(side).filter(x => x.hp < x.maxHp).length * 10;
        if (baseCardId(h) === 1017 && field(side).reduce((v, x) => v + stat(x, 'defense'), 0) >= 150) b += 10;
        if (hasField(enemy, 1022) && sourceDebilitated(h)) b -= 10;
        if (baseCardId(h) === 1023) b += field(enemy).filter(sourceDebilitated).length * 10;
        if (hasField(side, 1025) && field(enemy).some(x => x.combustion)) b += 10;
    }
    return b;
}
function sourceAttackBonus(actor, target, side) {
    let n = 0;
    if (hasField(side, 1019) && sourceDebilitated(target)) n += 5;
    if (baseCardId(actor) === 1020 && sourceDebilitated(target)) n += 10;
    return n;
}
function sourceExtraTrue(actor, target, side, baseTrue = 0) {
    let n = 0;
    if (hasField(side, 1031) && game.players[side].attacks >= 1) n += 10;
    if (baseTrue > 0 && hasField(side, 1010)) n += 5;
    if (baseCardId(actor) === 1027 && target.combustion) n += 10;
    return n;
}
function sourceDamageReduce(actor, target, amount) {
    const side = ownerOf(target);
    if (teamAlive(side).some(h => [1006, 1024, 1030].includes(baseCardId(h)) && (h.sourceReduceUntil || 0) >= game.turn)) amount = Math.max(0, amount - 10);
    // メルの被ダメージ半減（攻撃されるごとに30%）
    if (baseCardId(target) === 1008 && roll(.3)) {
        amount = Math.ceil(amount / 2); log('メル「レッサーパンチ」：ダメージ半減');
    }
    return amount;
}
function sourceOnMagnet(target, event, initiator = null, neighbors = null) {
    const side = 1 - ownerOf(target);
    if (event !== 'burst') return;
    if (hasAlive(side, 1004)) {
        const wounded = teamAlive(side).sort((a, b) => (b.maxHp - b.hp) - (a.maxHp - a.hp))[0];
        if (wounded) heal(wounded, 10);
    }
    if (hasField(side, 1003)) for (const n of (neighbors || enemyAdjacent(target))) sourceTrue(null, n, 5, 'エレナ「連鎖電界」', false);
    if (baseCardId(initiator) === 1001 && roll(.3) && target.hp > 0) magnet(target, 1, false);
}
function sourceOnDebuff(target) {
    const side = 1 - ownerOf(target), v = field(side).find(x => baseCardId(x) === 1021);
    if (v) { const pool = field(ownerOf(target)); if (pool.length) sourceTrue(v, pool[rand(pool.length)], 5, 'ヴェイン「アビサルヴェノム」'); }
}
function sourceGiveCombustion(target) {
    if (!target || target.hp <= 0 || target.combustion) return false;
    if (((game.currentSkillSpecial || []).includes('やみ') && traitNameOf(target) === 'もんばん') || ((game.currentSkillSpecial || []).includes('水') && traitNameOf(target) === '地に足うまってる')) return false;
    target.combustion = 1; log(`${target.name}：燃焼を付与（次の行動直前に確定10）`); sourceOnDebuff(target); return true;
}
function sourceOnCombustion(target) {
    const side = 1 - ownerOf(target);
    if (hasAlive(side, 1026)) sourceTrue(null, target, 5, 'ルチル「ポップンファイア」', false);
    if (hasAlive(side, 1028)) {
        const h = teamAlive(side).sort((a, b) => (b.maxHp - b.hp) - (a.maxHp - a.hp))[0]; if (h) heal(h, 10);
    }
}
function sourceOnHit(actor, target, amount, options) {
    const side = ownerOf(target), source = ownerOf(actor);
    if (source === side) return;
    if (hasField(side, 1007)) sourceTrue(field(side).find(x => baseCardId(x) === 1007), actor, 10, '立華つむぎ「金遁の術」');
    if (baseCardId(target) === 1009) sourceTrue(target, actor, 5, 'ヴァネッサ「挑発の重盾」');
}
function sourceAdjacentHit(actor, target, n, label, neighbors = null, skillBased = true) {
    const side = ownerOf(actor), spread = n + (skillBased && hasField(side, 1016) ? 5 : 0);
    for (const adjacent of (neighbors || enemyAdjacent(target))) {
        sourceTrue(actor, adjacent, spread, label);
        if (hasField(side, 1015)) for (const e of enemyAdjacent(adjacent)) sourceTrue(actor, e, 5, 'リオ「スプラッシュ共鳴」', false);
    }
}
function sourceAfterNormal(actor, target) {
    const side = ownerOf(actor);
    if (hasField(side, 1000) && roll(.5)) {
        const enemies = field(1 - side); if (enemies.length) magnet(enemies[rand(enemies.length)], 1, false);
    }
    if (baseCardId(actor) === 1014 && target.hp > 0 && roll(.3)) sourceAdjacentHit(actor, target, 5, 'ピスカ「ルアーボム」', null, false);
    if (baseCardId(actor) === 1035 && roll(.3)) buff(actor, 'speed', 10, 1);
}
function sourceAfterAttack(actor, target, amount, options) {
    const side = ownerOf(actor);
    if (hasField(side, 1018) && target.hp > 0) { buff(target, 'attack', -10, 0); }
    if (hasField(side, 1033) && game.players[side].attacks >= 2) {
        const mm = field(side).find(x => baseCardId(x) === 1033);
        if (mm && claim(mm, 'chainRadar')) {
            const a = field(1 - side); if (a.length) sourceTrue(mm, a[rand(a.length)], 5, 'メイメイ「チェインレーダー」');
        }
    }
}
function sourceOnEndAction(h) { }
function sourceOnSkillCast(h, t) {
    const side = ownerOf(h);
    const iris = field(side).find(a => baseCardId(a) === 1012 && a.hp > 0);
    if (!iris) return;
    // ハイドロバーンは同一ターン中に何度技を使っても+10のまま（重複加算しない）。
    for (const a of field(side)) {
        if (a.hydroBurnTurn === game.turn) continue;
        buff(a, 'defense', 10, 0);
        a.hydroBurnTurn = game.turn;
    }
    log(`とくせい：アイリス「ハイドロバーン」：味方全体のぼうぎょ＋10（ターン${game.turn}）`);
}
function sourceEndRound() {
    for (let s = 0; s < 2; s++)if (hasField(s, 1034) && game.players[s].attacks >= 3) game.players[s].adjustedOlgaBoost = true;
}
function sourceManualSkill(h, i, target) {
    const sk = HERO_MAP[baseCardId(h)].skills[i];
    game.manualPending = { actorUid: h.uid, skillName: sk.name, description: sk.desc, targetUid: target?.uid || h.uid, consumeAction: true };
    log(`${h.name}「${sk.name}」：手動裁定をお願いします`);
    return true;
}
async function restoredSkillEffect(h, i, t) {
    if (i !== 0) return sourceManualSkill(h, i, t);
    const side = ownerOf(h), id = baseCardId(h), skill = HERO_MAP[id].skills[0], en = field(1 - side), team = teamAlive(side);
    const hit = async (p, b = 0, who = t, opts = {}) => who && who.hp > 0 ? damage(h, who, opts.trueOnly ? 0 : p, opts.trueOnly ? p + b : b, { name: skill.name, ...opts }) : 0;
    const trueHit = async (p, who = t) => hit(p, 0, who, { trueOnly: true });
    switch (id) {
        case 1000: for (let i = 0; i < 2 && t.hp > 0; i++)await trueHit(25); break;
        case 1001: await hit(50); burst(t, 0, h); break;
        case 1002: await hit(40); if (t.hp > 0) magnet(t, 1, true); break;
        case 1003: await hit(50); burst(t, 0, h); break;
        case 1004: { heal(t, 30); const foes = field(1 - side); if (foes.length) magnet(foes[rand(foes.length)], 1, true); break; }
        case 1005: await hit(70, t.marks ? 20 : 0); break;
        case 1006: await hit(60); break;
        case 1007: await hit(50, t.hp < t.maxHp / 2 ? 15 : 0); break;
        case 1008: { const x = en.slice().sort((a, b) => a.hp - b.hp)[0]; if (x) await hit(60, 10, x); break; }
        case 1009: await hit(60, wasAttacked(h) ? 15 : 0); break;
        case 1010: { const prev = t.flags.lastHitTurn === game.turn - 1; heal(t, prev ? 30 : 20); break; }
        case 1011: await hit(60, game.players[side].team.filter(x => x.hp <= 0).length * 10); break;
        case 1012: await hit(60); break;
        case 1013: await hit(70, stat(h, 'defense') >= 60 ? 15 : 0); break;
        case 1014: { const neighbors = enemyAdjacent(t).slice(); await hit(60); sourceAdjacentHit(h, t, 10, skill.name + '・拡散', neighbors); break; }
        case 1015: { const neighbors = enemyAdjacent(t).slice(); await hit(60); sourceAdjacentHit(h, t, 10, skill.name + '・拡散', neighbors); break; }
        case 1016: for (const x of [t, ...enemyAdjacent(t)]) buff(x, 'speed', -10, 0); break;
        case 1017: { let triple = en.length === 3; for (const x of en.slice()) { await hit(40, 0, x); if (triple && x.hp > 0) sourceTrue(h, x, 10, 'ギルバート・追加', true); } break; }
        case 1018: await hit(60); break;
        case 1019: await hit(50); if (t.hp > 0) t.banSkills = 1; break;
        case 1020: await hit(60, sourceDebilitated(t) ? 15 : 0); break;
        case 1021: { await hit(50); if (t.hp > 0 && roll(.3)) ailment(t, 'confusion'); if (t.hp > 0 && roll(.3)) ailment(t, 'poison'); break; }
        case 1022: ailment(t, 'sleep'); break;
        case 1023: { const ailments = [t.burn > 0, t.poison > 0, t.sleep > 0, t.confusion > 0, t.charm > 0, t.combustion > 0, t.marks > 0, statDebuff(t)].filter(Boolean).length; await hit(80, 0, t, { trueOnly: ailments >= 2 }); break; }
        case 1024: await hit(60); if (t.hp > 0 && !t.combustion) sourceGiveCombustion(t); break;
        case 1025: { await hit(50); if (t.hp > 0 && t.combustion) { t.combustion = 0; sourceTrue(h, t, 15, 'リヴィア「燃焼爆発」'); const pool = en.filter(x => x.uid !== t.uid && !x.combustion); if (pool.length) sourceGiveCombustion(pool[rand(pool.length)]); } break; }
        case 1026: for (const x of en.slice()) { await hit(30, 0, x); if (x.hp > 0 && !x.combustion && roll(.3)) sourceGiveCombustion(x); } break;
        case 1027: await hit(60); if (t.combustion) { t.combustion = 0; for (const x of en.slice()) sourceTrue(h, x, 15, 'イグナ「連鎖爆炎」'); } break;
        case 1028: heal(t, 20); { const pool = en.filter(x => !x.combustion); if (pool.length) sourceGiveCombustion(pool[rand(pool.length)]); } break;
        case 1029: await hit(80, 0, t, { trueOnly: !!t.combustion }); break;
        case 1030: await hit(60); break;
        case 1031: await hit(50, game.players[side].attacks > 0 ? 15 : 0); break;
        case 1032: for (let i = 0; i < 3 && t.hp > 0; i++)await hit(15 + i * 5); break;
        case 1033: await hit(50, 0); if (t.hp > 0) sourceTrue(h, t, game.players[side].attacks * 5, 'メイメイ「ソニックブレット」'); break;
        case 1034: { const prior = game.players[side].attacks > 0; for (const x of en.slice()) { await hit(40, 0, x); if (prior && x.hp > 0) sourceTrue(h, x, 10, 'オルガ・追加爆撃'); } break; }
        case 1035: { const n = game.players[side].attacks >= 3 ? 3 : 2; for (let i = 0; i < n && t.hp > 0; i++)await hit(30); break; }
        default: return sourceManualSkill(h, i, t);
    }
    return false;
}


// ===== Challenge 1: enemy-only cards No.1100-1135 =====
function enemy1100(h) { const id=baseCardId(h); return id>=1100 && id<=1135; }
function enemy1100Has(side,id) { return field(side).some(x=>baseCardId(x)===id); }
function enemy1100Alive(side,id) { return game.players[side].team.some(x=>x.hp>0&&baseCardId(x)===id); }
function enemy1100Enemies(side) { return field(1-side); }
function enemy1100True(actor,target,n,label) {
    if(!target||target.hp<=0)return 0;
    const side=actor?ownerOf(actor):1-ownerOf(target);
    const spreadBonus=/(拡散|アクアスピア|インパクトスプレッド|レイジアンカー)/.test(label||'')&&enemy1100Has(side,1116)?10:0;
    const bonus=(enemy1100Has(side,1110)?10:0)+spreadBonus;
    return directDamage(actor,target,n+bonus,label||'確定ダメージ',false);
}
function enemy1100HasAilment(h) { return !!(h.burn||h.poison||h.sleep||h.confusion||h.charm); }
function enemy1100Debilitated(h) { return enemy1100HasAilment(h)||statDebuff(h); }
function enemy1100GiveBurn(target) {
    if(!target||target.hp<=0||target.combustion)return false;
    target.combustion=1; target.combustionDamage=15;
    log(target.name+'に燃焼を付与（行動直前に確定15ダメージ）');
    if(typeof sourceOnDebuff==='function')sourceOnDebuff(target);
    return true;
}
function enemy1100StartMatch() {
    for(let side=0;side<2;side++){
        const team=game.players[side].team;
        if(team.some(h=>[1100,1108,1114,1120,1126,1132].includes(baseCardId(h))))
            for(const h of team) h.nextBarrier=(h.nextBarrier||0)+1;
        if(team.some(h=>baseCardId(h)===1130)) for(const h of team) h.combo35=true;
        if(team.some(h=>baseCardId(h)===1124)) searchDeck(side,c=>/^[123]MP$/.test(c));
    }
}
function enemy1100OnEnter(h,firstEntry) {
    if(!firstEntry)return;
    const id=baseCardId(h),side=ownerOf(h);
    if([1102,1106,1112,1118,1124,1130].includes(id)){
        for(const ally of field(side)) ally.halfDamageUntil=Math.max(ally.halfDamageUntil||0,game.turn+1);
        log(h.name+'：味方全体の被ダメージを2ターン半減');
    }
    if(id===1106) for(const ally of field(side)) ally.skillDamageReduceUntil=game.turn;
}
function enemy1100TurnStart() {
    for(let side=0;side<2;side++){
        const foes=field(1-side);
        if(enemy1100Has(side,1119)&&foes.length){
            const chosen=shuffled(foes).slice(0,2);
            for(const x of chosen){buff(x,'attack',-10,0);buff(x,'defense',-10,0);}
        }
        if(enemy1100Has(side,1125)){
            const pool=foes.filter(x=>!x.combustion);
            if(pool.length)enemy1100GiveBurn(pool[rand(pool.length)]);
        }
        if(enemy1100Has(side,1113)) for(const x of field(side))buff(x,'defense',10,0);
        if(enemy1100Has(side,1130)&&roll(.5))searchDeck(side,c=>/^[123]MP$/.test(c));
        const player=game.players[side];
        if(player.enemy1100OlgaMP){
            player.enemy1100OlgaMP=false; player.mpMod-=1;
            log('オルガ「重爆撃陣形」：このターン、味方の技コスト−1MP');
        }
    }
}
function enemy1100StatBonus(h,s) {
    if(!game||!h||h.hp<=0)return 0;
    const side=ownerOf(h),foes=field(1-side),allies=field(side),id=baseCardId(h);
    let n=0;
    if(s==='attack'){
        if(enemy1100Has(side,1101))n+=20;
        if(enemy1100Has(side,1107))n+=10;
        if(enemy1100Has(side,1131))n+=10;
        if(id===1111)n+=allies.filter(x=>x.hp<x.maxHp).length*10+(game.players[side].team.some(x=>x.hp<=0)?20:0);
        if(id===1117&&allies.reduce((v,x)=>v+stat(x,'defense'),0)>=150)n+=20;
        if(id===1123)n+=foes.filter(enemy1100Debilitated).length*10;
        if(id===1125&&foes.some(x=>x.combustion))n+=20;
        if(id===1129&&foes.some(x=>x.combustion))n+=10;
        if(enemy1100Has(1-side,1105)&&h.marks>0)n-=10;
        if(enemy1100Has(1-side,1122)&&enemy1100HasAilment(h))n-=10;
    }
    if(s==='defense'){
        if(id===1129&&foes.some(x=>x.combustion))n+=10;
        if(enemy1100Has(1-side,1105)&&h.marks>0)n-=20;
    }
    return n;
}
function enemy1100RawAttackBonus(actor) { return Number(actor?.attackDamageBonus||0); }
function enemy1100DamageReduce(actor,target,amount) {
    if(!target)return amount;
    const side=ownerOf(target);
    if((target.halfDamageUntil||0)>=game.turn) amount=Math.ceil(amount/2);
    if((target.skillDamageReduceUntil||-1)>=game.turn) amount=Math.max(0,amount-10);
    return amount;
}
function enemy1100OnSkillCast(actor,target) {
    const side=ownerOf(actor);
    if(enemy1100Has(side,1106)) for(const ally of field(side)) ally.skillDamageReduceUntil=game.turn;
    if(enemy1100Has(side,1112)){
        for(const ally of field(side))buff(ally,'defense',10,0);
        if(target&&target.hp>0)buff(target,'attack',-10,0);
    }
}
function enemy1100OnHit(actor,target) {
    if(!actor||!target||ownerOf(actor)===ownerOf(target))return;
    const side=ownerOf(target);
    if(enemy1100Has(side,1107))enemy1100True(null,actor,20,'立華つむぎ「金遁の術」');
    if(baseCardId(target)===1109)enemy1100True(target,actor,10,'ヴァネッサ「挑発の重盾」');
}
async function enemy1100AfterNormal(actor,target) {
    const side=ownerOf(actor),id=baseCardId(actor),foes=field(1-side);
    if(enemy1100Has(side,1100)&&foes.length&&claim(actor,'enemy1100MagnetSpread')){
        const count=2+rand(2);
        for(const x of shuffled(foes).slice(0,Math.min(count,foes.length)))magnet(x,1,false);
    }
    if(id===1135&&claim(actor,'enemy1135Boost')){
        if(roll(.5)){buff(actor,'speed',10,1);if(foes.length)enemy1100True(actor,foes[rand(foes.length)],10,'エマ「オーバーブースト」');}
    }
    if(id===1132&&claim(actor,'enemy1132Extra')&&roll(.5)&&target&&target.hp>0&&!actor.enemyExtraNormal){
        actor.enemyExtraNormal=true;
        log('ビスコット「ストリングエアショー」：追加通常攻撃');
        const count=actor.combo35?3:1;
        for(let i=0;i<count&&target.hp>0;i++){
            const power=actor.combo35?Math.round(stat(actor,'attack')*.35/10)*10:stat(actor,'attack');
            await damage(actor,target,power,0,{normal:true,name:'追加通常攻撃'});
        }
        actor.enemyExtraNormal=false;
    }
}
async function awaitEnemyNormalHit(actor,target) {
    const power=Math.round(stat(actor,'attack')*.35/10)*10;
    await damage(actor,target,power,0,{normal:true,name:'追加通常攻撃'});
}
function enemy1100AfterAttack(actor,target,amount,options) {
    const side=ownerOf(actor),id=baseCardId(actor);
    if(enemy1100Has(side,1118)&&target&&target.hp>0&&claim(actor,'enemy1118Debuff')){buff(target,'attack',-10,0);buff(target,'defense',-10,0);}
    if(id===1127&&target&&target.combustion)enemy1100True(actor,target,15,'イグナ「連鎖爆炎」');
    if(enemy1100Has(side,1131)&&game.players[side].attacks>=2&&target&&target.hp>0)enemy1100True(actor,target,20,'ギャビー「グリルファング」');
    if(enemy1100Has(side,1133)&&game.players[side].attacks>=2&&claim(field(side).find(x=>baseCardId(x)===1133)||actor,'enemy1133Chain')){
        const pool=field(1-side);if(pool.length)enemy1100True(actor,pool[rand(pool.length)],15,'メイメイ「チェインレーダー」');
    }
}
function enemy1100OnDebuff(target) {
    if(!target||target.hp<=0)return;
    const side=1-ownerOf(target),source=field(side).find(x=>baseCardId(x)===1121);
    if(source){const pool=field(ownerOf(target));if(pool.length)enemy1100True(source,pool[rand(pool.length)],10,'ヴェイン「アビサルヴェノム」');}
}
function enemy1100MagnetApplied(target) {
    const side=1-ownerOf(target);
    if(enemy1100Alive(side,1104))for(const ally of game.players[side].team.filter(x=>x.hp>0))heal(ally,10);
}
function enemy1100MagnetOverflow(target) {
    const side=1-ownerOf(target);
    if(enemy1100Alive(side,1104))for(const ally of game.players[side].team.filter(x=>x.hp>0))heal(ally,10);
    if(enemy1100Has(side,1103)){
        for(const x of enemyAdjacent(target)){magnet(x,1,false);enemy1100True(null,x,10,'エレナ「連鎖電界」');}
    }
}
function enemy1100MagnetBurst(target,amount,initiator,neighbors) {
    const side=1-ownerOf(target);
    if(enemy1100Alive(side,1104))for(const ally of game.players[side].team.filter(x=>x.hp>0))heal(ally,10);
    if(enemy1100Has(side,1103)){
        for(const x of (neighbors||enemyAdjacent(target)).slice()){magnet(x,1,false);enemy1100True(null,x,10,'エレナ「連鎖電界」');}
    }
    if(baseCardId(initiator)===1101&&roll(.5)&&target.hp>0)magnet(target,1+rand(2),false);
}
function enemy1100MagnetCount(target,count) {
    const side=1-ownerOf(target);
    if(enemy1100Has(side,1102)&&roll(.6)){log('ルネ「蒼雷華」：磁気波動を1枚追加');return count+1;}
    return count;
}
function enemy1100OnDirectDamage(target,amount,reason) {
    if(!target||amount<=0||/レイジアンカー/.test(reason||''))return;
    const side=1-ownerOf(target),source=field(side).find(x=>baseCardId(x)===1115);
    if(!source)return;
    const lineup=game.planned?.[ownerOf(target)]||game.players[ownerOf(target)].field;
    const index=lineup.indexOf(target.uid);
    const adjacent=[lineup[index-1],lineup[index+1]].filter(Boolean).map(uid=>game.players[ownerOf(target)].team.find(x=>x.uid===uid&&x.hp>0)).filter(Boolean);
    for(const unit of adjacent)enemy1100True(source,unit,10,'リオ「レイジアンカー」');
}
function enemy1100Combustion(target) {
    const side=1-ownerOf(target);
    if(enemy1100Alive(side,1126))enemy1100True(null,target,10,'ルチル「開戦の紅蓮壁」');
    if(enemy1100Alive(side,1128)){
        const allies=game.players[side].team.filter(x=>x.hp>0).sort((a,b)=>(b.maxHp-b.hp)-(a.maxHp-a.hp));
        if(allies[0])heal(allies[0],10);
    }
}
function enemy1100EndRound() {
    for(let side=0;side<2;side++)if(enemy1100Has(side,1134)&&game.players[side].attacks>=3)game.players[side].enemy1100OlgaMP=true;
}
async function enemy1100SkillEffect(h,i,t) {
    const id=baseCardId(h),side=ownerOf(h),foes=field(1-side),allies=field(side);
    const hit=async(target,power,bonus=0,opts={})=>{if(target&&target.hp>0)await damage(h,target,power,bonus,{name:HERO_MAP[h.id].skills[i].name,...opts});};
    const fixed=(target,n,label)=>enemy1100True(h,target,n,label||HERO_MAP[h.id].skills[i].name);
    const adj=target=>enemyAdjacent(target).slice();
    const weakenedTarget=target=>enemy1100Debilitated(target)||statDebuff(target);
    switch(id){
    case 1100:{
        await hit(t,80);
        const pool=field(1-side);for(let k=0;k<2&&pool.length;k++){const x=pool[rand(pool.length)];magnet(x,1,false);}
        break;
    }
    case 1101:{
        const pool=foes.filter(x=>x.marks>0);if(pool.length)t=pool.sort((a,b)=>b.marks-a.marks)[0];
        for(let k=0;k<2&&t&&t.hp>0;k++)await hit(t,25);
        if(t&&t.hp>0)burst(t);
        break;
    }
    case 1102: await hit(t,90);if(t.hp>0)magnet(t);break;
    case 1103: await hit(t,60);for(const x of field(1-side).slice())if(x.marks>0)burst(x);break;
    case 1104:{
        for(const x of allies)heal(x,30);
        const cureTarget=allies.filter(x=>x.sleep||x.burn||x.poison||x.confusion||x.charm).sort((a,b)=>(b.maxHp-b.hp)-(a.maxHp-a.hp))[0]||allies[0];if(cureTarget)cure(cureTarget);
        const pool=field(1-side);if(pool.length)magnet(pool[rand(pool.length)]);
        break;
    }
    case 1105: if(t.marks>0)await hit(t,100,0,{trueOnly:true});else await hit(t,100);break;
    case 1106: await hit(t,90);break;
    case 1107:{const wasBelow=t.hp<t.maxHp*.5;await hit(t,stat(h,'attack'));if(wasBelow&&t.hp>0)fixed(t,30,'リベンジスラッシュ追加');break;}
    case 1108:{const x=foes.slice().sort((a,b)=>a.hp-b.hp)[0];if(x){await hit(x,80);if(x.hp>0)fixed(x,20,'スナイプリベンジ追加');}break;}
    case 1109: await hit(t,stat(h,'defense'));if(wasAttacked(h))fixed(t,30,'カウンターブラスト追加');break;
    case 1110:{const prev=(t.flags.lastHitTurn||0)===game.turn-1;heal(t,prev?50:30);break;}
    case 1111:{const fallen=game.players[side].team.filter(x=>x.hp<=0).length;await hit(t,stat(h,'attack'));if(fallen)fixed(t,fallen*20,'ファイナルリベンジ追加');break;}
    case 1112: await hit(t,90);break;
    case 1113: await hit(t,90);if(stat(h,'defense')>=60&&t.hp>0)fixed(t,30,'完全解析追加');break;
    case 1114:{const near=adj(t);await hit(t,70);for(const x of near)fixed(x,20,'アクアスピア拡散');break;}
    case 1115:{const near=adj(t);await hit(t,70);for(const x of near)fixed(x,20,'インパクトスプレッド');break;}
    case 1116:{for(const x of [t,...adj(t)])buff(x,'speed',-20,1);const ally=allies.find(x=>x.uid!==h.uid)||h;buff(ally,'defense',10,1);break;}
    case 1117:{const triple=foes.length>=3;for(const x of foes.slice()){await hit(x,50);if(triple&&x.hp>0)fixed(x,20,'ギガディフュージョン追加');}break;}
    case 1118: await hit(t,90);break;
    case 1119: await hit(t,stat(h,'attack'));if(t.hp>0)t.banSkills=1;break;
    case 1120: await hit(t,80);if(t.hp>0&&weakenedTarget(t))fixed(t,40,'チェインキャノン追加');break;
    case 1121: await hit(t,stat(h,'attack'));if(t.hp>0)ailment(t,roll(.5)?'confusion':'poison');break;
    case 1122: if(roll(.5))ailment(t,'sleep');else ailment(t,'charm');buff(t,'defense',-10,1);break;
    case 1123: await hit(t,100,0,{trueOnly:weakenedTarget(t)});break;
    case 1124: await hit(t,90);if(t.hp>0){if(!t.combustion)enemy1100GiveBurn(t);else fixed(t,10,'バタフライエフェクト追加');}break;
    case 1125: await hit(t,80);if(t.hp>0&&t.combustion){t.combustion=0;fixed(t,20,'フレイムスプレッド燃焼爆発');const pool=field(1-side).filter(x=>x.uid!==t.uid&&!x.combustion);if(pool.length)enemy1100GiveBurn(pool[rand(pool.length)]);}break;
    case 1126: for(const x of foes.slice()){await hit(x,40);if(x.hp>0){if(x.combustion)buff(x,'defense',-20,1);else if(roll(.5))enemy1100GiveBurn(x);}}break;
    case 1127: await hit(t,80);if(t.hp>0&&t.combustion){t.combustion=0;for(const x of field(1-side).slice())fixed(x,25,'ブラストチェイサー連鎖爆炎');}break;
    case 1128: heal(t,20);{const pool=field(1-side).filter(x=>!x.combustion);if(pool.length)enemy1100GiveBurn(pool[rand(pool.length)]);}break;
    case 1129: await hit(t,100,0,{trueOnly:!!t.combustion});break;
    case 1130: for(let k=0;k<3&&t&&t.hp>0;k++)await hit(t,30);break;
    case 1131: await hit(t,stat(h,'attack'));if(game.players[side].attacks>1&&t.hp>0)fixed(t,30,'ソニックストライク追加');break;
    case 1132: for(let k=0;k<3&&t&&t.hp>0;k++)await hit(t,30+k*15);break;
    case 1133: await hit(t,stat(h,'attack'));if(t.hp>0)fixed(t,game.players[side].attacks*10,'ソニックブレット追撃');break;
    case 1134:{const prior=game.players[side].attacks>0;for(const x of foes.slice()){await hit(x,40);if(prior&&x.hp>0)fixed(x,20,'クラスターボム追加');}break;}
    case 1135:{const count=game.players[side].attacks>=3?3:2;for(let k=0;k<count&&t&&t.hp>0;k++)await hit(t,40);break;}
    default:return true;
    }
    return false;
}
