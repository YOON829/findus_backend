const Sequelize = require("sequelize");

class Review extends Sequelize.Model {
  static associate(models) {
    // Review는 Place와 User에 속합니다.
    this.belongsTo(models.Place, { foreignKey: "place_id" });
    this.belongsTo(models.User, { foreignKey: "user_id" });
  }

  static initiate(sequelize) {
    Review.init(
      {
        review_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        place_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "place",
            key: "place_id",
          },
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "user",
            key: "user_id",
          },
        },
        rating: {
          type: Sequelize.INTEGER,
          allowNull: false,
          validate: {
            min: 1,
            max: 5,
          },
        },
        comment: {
          type: Sequelize.TEXT,
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
        modelName: "Review",
        tableName: "review",
        timestamps: false,
        indexes: [
          {
            unique: true,
            fields: ["review_id"],
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

module.exports = Review;
