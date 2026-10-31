'use strict';
// 1 = correct, 0 = wrong. Ben and Carlo tie on stars; Ethan stops after 3 answers; Fe never joins.
const PLAYS = [
  ['2099-1001', 'Ana', [1, 1, 1, 1, 1], 3000],
  ['2099-1002', 'Ben', [1, 1, 0, 1, 1], 4200],
  ['2099-1003', 'Carlo', [1, 0, 1, 1, 1], 5100],
  ['2099-1004', 'Dana', [1, 0, 0, 1, 1], 6000],
  ['2099-1005', 'Ethan', [1, 1, 0], 7000],
];
function play(r) {
  let st = 0, sk = 0, best = 0, ok = 0;
  const rows = r.map((c) => {
    const before = st;
    if (c) { st += 1; sk += 1; ok += 1; best = Math.max(best, sk); } else { st = Math.max(0, st - 1); sk = 0; }
    return { c, earned: st - before, sk };
  });
  return { st, sk, best, ok, rows };
}
module.exports = {
  async up(q) {
    const db = q.sequelize;
    const one = async (sql) => (await db.query(sql))[0][0].id;
    const host = await one("SELECT user_id AS id FROM users WHERE school_id = '2099-0001'");
    const set = await one("SELECT id FROM question_sets WHERE title = 'IT & Programming Basics'");
    await q.bulkInsert('game_sessions', [
      { host_id: host, question_set_id: set, join_code: '482731', status: 'ENDED', duration_sec: 300,
        started_at: new Date('2026-10-09T01:00:00Z'), ends_at: new Date('2026-10-09T01:05:00Z'), ended_at: new Date('2026-10-09T01:05:00Z') },
      { host_id: host, question_set_id: set, join_code: '735190', status: 'WAITING', duration_sec: 300 },
    ]);
    const sid = await one("SELECT id FROM game_sessions WHERE join_code = '482731'");
    const res = PLAYS.map(([, , r, base]) => ({ ...play(r), base }));
    const seats = [];
    for (let i = 0; i < PLAYS.length; i++) {
      const uid = await one(`SELECT user_id AS id FROM users WHERE school_id = '${PLAYS[i][0]}'`);
      const p = res[i];
      seats.push({ session_id: sid, user_id: uid, nickname: PLAYS[i][1], stars: p.st, current_streak: p.sk, best_streak: p.best,
        correct_count: p.ok, answer_count: p.rows.length, total_answer_ms: p.rows.reduce((a, _, k) => a + p.base + k * 100, 0) });
    }
    await q.bulkInsert('players', seats);
    const [qs] = await db.query(`SELECT q.id,
      (SELECT id FROM choices WHERE question_id = q.id AND is_correct) AS good,
      (SELECT id FROM choices WHERE question_id = q.id AND NOT is_correct ORDER BY choice_index LIMIT 1) AS bad
      FROM questions q WHERE q.question_set_id = ${set} ORDER BY q.position`);
    const ans = [];
    for (let i = 0; i < PLAYS.length; i++) {
      const pid = await one(`SELECT id FROM players WHERE session_id = ${sid} AND nickname = '${PLAYS[i][1]}'`);
      res[i].rows.forEach((r, k) => ans.push({ player_id: pid, question_id: qs[k].id, choice_id: r.c ? qs[k].good : qs[k].bad,
        is_correct: !!r.c, answer_time_ms: res[i].base + k * 100, stars_earned: r.earned, streak_after: r.sk }));
    }
    await q.bulkInsert('answers', ans);
    // Ana's 5th correct answer earned a Mystery Chest
    const anaId = await one(`SELECT id FROM players WHERE session_id = ${sid} AND nickname = 'Ana'`);
    const fifth = await one(`SELECT id FROM answers WHERE player_id = ${anaId} AND question_id = ${qs[4].id}`);
    await q.bulkInsert('chest_offers', [{ answer_id: fifth, player_id: anaId, status: 'OPENED', picked_slot: 1, opened_at: new Date('2026-10-09T01:04:00Z') }]);
    const offer = await one(`SELECT id FROM chest_offers WHERE answer_id = ${fifth}`);
    await q.bulkInsert('chest_slots', ['DOUBLE_STAR', 'STREAK_PROTECTION', 'EMPTY'].map((t, i) => ({ chest_offer_id: offer, slot_number: i + 1, reward_type: t })));
  },
  async down(q) { await q.bulkDelete('game_sessions', { join_code: ['482731', '735190'] }, {}); },
};