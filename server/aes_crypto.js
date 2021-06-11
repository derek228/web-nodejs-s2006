var AESCrypt={};

var crypto = require('crypto');

var aeskey = Buffer.from([0x1A,0xD7,0xB8,0xC8,0x8A,0x2B,0xC6,0x01,
						0x78,0x5F,0x13,0x2A,0xED,0x96,0x7C,0xA1,
						0x59,0xAA,0x18,0xE1,0x77,0xD0,0xAC,0x74,
						0xD0,0xA0,0xB2,0xAC,0xF9,0xBA,0x6F,0x7B]);
var aesiv = Buffer.from([0xDF,0xE4,0xA9,0xCC,0xBA,0xDA,0x23,0xA2,
						0xD1,0xBC,0x8B,0xFF,0x39,0x18,0xF6,0x0B]);

//AESCrypt.decrypt = function(cryptkey, iv, encryptdata) {
AESCrypt.decrypt = function(data) {
	//console.log(data.length);
	
	aesiv = aesiv || "";
	var clearEncoding = 'utf8';
	var cipherEncoding = 'base64';
	var cipherChunks = [];
	var decipher = crypto.createDecipheriv('aes-256-cbc', aeskey, aesiv);
	decipher.setAutoPadding(false);
	var encryptdata = Buffer.from(data,'base64').toString('binary');
	//console.log('data='+data.length+ '    enc data=' +encryptdata.length);
	var outstr=decipher.update(encryptdata, cipherEncoding);
	//console.log(outstr.length + '=1= '+ outstr.toString('hex'));
	//console.log(outstr[outstr.length-1].toString('hex'));
	outstr=outstr.toString('utf8');
	//var offset=outstr.indexOf('}');
	outstr = outstr.slice(0,outstr.indexOf('}')+1);
	//console.log(offset +"  = 1 =" + outstr );
	//outstr=outstr.split('}');
	//console.log(outstr.length + '=1= '+ outstr[0]);
	//outstr=Buffer.from(outstr[0]).join('}').toString('binary');
	//console.log(outstr[outstr.length-1].toString('hex'));

//	if (outstr[outstr.length-1] !== '}')  {
//		if 
//	}
	return outstr;


	//encryptdata = new Buffer.from(encryptdata, 'base64').toString('binary');
	/*
	console.log(Buffer.from(data));
	console.log(Buffer.from(data).toString('binary'));
	var encryptdata = Buffer.from(data,'base64').toString('binary');
	console.log(encryptdata.length);
	cipherChunks.push(decipher.update(encryptdata, cipherEncoding, clearEncoding));
	console.log(encryptdata.length);
	cipherChunks.push(decipher.final(clearEncoding));
	console.log("json : "+ encryptdata.length +" == "+cipherChunks);
	return cipherChunks.join('');*/
}

AESCrypt.encrypt = function(cleardata) {
    var encipher = crypto.createCipheriv('aes-256-cbc', aeskey, aesiv),
        encryptdata  = encipher.update(cleardata);

    encryptdata += encipher.final();
    encode_encryptdata = new Buffer(encryptdata, 'binary').toString('base64');
    return encode_encryptdata;
}

module.exports = AESCrypt;
