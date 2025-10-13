// Hàm parse text thành JSON 
export function parseQuestions(text, limit) { 
   const blocks = text.split("/qb").map(b => b.trim()).filter(Boolean); 

   const read = blocks.map((block, index) => { 
       const lines = block.split("\n").map(l => l.trim()).filter(Boolean); 
       let questionText = null;
       let isQuestion = true;

       const options = []; 
       const answerTxt = []; 
       const answerVal = []; 
       let opTextTemp = null;
       let isAnsTemp = false;
       let optionNum = 0;

       for (let i = 0; i < lines.length; i++) { 
           const line = lines[i]; 
           if (line.startsWith("/o")) {
               isQuestion = false;
           } else if (line.startsWith("/qe")) {
               continue;
           }

           if (isQuestion) {
               questionText = !questionText ? line : questionText + "\n" + line;
           } else {
               // text option
               if (line.startsWith("/o")) {
                   isAnsTemp = line.includes("/a");
                   opTextTemp = line.replace("/o", "").replace("/a", "").trim();
               } else {
                   opTextTemp = opTextTemp + "\n" + line;
               }
               // finish text option
               if (lines[i + 1].startsWith("/o") || lines[i + 1].startsWith("/qe")) {
                   if (isAnsTemp) {
                       answerTxt.push(opTextTemp);
                       answerVal.push(optionNum);
                   }
                   options.push({ value: optionNum, label: opTextTemp, isCorrect: isAnsTemp });

                   // reset text option
                   optionNum++;
               }
           }
       } 
       return { 
           quesNum: index, 
           question: questionText.replace("/multi", "").trim(), 
           options: shuffle(options), 
           answerTxt: answerTxt, 
           answerVal: answerVal,
           isMulti: questionText.indexOf("/multi") > -1,
       }; 
   }); 
   return shuffle(read).map((q, index) => ({ 
       ...q, 
       quesNum: index 
   })).slice(0, limit); 
} 

function shuffle(array) { 
  let arr = [...array]; // copy để tránh mutate 
  for (let i = arr.length - 1; i > 0; i--) { 
      const j = Math.floor(Math.random() * (i + 1)); 
      [arr[i], arr[j]] = [arr[j], arr[i]]; 
  } 
  return arr; 
}