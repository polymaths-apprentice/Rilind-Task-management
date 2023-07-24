class IDatabase {
  async connect() {}
  async query(text, values) {}
}

module.exports = IDatabase;
