const mongoose = require('mongoose');
require('dotenv').config({ path: 'c:/Users/janan/OneDrive/Desktop/sts/smart-token-system/backend/.env' });

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const Service = require('c:/Users/janan/OneDrive/Desktop/sts/smart-token-system/backend/models/Service');
    const services = await Service.find();
    console.log('Services:', JSON.stringify(services, null, 2));
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
