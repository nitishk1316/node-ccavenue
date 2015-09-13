var crypto = require('crypto'), algorithm = 'aes-128-cbc';

function decrypt(text, workingKey){
    var decipher = crypto.createDecipher(algorithm, workingKey);
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');

    return dec;
}

function getCheckSum(MerchantId, Amount, OrderId , URL, WorkingKey)
{
    var str = MerchantId + "|" + OrderId + "|" + Amount + "|" + URL + "|" + WorkingKey;
    var adler = 1;
    adler = adler32(adler, str);

    return adler;
}

function genChecksum(str)
{
    var adler = 1;
    adler = adler32(adler,str);
    
    return adler;
}

function verifyChecksum(getCheck, avnChecksum)
{
    var verify=false;
    if(getCheck == avnChecksum) verify=true;
    
    return verify;
}

function adler32(adler , str)
{
    var BASE =  65521 ;
    var s1 = adler & 0xffff ;
    var s2 = (adler >> 16) & 0xffff;
    
    for(var i = 0 ; i < str.length ; i++)
    {
        s1 = (s1 + str[i].charCodeAt(0)) % BASE ;
        s2 = (s2 + s1) % BASE ;
    }
    
    return leftshift(s2 , 16) + s1;
}

function leftshift(str , num)
{
    var str = (+str).toString(2);
    var l = 64 - str.length;
    for( var i = 0 ; i < l ; i++)
    {
				str = "0" + str ;
		}

    for(var i = 0 ; i < num ; i++)
    {
                str = str + "0";
                str = str.substr(1) ;
   }
    
   return cdec(str) ;
}

function cdec(num)
{
    var dec = 0;
    for (var n = 0 ; n < num.length ; n++)
    {
       var temp = num[n] ;
       dec =  dec + temp * Math.pow(2 , num.length - n - 1);
    }
    
    return dec;
}

function checkRequiredField(config) {
    var errors = [];

    if(! config.merchantId) {
      errors.push("Merchant Id is required");
      console.log("Merchant Id is required");
    }
    
    if(! config.workingKey) {
      errors.push("Working Key is required");
      console.log("Working Key is required");
    }
    
    if(! config.orderId) {
      errors.push("Order Id is required");
      console.log("Order Id is required");
    }
    
    if(! config.redirectUrl) {
      errors.push("Redirect Url is required");
      console.log("Redirect Url is required");
    }

    if(! config.orderAmount) {
      errors.push("Order Amount is required");
      console.log("Order Amount is required");
    }

    return errors;
}


module.exports = {
    getCheckSum: getCheckSum,
    verifyChecksum: verifyChecksum,
    genChecksum: genChecksum,
    decrypt: decrypt,
    checkRequiredField: checkRequiredField
};
