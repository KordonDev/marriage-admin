const hummus = require('hummus');

const inputPath = __dirname + '/Kirchenheft.pdf';
const pdfReader = hummus.createReader(inputPath);
const pdfWriter = hummus.createWriter(__dirname + '/printKirchenheft.pdf', { log: './log.txt' });

const inputPages = pdfReader.getPagesCount();
const printOrder = [];
for(i = 0; i < inputPages / 2; i = i + 2) {
    printOrder.push([inputPages - i - 1, inputPages - i - 1]);
    printOrder.push([i, i]);
    printOrder.push([inputPages - i - 2, inputPages - i - 2]);
    printOrder.push([i + 1, i + 1]);
}

console.log(printOrder);
pdfWriter.appendPDFPagesFromPDF(inputPath, { type: hummus.eRangeTypeSpecific, specificRanges: printOrder });

pdfWriter.end()
