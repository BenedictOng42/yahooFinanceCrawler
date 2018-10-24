import express from 'express';
import yahooFinanceModel from '../api/models/financeAPIModels/yahooFinanceModel';

let app = express();

app.set('port', 3000);

app.get('/', function(reg, res){
  const reader =  yahooFinanceModel.getAllStocks();
  res.send(reader);
});


app.listen(app.get('port'), function() {
  console.log('App running on http://localhost:3000/');
})

