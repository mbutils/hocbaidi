import React, { useState, useEffect } from 'react';
import { Modal, Button, Row } from 'antd';

import "../../styles/Exam.scss";
import QuestionDetail from "./QuestionDetail";
import {parseQuestions} from "../../utils/examUtils";

const Exam = () => {
    const [questions, setQuestions] = useState([]);
    const [userAnswer, setUserAnswers] = useState({});
    const [result, setResult] = useState(0);
    const [curQuestion, setCurQuestion] = useState(0);
    const [view, setView] = useState("start"); // start, intime, end
    const [maxQuesNum, setMaxQuesNum] = useState(50);
    const [time, setTime] = useState(60); //minute
    const [openConfirmModel, setOpenConfirmModel] = useState(false);
    const [isEnd, setIsEnd] = useState(false);
    const [modal, contextHolder] = Modal.useModal();
    const [resultImg, setResultImg] = useState("");

    const onChange = (quesNum, value) => {
        setUserAnswers({
            ...userAnswer,
            // [quesNum]: e.target.value
            [quesNum]: value
        });
    };

    const startExam = () => {
        fetch("/resource/cauhoi_converted.txt")
        .then(res => res.text())
        .then(text => {
            const parsed = parseQuestions(text, maxQuesNum);
            console.log("question: ", parsed);
            setQuestions(parsed);

            // open question view
            setUserAnswers({});
            setResult({});
            setView("intime");
            setCurQuestion(0);
        });
    }

    const reset = () => {
        setQuestions({});
        setView("start");
        setCurQuestion(0);
        setUserAnswers({});
        setResult({});
        setIsEnd(false);
    }

    const submit = () => {
        setIsEnd(true);

        const countCorrect = questions.filter(question => userAnswer[question.quesNum] === question.answerOp).length;
        setResult(countCorrect);
        getRandomImage();
    }

    const getRandomImage = () => {
        const totalImages = 5;
        const randomIndex = Math.floor(Math.random() * totalImages) + 1;
        const imgType = result/questions.length >= 8 ? 'highscore' : 'lowscore';
        setResultImg(`/resource/${imgType}/${randomIndex}.png`);
    };

    return (
        <div className='exam-container'>
            {view === "start" ? (
                <div className='start-view'>
                    <div className='title'>Thi thử</div>
                    <div className='mb-4'>Số câu hỏi: {maxQuesNum}</div>
                    <div className=''>Thời gian: {time} phút</div>
                    <Button type='primary' className='btn-start'
                        onClick={startExam}
                    >Bắt đầu</Button>
                </div>
            ) : null}

            {view === "intime" ? (
                <div className='intime-view'>
                    <QuestionDetail
                        question={questions[curQuestion]}
                        curAnswer={userAnswer[curQuestion]}
                        changeAnswer={onChange}
                        curQuestion={curQuestion}
                        nextPage={(p) => setCurQuestion(curQuestion + p)}
                        maxQuesNum={questions.length}
                        time={time}
                        isEnd={isEnd}
                        onTimeOut={() => {
                            modal.info({
                                title: 'Kết thúc',
                                content: (
                                    <p>Hết giờ, xin mời nộp bài.</p>
                                ),
                                onOk() {
                                    submit();
                                },
                            });
                        }}
                    />

                    {isEnd ? (
                        <div className='result'>
                            <p className='m-0'>Kết quả: {result}/{questions.length}</p>
                            <p className='m-0 score'>Điểm {result/questions.length}</p>
                            <img src={resultImg}
                                style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }}
                            />
                        </div>
                    ) : null}

                    <Row className='overview-question'>
                        {questions.map((question) => (
                            <div className={`question-status 
                                ${!isEnd && userAnswer[question.quesNum] !== undefined ? 'answered ' : ''}
                                ${curQuestion === question.quesNum ? 'active ' : ''}
                                ${isEnd && userAnswer[question.quesNum] === question.answerOp ? 'correct ' : ''}
                                ${isEnd && userAnswer[question.quesNum] !== question.answerOp ? 'incorrect ' : ''}
                            `}
                                onClick={() => setCurQuestion(question.quesNum)}
                            >
                                {question.quesNum + 1}
                            </div>
                        ))}
                    </Row>

                    {!isEnd ? (
                        <Button type='primary'
                            className='mt-4'
                            onClick={() => setOpenConfirmModel(true)}
                        >Nộp bài</Button>
                    ) : (
                        <Button
                            className='mt-4'
                            onClick={reset}
                        >Quay về</Button>
                    )}
                    
                </div>
            ) : null}
            
            {contextHolder}
            <Modal
                title="Xác nhận kết thúc?"
                open={openConfirmModel}
                onOk={() => {
                    submit();
                    setOpenConfirmModel(false);
                }}
                centered
                onCancel={() => setOpenConfirmModel(false)}
            >
                <p>Số câu đã làm: {Object.keys(userAnswer).length}/{questions.length}</p>
            </Modal>
        </div>
    )
}

export default Exam;