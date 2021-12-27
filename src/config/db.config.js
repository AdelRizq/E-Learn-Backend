module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "root",
    DB: "lms",
    dialect: "mysql",

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};

// module.exports = {
//     HOST: "sql11.freemysqlhosting.net",
//     USER: "sql11461123",
//     PASSWORD: "HuuCN9953R",
//     DB: "sql11461123",
//     dialect: "mysql",

//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000,
//     },
// };
