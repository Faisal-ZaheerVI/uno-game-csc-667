'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('cards', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      color: {
        type: Sequelize.ENUM('red', 'blue', 'green', 'yellow', 'black'),
        allowNull: false
      },
      value: {
        allowNull: false,
        // 0-9 , 10=Skip, 11=Reverse, 12="+2", 13=Wild (Choose color), 14="+4" (Choose color)
        type: Sequelize.INTEGER
      }
    });

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
        allowNull: false,
        type: Sequelize.STRING
      },
      direction: {
        allowNull: false,
        type: Sequelize.INTEGER // -1 or 1
      },
      created: { // Do we need?
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.createTable('game_players', {
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' }
      },
      game_id: {
        type: Sequelize.INTEGER,
        references: { model: 'games', key: 'id' }
      },
      current_player: { // Change to boolean?
        allowNull: false,
        type: Sequelize.INTEGER // 0 for false, 1 for true
      },
      order: {
        allowNull: false,
        type: Sequelize.INTEGER
      }
    });

    await queryInterface.createTable('game_cards', {
      user_id: {
        allowNull: true, // If in Discard, no User has the card, hence NULL? (or do 0)
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' }
      },
      game_id: {
        type: Sequelize.INTEGER,
        references: { model: 'games', key: 'id' }
      },
      card_id: {
        type: Sequelize.INTEGER,
        references: { model: 'cards', key: 'id' }
      },
      order: { // Order in hand?
        allowNull: false,
        type: Sequelize.INTEGER
      },
      discarded: { // Change to boolean?
        allowNull: false,
        type: Sequelize.INTEGER // 1 for true, 0 for false.
      },
      draw_pile: { // Change to boolean?
        allowNull: false,
        type: Sequelize.INTEGER // 1 for true, 0 for false.
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
  }
};