const mongoose = require('mongoose');
require('dotenv').config({ path: 'c:/Users/janan/OneDrive/Desktop/sts/smart-token-system/backend/.env' });

const services = [
  { serviceName: "Driving License", serviceCode: "DL-01", description: "Issue of new/renewal of driving license", officeType: "RTO", requiredDocuments: ["Aadhar", "Age Proof"] },
  { serviceName: "Vehicle Registration", serviceCode: "VR-01", description: "Registration of new vehicles", officeType: "RTO", requiredDocuments: ["Invoice", "Insurance"] },
  { serviceName: "Income Certificate", serviceCode: "IC-01", description: "Issuing income certificate", officeType: "VAO", requiredDocuments: ["Aadhar", "Salary Slip"] },
  { serviceName: "Caste Certificate", serviceCode: "CC-01", description: "Issuing community certificate", officeType: "VAO", requiredDocuments: ["Aadhar", "School Transfer Certificate"] },
  { serviceName: "Land Records (Patta/Chitta)", serviceCode: "LR-01", description: "Accessing and updating land records", officeType: "Revenue", requiredDocuments: ["Sale Deed", "Tax Receipt"] }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const Service = require('c:/Users/janan/OneDrive/Desktop/sts/smart-token-system/backend/models/Service');
    
    for (const s of services) {
      const existing = await Service.findOne({ serviceCode: s.serviceCode });
      if (!existing) {
        await new Service(s).save();
        console.log(`Created service: ${s.serviceName}`);
      } else {
        console.log(`Service exists: ${s.serviceName}`);
      }
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
