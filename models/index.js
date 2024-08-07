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

const getModelFiles = (dir) => {
  const files = [];

  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      files.push(...getModelFiles(fullPath)); // 하위 디렉토리 재귀 호출
    } else if (file.endsWith(".model.js")) {
      files.push(fullPath);
    }
  });

  return files;
};

const initModels = async () => {
  try {
    const modelFiles = getModelFiles(__dirname);
    for (const file of modelFiles) {
      const relativePath = path.relative(__dirname, file).replace(/\\/g, "/"); // 상대 경로로 변환
      const { default: model } = await import(`./${relativePath}`);
      const initializedModel = model(sequelize, Sequelize.DataTypes);
      db[initializedModel.name] = initializedModel;
    }

    Object.keys(db).forEach((modelName) => {
      if (db[modelName].associate) {
        db[modelName].associate(db);
      }
    });
  } catch (error) {
    console.error("Error initializing models:", error);
  }
};

await initModels();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
