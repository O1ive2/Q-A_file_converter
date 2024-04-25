const mammoth = require("mammoth");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const csvWriter = createCsvWriter({
  path: "repo/飞书qa2.csv",
  header: [
    { id: "question", title: "QUESTION" },
    { id: "answer", title: "ANSWER" },
  ],
});

mammoth
  .extractRawText({ path: "repo/飞书qa2.docx" })
  .then(function (result) {
    const text = result.value; // The raw text
    const lines = text.split("\n");
    const data = [];
    let question = "";
    let answer = "";
    let isAnswer = false;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("Q:")) {
        if (question && answer) {
          data.push({ question, answer });
        }
        question = lines[i].substring(2).trim();
        isAnswer = false;
      } else if (lines[i].startsWith("A:")) {
        answer = lines[i].substring(2).trim();
        isAnswer = true;
      } else if (isAnswer) {
        answer += " " + lines[i].trim();
      } else {
        question += " " + lines[i].trim();
      }
    }

    if (question && answer) {
      data.push({ question, answer });
    }

    csvWriter.writeRecords(data).then(() => {
      console.log("...Done");
    });
  })
  .done();
