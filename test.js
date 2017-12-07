const { lookup } = require('./yahoo-stocks');

dan = lookup('AA').then(
  (data) => {console.log(data);},
  (err) => {
    console.log(err);
    console.log('##');
  }
)
.catch((err)=>{
  console.log('######');})
