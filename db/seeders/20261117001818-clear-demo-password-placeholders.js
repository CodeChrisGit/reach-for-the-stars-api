'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkUpdate(
      'users',
      { password_hash: null },
      { password_hash: 'seed-only-not-a-real-hash' }
    );
  },

  async down() {
    // Password hashes are intentionally retained on rollback.
  },
};
