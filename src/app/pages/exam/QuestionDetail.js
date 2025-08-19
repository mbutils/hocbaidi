import React, { useState, useEffect } from 'react';
import { Radio, Button } from 'antd';

const QuestionDetail = (props) => {
    const { question, changeAnswer, curAnswer, nextPage, maxQuesNum, time, isEnd, onTimeOut } = props;
    const [timeTx, setTimeTx] = useState("");
    const [timeout, setTimeout] = useState(false);

    useEffect(() => {
        var timeVal = time * 60;
        // var timeVal = 6;
        const countdown = setInterval(() => {
            timeVal--;
            if (timeVal === 0) {
                setTimeTx("0 phút 0 giây");
                if (!isEnd) {
                    onTimeOut();
                }
                setTimeout(true);
                clearInterval(countdown);
            }

            const min = parseInt(timeVal / 60);
            const sec = timeVal % 60;
            setTimeTx(min + " phút " + sec + " giây");
        }, 1000);

        return () => {
            clearInterval(countdown);
        };
    }, []);

    return (
        <>
        <div className='question-detail'>
            <p className="question"><span className="fw-b">
                Câu {question.quesNum + 1}: </span>{question.question}
            </p>
            {isEnd ? (
                <div className='answer-correct'>
                    <p>Đáp án: <i>{question.answer}</i></p>
                </div>
            ) : null}
            <Radio.Group
                name={'questionGroup' + question.quesNum}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                }}
                onChange={(e) => changeAnswer(question.quesNum, e.target.value)}
                value={curAnswer}
                options={question.options}
                disabled={timeout || isEnd}
            />
            
        </div>
        <div className='nav-question-btn'>
            <Button className='mr-4'
                onClick={() => nextPage(-1)}
                disabled={question.quesNum <= 0}
            >Trước</Button>
            <Button
                onClick={() => nextPage(1)}
                disabled={question.quesNum >= maxQuesNum - 1}
            >Sau</Button>
        </div>

        {!timeout && !isEnd ? (<>
            <div className='mt-5'>Thời gian: {timeTx}</div>
            <div className='mt-1 fs-12 note'>Lưu ý không tải lại trang</div>
        </>): null}
        </>
    )
} 

export default QuestionDetail;