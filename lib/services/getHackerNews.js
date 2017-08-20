const transformer = require('../transformers/getHackerNews'),
    httpCall = require('data-access')().http.httpCall,
    mockData = require('./../config/mockData.json');

/**
 * Retrieves the http response using the data access layer
 * @param {Object} request - the object that contains request body
 * @param {Object} request.body|request.params|request.query - the request (e.g. { customerId: 123123, etc)
 * @param string request.params|body|query.username - the username to search for
 *
 */
module.exports.getHackerNews = function (request) {

    return transformer.transform(request)
        .then(function (transformedRequest) {

            // before integration with back end just return mock data
            // return {result: mockData};

            return httpCall(transformedRequest.options)
                .then(function (result) {
                    return {result: result};

                }).catch(function (err) {

                    // error handling and return error to front end
                    return {err: err};
                });
        })
        .catch(function (err) {
        })
}
