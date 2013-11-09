calculator.CUMIPMT = function(rate, periods, pv, start, end, type, callback){
    var deferred = Q.defer();
    try{

        //assure we can pass promise to callback
        if(typeof rate === 'function') callback = rate;
        if(typeof NPER === 'function') callback = NPER;
        if(typeof PMT === 'function') callback = PMT;
        if(typeof type === 'function') callback = type;

        //validate arguments
        if(!calculator.isRequiredPositiveNumber(rate)) throw new Error('rate' + calculator.validationErrors[0]);
        if(!calculator.isRequiredPositiveInteger(NPER)) throw new Error('NPER' + calculator.validationErrors[1]);
        if(!calculator.isRequiredPositiveNumber(PMT)) throw new Error('PMT' + calculator.validationErrors[0]);
        if(!calculator.isProperType(type)) throw new Error('type', calculator.validationErrors[2]);
        if(callback && !calculator.isFunction(callback)) throw new Error('callback', calculator.validationErrors[3]);
        type = type || 0;
        var result;

        deferred.resolve(result);
        if(callback) return deferred.promise.nodeify(callback);
        return result;

    } catch (err){
        deferred.reject(err);
        if(callback) return deferred.promise.nodeify(callback);
        return err;
    }
};