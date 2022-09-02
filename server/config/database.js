const logMsg = (msg) => {
    console.log(msg);
};

const dbConfig = async (mongoose, DATABASE_URL) => {
    try {
        mongoose.connect(DATABASE_URL);
        const dbConnection = mongoose.connection;
        // handle errors after initial connection was established
        dbConnection.on('error', (err) => logMsg(err));
        dbConnection.once('open', () => logMsg('Connected to Mongoose'));
    } catch (err) {
        logMsg(err);
    }
};

module.exports = dbConfig;
