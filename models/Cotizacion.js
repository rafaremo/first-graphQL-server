const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cotizacionSchema = new Schema({
  name: String,
  amount: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }]
});

module.exports = mongoose.model('Cotizacion', cotizacionSchema);