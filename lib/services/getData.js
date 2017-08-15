const transformer = require('../transformers/getData'),
    constants = require('../../common/constants'),

    soapCall = require('data-access')().esb.soapCall,
    appConfig = require('application-configuration')(),

    mockGetDataResponse = appConfig.mockData.get('/getData');

/**
 * Retrieves the SOAP response from data access layer
 * @param {Object} request - the object that contains request body
 * @param {Object} request.body|request.params|request.query - the request (e.g. { customerId: 123123, etc)
 * @param string request.params|body|query.username - the username to search for
 *
 */
module.exports.getData = function (request) {

    return new Promise(function(resolve, reject) {
        transformer.transform(request)
            .then( function(transformedRequest) {

                // before integration with back end just return mock data
                // resolve({result: mockGetDataResponse});

                var soapCallObject = {
                    esbService: 'getDataService',
                    esbOperation: 'getDataOperation',
                    input: transformedRequest
                };

                soapCall(soapCallObject, function(err, soapResult){
                    if (err) {
                        reject(err);
                    } else {
                        resolve(soapResult);
                    }
                });
            })
            .catch(function(err){
                reject(err);
            })
    });
}
