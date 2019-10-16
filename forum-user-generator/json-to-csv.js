const args = process.argv
const csvjson = require('csvjson')
const readFile = require('fs').readFile
const writeFile = require('fs').writeFile

readFile(`./${args[2]}`, 'utf-8', (err, fileContent) => {
  if (err) throw err

  const csvData = csvjson.toCSV(fileContent, {
    headers: 'key'
  })

  writeFile(`./${args[2].replace('.json', '.csv')}`, csvData, (err) => {
    if (err) throw err
    console.log('Success!')
  })
})
