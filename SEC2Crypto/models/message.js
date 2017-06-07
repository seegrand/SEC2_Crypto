var mongoose = require('mongoose');

console.log('Inializing message schema');

var messageSchema = new mongoose.Schema({
  name: { type: String, required: true, index: { unique: true, dropDups: true }},
  secret: { type: String, required: false },
  password: { type: String, required: true }
});

messageSchema.set('toJSON', { virtuals: true })

mongoose.model('Message', messageSchema);
