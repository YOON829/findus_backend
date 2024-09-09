const Sequelize = require("sequelize");

class Place extends Sequelize.Model {
  static associate(models) {
    this.belongsTo(models.Work, { foreignKey: "work_id" });
    this.belongsTo(models.User, { foreignKey: "user_id" });
    this.hasMany(models.Image, { foreignKey: "place_id" });
    this.hasMany(models.Bookmark, { foreignKey: "place_id" });
  }

  static initiate(sequelize) {
    Place.init(
      {
        place_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          allowNull: false,
          autoIncrement: true, // 이 부분이 없다면 수동으로 증가시켜야 합니다.
        },
        work_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "Work",
            key: "work_id",
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
        place_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        address_region: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        address_city: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        address_district: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        detailed_address: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        latitude: {
          type: Sequelize.DECIMAL(15, 12),
          allowNull: true,
        },
        longitude: {
          type: Sequelize.DECIMAL(15, 12),
          allowNull: true,
        },
        latestshot_date: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        opening_hours: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        marker_img: {
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
        deleted_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "Place",
        tableName: "place",
        timestamps: false,
        indexes: [
          {
            unique: true,
            fields: ["place_id"],
          },
          {
            fields: ["work_id"],
          },
          {
            fields: ["user_id"],
          },
          {
            fields: ["place_name"],
          },
        ],
      }
    );
  }
}
module.exports = Place;
