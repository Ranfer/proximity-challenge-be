const autoFi =  require('../model/autoFi.model');

module.exports.create = async (info) => {
    if(!info) {
        throw new Error('Missing autoFi');
    }

    await autoFi.create(info);
}