// Hàm parse text thành JSON
export function parseQuestions(text, limit) {
    const blocks = text.split("/qb").map(b => b.trim()).filter(Boolean);

    const read = blocks.map((block, index) => {
        const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
        const questionText = lines[0]; // dòng đầu tiên sau /qb là câu hỏi
        const options = [];
        let answer = null;
        let answerOp = null;

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            if (lines[i] === "/qe" || !line.startsWith("/o")) continue;
            const text = line.replace("/o", "").replace("/a", "").trim();
            const isAns = line.includes("/a");
            if (isAns) {
                answer = text;
                answerOp = i;
            }
            options.push({ value: i, label: text, isCorrect: isAns });
        }
        return {
            quesNum: index,
            question: questionText,
            options: shuffle(options),
            answer,
            answerOp
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