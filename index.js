const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const content = 'Some content!';

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

// app.use(express.static('Nodejs'));

const ExpenseFile = 'expense_data.json'
const DataIdFile = 'data_id.json'

app.get('/', (req, res) => {
  res.render('expense_tracker');
  /*res.send('this is a r');*/
});



app.post('/submit', (req, res) => {
  let amount = req.body.num_input;
  let message = req.body.msg_input;
  
  console.log(amount)
  if (!fs.existsSync(ExpenseFile)) {
    let current_obj = {}
    current_obj.amt = amount;
    if (!amount == ""&&!message=="") {

      fs.writeFileSync(ExpenseFile, JSON.stringify({ a1: { amt: amount, msg: message } }), 'utf8', (err) => {
        if (err) {
          console.log('ffg');
        }
         });
    }
  }
  else {
    
    let data_json = getFileAsJson();
    if(data_json!=false){

        let key = `a${Object.keys(data_json).length + 1}`;

        let current_obj = {}
        current_obj.amt = amount;
        current_obj.msg = message;
        if (!amount == ""&&!message=="") {
        data_json[key] = current_obj;
        fs.writeFileSync(ExpenseFile, JSON.stringify(data_json), 'utf8', (err) => {
            if (err) {
            console.log('error while writing file')
            }
        });
        }
    }
    
  }
  res.status(204).end();
});

app.get('/getexpense', (req, res) => {
  if (!fs.existsSync(ExpenseFile)) {
    res.send('No record found');
  }
  else {
    res.json(getFileAsJson());
  }
});

function getFileAsJson() {
  let data;
  const data_str = fs.readFileSync(ExpenseFile, 'utf8')

  if (data_str!=''){
    // console.log(typeof data_str)
    data = JSON.parse(data_str)
  }else{
    data = false
  }
  
  return data;
}

app.get('/clear', (req, res) => {
  let data = getFileAsJson();
    
  if (data!=false){
    let resp;
    if (Object.keys(data).length > 0) {
        Object.keys(data).forEach(key => {
        
        delete data[key];
        });
    fs.writeFileSync(ExpenseFile, JSON.stringify(data), 'utf8', (err) => {
            if (err) {
            resp= err.message;
            }else{
            resp = 'success';
            }
        });
        res.send('success');
    }
    else{
        res.send('empty');
    }
    
  }
  
  
});



app.listen(5000);