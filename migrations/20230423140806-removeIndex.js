"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([queryInterface.removeIndex("Users", "email", { transaction: t }), queryInterface.removeIndex("Users", "nickname", { transaction: t })]);
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([queryInterface.addIndex("Users", "email", { transaction: t }), queryInterface.addIndex("Users", "nickname", { transaction: t })]);
    });
  },
};
