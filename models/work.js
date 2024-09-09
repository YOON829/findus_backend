const { Model, Sequelize } = require("sequelize");

class Work extends Sequelize.Model {
  static associate(models) {
    this.hasMany(models.Place, { foreignKey: "work_id" });
  }

  static initiate(sequelize) {
    Work.init(
      {
        work_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        work_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        work_season: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        work_ep: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        poster: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        start_date: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        end_date: {
          type: Sequelize.DATE,
          allowNull: true,
        },
          genre: {
          type: Sequelize.STRING,
          allowNull: true,
        },
          director: {
          type: Sequelize.STRING,
          allowNull: true,
        },
          series_writer: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: Sequelize.NOW,
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: Sequelize.NOW,
        },
      },
      {
        sequelize,
        modelName: "Work",
        tableName: "work",
        timestamps: false,
        indexes: [
          {
            unique: true,
            fields: ["work_id"],
          },
          {
            fields: ["work_name"],
          },
        ],
      }
    );
  }
}

module.exports = Work;
