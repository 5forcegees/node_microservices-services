const requiredAttributes = require('../../common/requiredAttributes').getData | [],
    utilities = require('../../common/utilities'),
    app_config_settings = require('application-configuration')().settings,
    logging = require('logging')(),
    logger = logging.general,
    logTypes = logging.logTypes;

/**
 * Transforms the request into the structure expected by esb
 * @param {Object} request - the object that contains request body and any other needed data
 * @param {Object} request.body|request.params|request.query - the request (e.g. { customerId: 123123, etc})
 */
module.exports.transform = function (request) {
    const isCacheable = (app_config_settings.get('/ESB/SERVICES/wsdlService1/cache').indexOf('getData') !== -1);
    return new Promise(function (resolve, reject) {

        // GET requests will be using the request.query
        // POST requests will be using request.body
        // utilities.collectAttributes will flatten the objects into one and return it
        utilities.collectAttributes(request)
            .then(function (collectedRequestObject) {
                // now that we have the request object flattened, verify that the required attributes are present
                utilities.verifyAttributes({requiredAttributes: requiredAttributes, request: collectedRequestObject})
                    .then(function (verifiedRequestObject) {
                        // the required attributes are present in the request, map them to the expected attributes

                        // build the xml string for the soap request body
                        var xmlString = '<BAN xmlns="http://services.uscellular.com/enterprise/CustomerBillingAccount/schema/CustomerAddress/v1_1">' + verifiedRequestObject.customerId + '</BAN>';

                        if (isCacheable) {
                            global.CACHECONFIG["KEY"] = request.cacheKey || null; 
                            global.CACHECONFIG.ESBOPS.getData = `getData:${verifiedRequestObject.customerId}`;
                        }
                        logger.log.info(logTypes.fnInside({CACHECONFIG:global.CACHECONFIG}), `getData cache state: ${isCacheable}`);

                        return resolve({$xml: xmlString});
                    })
                    .catch(function (err) {
                        // at least one required attribute was missing, pass the err up the chain
                        return reject(err);
                    })
            })
            .catch(function (err) {
                // there was a problem with utilities.collectAttributes, pass the err up the chain
                return reject(err);
            })
    })
}