var helper = require('./helper');
var qs = require('querystring')

var otherParams = {};

var config = {
	merchantId: '',
	workingKey: '',
	orderId: '',
	redirectUrl: '',
	orderAmount: ''
};

function setMerchant(mid) {
	config.merchantId = mid;
}
function setWorkingKey(wk) {
	config.workingKey = wk;
}
function setOrderId(oi) {
	config.orderId = oi;
}
function setRedirectUrl(ru) {
	config.redirectUrl = ru;
}
function setOrderAmount(oa) {
	config.orderAmount = oa;
}

function setOtherParams(obj) {
	otherParams = obj;
}

function makePayment(res) {
	var errors = helper.checkRequiredField(config);
	if(errors.length > 0) {
		throw new Error(errors);	
	}

	var Checksum = helper.getCheckSum(config.merchantId, config.orderAmount, config.orderId, config.redirectUrl, config.workingKey); //This function is to verify 
      
  	var body = "<form method='post' name='checkout' id='checkout' action='https://www.ccavenue.com/shopzone/cc_details.jsp'>" +
          "<input type=hidden name='Merchant_Id' value='" + config.merchantId + "'>" +
          "<input type=hidden name='Amount' value='" + config.orderAmount + "'>" +
          "<input type=hidden name='Order_Id' value='" + config.orderId + "'>" +
          "<input type=hidden name='Redirect_Url' value='" + config.redirectUrl +"'>" +
          "<input type=hidden name='Checksum' value='" + Checksum + "'>" +
          "<input type=hidden name='TxnType' value='A'>" +
          "<input type=hidden name='ActionID' value='TXN'>";

          for(var key in otherParams) {
          		body += "<input type=hidden name='"+ key +"' value='" + otherParams[key] + "'>";
          }

          body += "</form><script type='text/javascript'>" +
	          "document.getElementById('checkout').submit();" +
	      "</script>";

  	res.writeHead(200, {
        'Content-Length': Buffer.byteLength(body),
        'Content-Type': 'text/html'
    });

  	res.write(body);
  	res.end();
}

function paymentRedirect(req) {
	var body = qs.parse(req.body);
    
    var ccString = helper.decrypt(body.encResponse, config.workingKey);
    var ccJson = qs.parse(ccString);
    
    ccString = config.merchantId + '|' + ccJson.Order_Id + '|' +
                 ccJson.Amount + '|' + ccJson.AuthDesc + '|' + config.workingKey;
    
    var Checksum = helper.genChecksum(ccString);
    ccJson.isCheckSumValid = helper.verifyChecksum(Checksum, ccJson.Checksum);
    
    return ccJson;
  }


module.exports = {
	setMerchant: setMerchant,
	setWorkingKey: setWorkingKey,
	setOrderId: setOrderId,
	setRedirectUrl: setRedirectUrl,
	setOrderAmount: setOrderAmount,
	setOtherParams: setOtherParams,
	makePayment: makePayment,
	paymentRedirect: paymentRedirect
};
