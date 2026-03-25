const http = require('http');

const data = JSON.stringify({
  officeName: "Test Office 2",
  officeType: "RTO",
  city: "Test City",
  pincode: "123456",
  totalCounters: 2,
  services: [],
  location: {
    type: "Point",
    coordinates: [78.1, 10.2]
  }
});

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/superadmin/office',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log('Response:', body));
});

req.on('error', error => console.error('Error:', error));
req.write(data);
req.end();
