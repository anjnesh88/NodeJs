const mongoose = require('mongoose');

const connectDb = async ()=> {
 await mongoose.connect('mongodb+srv://anjnesh12vasudeva55:Anjnesh$$4@nodecluster.ocghsxc.mongodb.net/devTinder');   
}


module.exports = {connectDb}