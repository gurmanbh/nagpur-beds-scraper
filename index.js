const url = 'https://nsscdcl.org/covidbeds/'
const cheerio = require('cheerio')
const request = require('request')
const io = require('indian-ocean')
const ajax = 'https://nsscdcl.org/covidbeds/GetBedsData.jsp?hname='
const fetchData = require('./lib/getUrl.js')
const data = []
const errors = []

const run = async() => {
	request(url, async function (err, response, body) {
	    if (!err && response.statusCode == 200){
	    	// get the body
	        var $ = cheerio.load(body);
	        // get the response
	        const children = $('#hosp_name').children('option')

	        for (let index = 0; index < children.length; index++){
	        	const hospital = $(children[index]).html()
				await writeData(hospital) 
				if (index === children.length-1){
					for (let eI = 0; eI < errors.length; eI++){
						await writeData(errors[eI], true)
						if (eI===errors.length-1){
							console.log('Writing Data')
							io.writeDataSync('./data/files/'+data[data.length-1].date+'.csv',data)
						}
					
					}
					
				}  
	        }
		} else {
			console.log('Page down')
		}
	})
}

async function writeData(hospital, error){
	try {
		let temp = await (fetchData(ajax+hospital))
		temp = temp[0]
		temp.name = hospital
	    temp.date = new Date()
	    data.push(temp)
	} catch (err){
		console.log('Cannot get '+ hospital)
		if (!error) {errors.push(hospital)}
	}
}

run()
