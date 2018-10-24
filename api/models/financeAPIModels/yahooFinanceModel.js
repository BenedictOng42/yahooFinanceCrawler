
import yahooFinance from 'yahoo-finance';
import Excel from 'exceljs';
class yahooFinanceAPIModel {
  
  static async getAllStocks(){
    const workbook = new Excel.Workbook();
    const tickerInfo = {};

    tickerInfo['tickerNames'] = [];
    tickerInfo['tickerUnits'] = [];
    try {
      await workbook.xlsx.readFile('2018-10-12 NDQ PCF File.xlsx')
          .then(function(result) {
            const worksheet = workbook.getWorksheet(1);
            const column = worksheet.getColumn(1);
            
            let startScan = false;
            column.eachCell(cell => {
              if (cell.value === null){
                startScan = false;
              }
              else if (startScan && cell.value.length > 0 && cell.value.length <= 5){
                tickerInfo.tickerNames.push(cell.value);
              }
              if(cell.value=== "Security Exchange  Code"){
                startScan = true;
              }
            });
            const column2 = worksheet.getColumn(4);
            
            startScan = false;
            column2.eachCell(cell => {
              if (cell.value === null || cell.value === ''){
                startScan = false;
              }
              else if (startScan && cell.value > 0){
                tickerInfo.tickerUnits.push(cell.value);
              }
              if(cell.value=== "Units"){
                startScan = true;
              }
            });
          });
    }
    catch(e){
      console.log(e);
    }

    let stocks = [];
    let counter = 0;
    while (counter < tickerInfo.tickerNames.length) {
      let result;
      console.log(tickerInfo.tickerNames[counter]);
      try {
        result = await yahooFinance.quote({
          symbol: tickerInfo.tickerNames[counter],
          modules: ['price']
          }, function  (err, quotes) {
            //...
        });

      }
      catch(err) {
        console.log(err, "SHHHHHHHHHHHHHHHHHHHH");
      }
      stocks.push({price: result.price.regularMarketPrice, symbol: tickerInfo.tickerNames[counter], units: tickerInfo.tickerUnits[counter], total: tickerInfo.tickerUnits[counter]*result.price.regularMarketPrice});
      counter++;
    }

    const reducer = (acc, curr) => acc + curr.total;
    const total = stocks.reduce(reducer, 0);
    console.log(total);
    console.log(stocks.length)
    return stocks;
   }

   static 
  
}

export default yahooFinanceAPIModel;