module.exports = {
    // Building the logger.
    logger: require('tracer').colorConsole({
        format: [
            '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})',
            {
                error: '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})'
            }
        ],

        dateformat: 'HH:MM:ss.L',
        preprocess: function (data) {
            data.title = data.title.toUpperCase()
        },
        level: "info, error"
    }),

    // Information about the database.
    dbconfig: {
        user: "progr4",
        password: "password123",
        server: "aei-sql.avans.nl",
        database: "Prog4-Eindopdracht1",
        port: 1443,
        options: {
            encrypt: false
        }
    }
};