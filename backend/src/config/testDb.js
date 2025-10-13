// 独立测试数据库连接占位（SQLite）
// TODO: 在实现阶段返回独立的 SQLite 连接（如 :memory:），当前返回 null 以保证骨架最小化。
module.exports = {
  getTestDb: () => {
    return null;
  },
};