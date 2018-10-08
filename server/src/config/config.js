module.exports = {
  port: process.env.PORT || 8081,
  db: {
    database: process.env.DB_NAME || 'warehouse',
    user: process.env.DB_USER || 'warehouse',
    password: process.env.DB_PASS || 'warehouse',
    options: {
      dialect: process.env.DIALECT || 'sqlite',
      host: process.env.HOST || 'localhost',
      storage: './warehouse.sqlite'
    }
  },
  authentication: {
    jwtSecret: process.env.JWT_SECRET || 'warehouse_nh_secret'
  }
}
