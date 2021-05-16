const axios = require('axios');
module.exports = async(url, variable) => {
  let data;
  try {
    const response = await axios.get(url);
    data = await response.data;
  } catch (err) {

  }
  
  return data;
};