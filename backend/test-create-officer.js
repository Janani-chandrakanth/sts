const http = require('http');

const data = JSON.stringify({
  name: "Test Officer",
  email: "test@officer.com",
  password: "password123",
  officeId: "67cb15609d949fe52b123456", 
  counterNumber: 1
});

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/superadmin/officer',
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
