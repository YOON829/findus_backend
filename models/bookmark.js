const Sequelize = require("sequelize");

class Bookmark extends Sequelize.Model {
  static associate(models) {
    this.belongsTo(models.Place, { foreignKey: "place_id" });
    this.belongsTo(models.User, { foreignKey: "user_id" });
  }

  static initiate(sequelize) {
    Bookmark.init(
      {
        bookmark_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        place_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "Place",
            key: "place_id",
          },
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "User",
            key: "user_id",
          },
        },
        check: {
          type: Sequelize.TINYINT,
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
        modelName: "Bookmark",
        tableName: "bookmark",
        timestamps: false,
        indexes: [
          {
            unique: true,
            fields: ["bookmark_id"],
          },
          {
            fields: ["place_id"],
          },
          {
            fields: ["user_id"],
          },
        ],
      }
    );
  }
}

module.exports = Bookmark;
