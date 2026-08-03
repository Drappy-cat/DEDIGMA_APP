const fs = require('fs');
const path = require('path');

function parseFile(inputFile, outputFile, variableName) {
  let content = fs.readFileSync(inputFile, 'utf8');
  content = content.replace(/\r\n?/g, '\n');

  const answerKeyMatch = content.match(/Kunci Jawaban.*/i);
  let answerText = '';
  let questionText = content;
  if (answerKeyMatch) {
    answerText = content.substring(answerKeyMatch.index);
    questionText = content.substring(0, answerKeyMatch.index);
  }

  const answerMap = {};
  const answerRegex = /(\d+)\s*\.\s*([A-D])/g;
  let m;
  while ((m = answerRegex.exec(answerText)) !== null) {
    const qNum = parseInt(m[1], 10);
    const ansIdx = m[2].charCodeAt(0) - 65; 
    answerMap[qNum] = ansIdx;
  }

  const questions = [];
  const parts = questionText.split(/(?=\b\d+\s*\.\s)/g);

  for (const part of parts) {
    const qMatch = part.match(/^(\d+)\s*\.\s*([\s\S]+?)(?=\bA\s*\.\s)/);
    if (!qMatch) continue;
    
    const id = parseInt(qMatch[1], 10);
    const soal = qMatch[2].trim();

    const optionsText = part.substring(qMatch[0].length - 1); 
    
    const opsiA = optionsText.match(/A\s*\.\s*([\s\S]+?)(?=\bB\s*\.\s|$)/)?.[1]?.trim();
    const opsiB = optionsText.match(/B\s*\.\s*([\s\S]+?)(?=\bC\s*\.\s|$)/)?.[1]?.trim();
    const opsiC = optionsText.match(/C\s*\.\s*([\s\S]+?)(?=\bD\s*\.\s|$)/)?.[1]?.trim();
    const opsiD = optionsText.match(/D\s*\.\s*([\s\S]+?)$/)?.[1]?.trim();

    if (opsiA && opsiB && opsiC && opsiD) {
      questions.push({
        id,
        soal,
        opsi: [opsiA, opsiB, opsiC, opsiD],
        jawaban: answerMap[id] !== undefined ? answerMap[id] : 0
      });
    } else {
      console.log(`Failed to parse options for question ${id} in ${inputFile}`);
    }
  }

  const tsCode = `import { Question } from "../types";\n\nexport const ${variableName}: Question[] = ${JSON.stringify(questions, null, 2)};\n`;
  fs.writeFileSync(outputFile, tsCode, 'utf8');
  console.log(`Successfully parsed ${questions.length} questions to ${outputFile}`);
}

const basePath = path.join(__dirname, 'public', 'assets', 'soal');
const outPath = path.join(__dirname, 'src', 'app', 'data');

if (!fs.existsSync(outPath)) {
  fs.mkdirSync(outPath, { recursive: true });
}

parseFile(
  path.join(basePath, 'SOAL JAWABAN PRE-TEST.txt'),
  path.join(outPath, 'pretestQuestions.ts'),
  'PRETEST_QUESTIONS'
);

parseFile(
  path.join(basePath, 'SOAL JAWABAN POST-TEST.txt'),
  path.join(outPath, 'posttestQuestions.ts'),
  'POSTTEST_QUESTIONS'
);
