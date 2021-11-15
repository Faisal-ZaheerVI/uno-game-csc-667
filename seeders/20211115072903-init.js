'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('cards', [
      {
        id: 1,
        color: 'red',
        value: 0
      },
      {
        id: 2,
        color: 'red',
        value: 1
      },
      {
        id: 3,
        color: 'red',
        value: 2
      },
      {
        id: 4,
        color: 'red',
        value: 3
      },
      {
        id: 5,
        color: 'red',
        value: 4
      },
      {
        id: 6,
        color: 'red',
        value: 5
      },
      {
        id: 7,
        color: 'red',
        value: 6
      },
      {
        id: 8,
        color: 'red',
        value: 7
      },
      {
        id: 9,
        color: 'red',
        value: 8
      },
      {
        id: 10,
        color: 'red',
        value: 9
      },
      {
        id: 11,
        color: 'red',
        value: 10
      },
      {
        id: 12,
        color: 'red',
        value: 11
      },
      {
        id: 13,
        color: 'red',
        value: 12
      },
      {
        id: 14,
        color: 'black',
        value: 0
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('cards', null, {});
  }
};
