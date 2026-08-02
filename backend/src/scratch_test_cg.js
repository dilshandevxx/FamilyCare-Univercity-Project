const http = require('http');

http.get('http://localhost:5000/api/caregivers/public', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('STATUS:', res.statusCode);
    try {
      const json = JSON.parse(data);
      console.log('COUNT:', json.length);
      console.log('RESULTS:', JSON.stringify(json, null, 2));
    } catch(e) {
      console.log('RAW DATA:', data);
    }
  });
}).on('error', (err) => {
  console.error('HTTP ERR:', err);
});
