const Sequelize = require("sequelize");

class Hashtag extends Sequelize.Model {
  static associate(models) {
    this.belongsTo(models.Place, { foreignKey: "place_id" });
    this.belongsTo(models.Work, { foreignKey: "work_id" });
  }

  static initiate(sequelize) {
    Hashtag.init(
      {
        hashtag_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        hash_name: {
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
        place_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "Place",
            key: "place_id",
          },
        },
        work_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "Work",
            key: "work_id",
          },
        },
      },
      {
        sequelize,
        modelName: "Hashtag",
        tableName: "hashtag",
        timestamps: false,
        indexes: [
          {
            unique: true,
            fields: ["hashtag_id"],
          },
          {
            fields: ["place_id"],
          },
          {
            fields: ["work_id"],
          },
        ],
      }
    );
  }
}

module.exports = Hashtag;
