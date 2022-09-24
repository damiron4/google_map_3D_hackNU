// Requiring the module
const reader = require('xlsx')
  
// Reading our test file
const file = reader.readFile('./hacknu-dev-data.xlsx')
  
let data = []
  
const sheets = file.SheetNames
  
i = 10;
   const temp = reader.utils.sheet_to_json(
        file.Sheets[file.SheetNames[i]])
   temp.forEach((res) => {
      data.push(res)
   })
  
// Printing data
console.log(data)