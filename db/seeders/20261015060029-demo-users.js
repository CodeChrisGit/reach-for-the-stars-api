'use strict';
const H = 'seed-only-not-a-real-hash';
module.exports = {
  async up(q) {
    const P = [
      ['2099-1001', 'ana', 'Ana'], 
      ['2099-1002', 'ben', 'Ben'], 
      ['2099-1003', 'carlo', 'Carlo'],
      ['2099-1004', 'dana', 'Dana'], 
      ['2099-1005', 'ethan', 'Ethan'], 
      ['2099-1006', 'fe', 'Fe (never joined)']
    ];
    await q.bulkInsert('users', [
      { school_id: '2099-0001', username: 'librarian1', password_hash: H, full_name: 'Demo Librarian', email: 'librarian1@demo.test', role: 'HOST' },
      ...P.map(([s, u, d]) => ({ school_id: s, username: u, password_hash: H, full_name: d, email: `${u}@demo.test`, role: 'PLAYER' })),
    ]);
  },
  async down(q) { 
    await q.bulkDelete('users', { school_id: { [q.sequelize.Sequelize.Op.like]: '2099-%' } }, {}); 
  },
};