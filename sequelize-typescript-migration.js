module.exports = {
  connection: {
    dialect: "postgres",
    host: process.env.POSTGRES_DB,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },

  modelsDir: "src/models",
  migrationsDir: "src/migrations",
};
