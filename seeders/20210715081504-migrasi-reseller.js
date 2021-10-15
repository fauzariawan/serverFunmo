'use strict';
const data = require('../dataResellerFix.json')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('reseller', data, {})
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('reseller', null, {})
  }
};
