const Sequelize = require("sequelize");
class Image extends Sequelize.Model {
  static associate(models) {
    this.belongsTo(models.Place, { foreignKey: "place_id" });
  }

  static initiate(sequelize) {
    Image.init(
      {
        image_id: {
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
        image_url: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        type: {
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
        modelName: "Image",
        tableName: "image",
        timestamps: false,
        indexes: [
          {
            unique: true,
            fields: ["image_id"],
          },
          {
            fields: ["place_id"],
          },
        ],
      }
    );
  }
}

module.exports = Image;
