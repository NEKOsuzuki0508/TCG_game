/*
 * No.1000–1035 — 『編成(調整).docx』調整版 (No.88–123) に基づく効果。
 * 変更指定: 磁気1枚=10、フランカ+5、ミヤの超過=15、連撃6人は特性で通常35%×3。
 * 複数対象を選ぶ効果の一部はサイト内で自動選択する。
 */
'use strict';
const RESTORED_IDS = new Set(Array.from({ length: 36 }, (_, i) => 1000 + i));
function teamAlive(side) { return game.players[side].team.filter(h => h.hp > 0) }
function hasAlive(side, id) { return teamAlive(side).some(h => h.id === id) }
function hasField(side, id) { return field(side).some(h => h.id === id) }
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
        for (const h of teamAlive(side)) if ([1008, 1014, 1020].includes(h.id)) {
            draw(side, 1); log(`${h.name}：ゲーム開始時の1枚ドロー`);
        }
    }
}
function sourceOnEnter(h, firstEntry = true) {
    if (!firstEntry) return;
    const side = ownerOf(h);
    if ([1002, 1006, 1012, 1018, 1024, 1030].includes(h.id)) searchDeck(side, c => /^[123]MP$/.test(c));
    if ([1006, 1024, 1030].includes(h.id)) {
        h.sourceReduceUntil = game.turn;
        log(`${h.name}：このターン、味方全員が受ける攻撃ダメージ−10`);
    }
}
function sourceTurnStart() {
    for (let side = 0; side < 2; side++) {
        if (hasField(side, 1013)) {
            const a = field(side).slice().sort((x, y) => stat(x, 'defense') - stat(y, 'defense'))[0];
            if (a) buff(a, 'defense', 10, 0);
        }
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
        if (h.id === 1029 && field(enemy).some(e => e.combustion)) b += 10;
    }
    if (s === 'attack') {
        if (h.id === 1011) b += field(side).filter(x => x.hp < x.maxHp).length * 10;
        if (h.id === 1017 && field(side).reduce((v, x) => v + stat(x, 'defense'), 0) >= 150) b += 10;
        if (hasField(enemy, 1022) && sourceDebilitated(h)) b -= 10;
        if (h.id === 1023) b += field(enemy).filter(sourceDebilitated).length * 10;
        if (hasField(side, 1025) && field(enemy).some(x => x.combustion)) b += 10;
    }
    return b;
}
function sourceAttackBonus(actor, target, side) {
    let n = 0;
    if (hasField(side, 1019) && sourceDebilitated(target)) n += 5;
    if (actor.id === 1020 && sourceDebilitated(target)) n += 10;
    return n;
}
function sourceExtraTrue(actor, target, side, baseTrue = 0) {
    let n = 0;
    if (hasField(side, 1031) && game.players[side].attacks >= 1) n += 10;
    if (baseTrue > 0 && hasField(side, 1010)) n += 5;
    if (actor.id === 1027 && target.combustion) n += 10;
    return n;
}
function sourceDamageReduce(actor, target, amount) {
    const side = ownerOf(target);
    if (teamAlive(side).some(h => [1006, 1024, 1030].includes(h.id) && (h.sourceReduceUntil || 0) >= game.turn)) amount = Math.max(0, amount - 10);
    // メルの被ダメージ半減（攻撃されるごとに30%）
    if (target.id === 1008 && roll(.3)) {
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
    if (initiator?.id === 1001 && roll(.3) && target.hp > 0) magnet(target, 1, false);
}
function sourceOnDebuff(target) {
    const side = 1 - ownerOf(target), v = field(side).find(x => x.id === 1021);
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
    if (hasField(side, 1007)) sourceTrue(field(side).find(x => x.id === 1007), actor, 10, '立華つむぎ「金遁の術」');
    if (target.id === 1009) sourceTrue(target, actor, 5, 'ヴァネッサ「挑発の重盾」');
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
    if (actor.id === 1014 && target.hp > 0 && roll(.3)) sourceAdjacentHit(actor, target, 5, 'ピスカ「ルアーボム」', null, false);
    if (actor.id === 1035 && roll(.3)) buff(actor, 'speed', 10, 1);
}
function sourceAfterAttack(actor, target, amount, options) {
    const side = ownerOf(actor);
    if (hasField(side, 1018) && target.hp > 0) { buff(target, 'attack', -10, 0); }
    if (hasField(side, 1033) && game.players[side].attacks >= 2) {
        const mm = field(side).find(x => x.id === 1033);
        if (mm && claim(mm, 'chainRadar')) {
            const a = field(1 - side); if (a.length) sourceTrue(mm, a[rand(a.length)], 5, 'メイメイ「チェインレーダー」');
        }
    }
}
function sourceOnEndAction(h) { }
function sourceOnSkillCast(h, t) {
    const side = ownerOf(h);
    if (hasField(side, 1012)) for (const a of field(side)) buff(a, 'defense', 10, 0);
}
function sourceEndRound() {
    for (let s = 0; s < 2; s++)if (hasField(s, 1034) && game.players[s].attacks >= 3) game.players[s].adjustedOlgaBoost = true;
}
function sourceManualSkill(h, i, target) {
    const sk = HERO_MAP[h.id].skills[i];
    game.manualPending = { actorUid: h.uid, skillName: sk.name, description: sk.desc, targetUid: target?.uid || h.uid, consumeAction: true };
    log(`${h.name}「${sk.name}」：手動裁定をお願いします`);
    return true;
}
async function restoredSkillEffect(h, i, t) {
    if (i !== 0) return sourceManualSkill(h, i, t);
    const side = ownerOf(h), id = h.id, skill = HERO_MAP[id].skills[0], en = field(1 - side), team = teamAlive(side);
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
