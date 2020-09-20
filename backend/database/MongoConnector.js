class MongoConnector {
    /**
     * @param {Mongoose} mongoose
     */
    constructor(mongoose) {
        this.mongoose = mongoose;
    }

    /**
     * @param {string} connectionString
     * @param {string} databaseName
     * @returns {Promise<Connection>}
     */
    async connect(connectionString, databaseName) {
        try {
            return await this.mongoose.connect(connectionString, {
                connectTimeoutMS: 10 * 1000,
                useNewUrlParser: true,
                useFindAndModify: false, /* Avoids deprecation warning when using findOneAndUpdate() */
                dbName: databaseName
            });
        } catch (error) {
            console.error('Cannot connect to Mongo DB.', error);
            throw error;
        }
    }
}

module.exports = MongoConnector;