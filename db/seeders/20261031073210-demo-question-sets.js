'use strict';
const Q = [
  ['Which language is used for styling web pages?', ['HTML', 'CSS', 'JavaScript', 'PHP'], 1],
  ['Which SQL clause is used to filter records?', ['GROUP BY', 'ORDER BY', 'WHERE', 'SELECT'], 2],
  ['What does HTTP stand for?', ['HyperText Transfer Protocol', 'High Tech Transfer Process', 'Hyperlink Transfer Text Program', 'Hyper Terminal Text Protocol'], 0],
  ['Which data structure operates on a Last-In, First-Out (LIFO) basis?', ['Queue', 'Stack', 'Array', 'Tree'], 1],
  ['Which of these is a backend programming language?', ['HTML', 'CSS', 'Node.js', 'Bootstrap'], 2],
];
module.exports = {
  async up(q) {
    const db = q.sequelize;
    const [[h]] = await db.query("SELECT user_id AS id FROM users WHERE school_id = '2099-0001'");
    await q.bulkInsert('question_sets', [{ host_id: h.id, title: 'IT & Programming Basics', description: 'Fundamental concepts of tech and web development', subject: 'Technology', grade_level: 'College' }]);
    const [[s]] = await db.query("SELECT id FROM question_sets WHERE title = 'IT & Programming Basics'");
    await q.bulkInsert('questions', Q.map((x, i) => ({ question_set_id: s.id, position: i + 1, text: x[0], type: 'multiple_choice', time_limit_sec: 20 })));
    const [qs] = await db.query(`SELECT id FROM questions WHERE question_set_id = ${s.id} ORDER BY position`);
    const rows = [];
    qs.forEach((r, i) => Q[i][1].forEach((t, j) => rows.push({ question_id: r.id, choice_index: j, text: t, is_correct: j === Q[i][2] })));
    await q.bulkInsert('choices', rows);
  },
  async down(q) { await q.bulkDelete('question_sets', { title: 'IT & Programming Basics' }, {}); },
};