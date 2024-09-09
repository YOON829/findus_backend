const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");

class User extends Sequelize.Model {
  static associate(models) {
    this.hasMany(models.Place, { foreignKey: "user_id" });
    this.hasMany(models.Bookmark, { foreignKey: "user_id" });
  }

  static initiate(sequelize) {
    User.init(
      {
        user_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        google_id: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        user_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true, // 이메일에 유니크 인덱스 적용
        },
        password_hash: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        token: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        is_active: {
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
        modelName: "User",
        tableName: "user",
        timestamps: false,
        hooks: {
          // User 생성 전에 비밀번호 해시
          beforeCreate: async (user, options) => {
            if (user.password_hash) {
              const salt = await bcrypt.genSalt(10);
              user.password_hash = await bcrypt.hash(user.password_hash, salt);
            }
          },
          // User 업데이트 전에 비밀번호 해시
          beforeUpdate: async (user, options) => {
            if (user.password_hash && user.changed("password_hash")) {
              const salt = await bcrypt.genSalt(10);
              user.password_hash = await bcrypt.hash(user.password_hash, salt);
            }
          },
        },
        indexes: [
          {
            unique: true,
            fields: ["user_id"],
          },
          {
            unique: true,
            fields: ["email"],
          },
        ],
      }
    );
  }
}

module.exports = User;
