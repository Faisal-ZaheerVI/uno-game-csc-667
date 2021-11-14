'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.createTable('games', {
      // Game_ID
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // Host of the game?
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' }
      },
      title: {
        type: Sequelize.STRING
      },
      direction: {
        type: Sequelize.INTEGER
      },
      created: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.createTable('chats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { 
          model: 'users', 
          key: 'id' 
        }
      },
      game_id: {
        type: Sequelize.INTEGER,
        references: { 
          model: 'games', 
          key: 'id' 
        }
      },
      message: {
        type: Sequelize.TEXT
      },
      created: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropAllTables();
    // await queryInterface.dropTable('users');
  }
};