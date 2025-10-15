// Hàm parse text thành JSON 
export function parseQuestions(text, limit) { 
    const blocks = text.split("/qb ").map(b => b.trim()).filter(Boolean); 

    const read = blocks.map((block, index) => { 
        const lines = block.split("\n").map(l => l.trim()).filter(Boolean); 
        let questionText = null;
        let isQuestion = true;
        let isMulti = false;

        const options = []; 
        const answerTxt = []; 
        const answerVal = []; 
        let opTextTemp = null;
        let isAnsTemp = false;
        let optionNum = 0;

        for (let i = 0; i < lines.length; i++) { 
            const line = lines[i]; 
            if (line.startsWith("/o ")) {
                isQuestion = false;
            } else if (line.startsWith("/qe")) {
                continue;
            }

            if (isQuestion) {
                if (!questionText) {
                    questionText = line;
                    isMulti = line ? line.indexOf("/multi ") > -1 : false;
                } else {
                    questionText = questionText + "\n" + line;
                }
            } else {
                // text option
                if (line.startsWith("/o ")) {
                    isAnsTemp = line.includes("/a ");
                    opTextTemp = line.replace("/o ", "").replace("/a ", "").trim();
                } else {
                    opTextTemp = opTextTemp + "\n" + line.trim();
                }
                // finish text option
                if (lines[i + 1].startsWith("/o ") || lines[i + 1].startsWith("/qe")) {
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
            question: questionText ? questionText.replace("/multi ", "").trim() : questionText, 
            options: shuffle(options), 
            answerTxt: answerTxt, 
            answerVal: answerVal,
            isMulti: isMulti,
        }; 
    }); 
    return shuffleQuestions(read).slice(0, limit); 
} 

function shuffle(array) { 
    let arr = [...array]; // copy để tránh mutate 
    for (let i = arr.length - 1; i > 0; i--) { 
        const j = Math.floor(Math.random() * (i + 1)); 
        [arr[i], arr[j]] = [arr[j], arr[i]]; 
    } 
    return arr; 
}

export function shuffleQuestions(array, limit) {
    var shuffled = shuffle(array).map((q, index) => ({ 
        ...q, 
        quesNum: index 
    }));
    if (limit) {
        return shuffled.slice(0, limit);
    } else {
        return shuffled;
    }
}

export const EXAM_SET = [
    { value: 0, label: "Đề gây mê TA (140 câu)", file: "quiz_ta.txt" },
    { value: 1, label: "Đề chuyên môn 2025 (263 câu)", file: "quiz_chuyenmon2025.txt" },
    { value: 2, label: "Đề chức danh 2024 (119 câu)", file: "quiz_chucdanh2024.txt" },
    { value: 3, label: "Đề 1688 + ESG 2025 (128 câu)", file: "quiz_1688.txt" },
    { value: 4, label: "Đề tổng hợp CV 2025 (255 câu)", file: "quiz_tonghop_cv.txt" },
];