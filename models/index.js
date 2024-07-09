import fs from "fs";
import path from "path";
import { Sequelize } from "sequelize";
import { fileURLToPath } from "url";
import config from "../config/config.json" assert { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];
const db = {};

let sequelize;
if (dbConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
} else {
  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    dbConfig
  );
}

const initModels = async () => {
  const modelFiles = fs.readdirSync(__dirname).filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".model.js"
    );
  });

  for (const file of modelFiles) {
    const { default: model } = await import(path.join(__dirname, file));
    const initializedModel = model(sequelize, Sequelize.DataTypes);
    db[initializedModel.name] = initializedModel;
  }

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
};

await initModels();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export { db, sequelize, Sequelize };
