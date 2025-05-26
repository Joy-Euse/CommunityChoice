// In truffle-config.js
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    localhost: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    }
  },
  compilers: {
    solc: {
      version: "0.8.0"
    }
  }
};