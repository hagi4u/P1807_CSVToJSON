const csv = require('csvtojson');
const fs = require('fs');

const csvPath = {
  contents: './csv/contents.csv',
  prompt: './csv/prompt.csv',
  question: './csv/question.csv'
}

// await 
const result = Object.keys(csvPath).map(async (key, index) => {
  return {
    [key]: await csv().fromFile(csvPath[key])
  }
});

const makeCompatibilityData = (raw) => {
  const flattenRaw = raw.reduce((acc, value, index) => {
    acc = {...acc, ...value};
    return acc;
  }, {});

  return flattenRaw.contents.map(item => {
    return {
      ...item,
      prompt: flattenRaw.prompt.filter(prompt => prompt.cid === item.cid && prompt.prompt !== ''),
      question: flattenRaw.question.filter(question => question.cid === item.cid)
    }
  })
}

Promise.all(result).then(res => {
  fs.writeFile('output/scenario.json', JSON.stringify(makeCompatibilityData(res)), err => {
    if (err) throw err;
    console.log('즈장완료')
  })
})