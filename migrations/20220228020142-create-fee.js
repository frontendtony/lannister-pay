'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('fees', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      locale: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      entity: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      entity_prop: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fee_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      flat_value: {
        type: Sequelize.FLOAT,
      },
      perc_value: {
        type: Sequelize.FLOAT,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('fees');
  },
};
