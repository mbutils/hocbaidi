import { useEffect, useState } from "react";
import { Row, Button, Modal } from "antd";

import QuestionDetail from "./QuestionDetail"; 

const ExamInProgress = (props) => {
    const {questions, time, onBack} = props;
    const [openConfirmModel, setOpenConfirmModel] = useState(false); 
    const [openTimeoutModel, setOpenTimeoutModel] = useState(false); 
    const [userAnswer, setUserAnswers] = useState({}); 
    const [curQuestion, setCurQuestion] = useState(0); 
    const [resultImg, setResultImg] = useState(""); 
    const [result, setResult] = useState(0); 
    const [isEnd, setIsEnd] = useState(false); 

    useEffect(() => {
        reset();
    }, [questions]);

    const reset = () => { 
        setCurQuestion(0); 
        setUserAnswers({}); 
        setResult(0); 
        setIsEnd(false); 
    } 

    const onChange = (quesNum, value) => { 
        setUserAnswers({ 
            ...userAnswer, 
            [quesNum]: value
        }); 
    }; 

    const submit = () => { 
        setIsEnd(true); 

        const countCorrect = questions.filter(question => isCorrectAnswer(question)).length; 
        setResult(countCorrect); 
        getRandomImage(countCorrect); 
    } 

    const isCorrectAnswer = (question) => {
        const answer = userAnswer[question.quesNum];
        if (answer === undefined) {
            return false;
        }
        if (question.isMulti) {
            return JSON.stringify(question.answerVal.sort()) === JSON.stringify(answer.sort());
        } else {
            return question.answerVal[0] === answer;
        }
    }

    const getRandomImage = (result) => { 
        const totalImages = 5; 
        const randomIndex = Math.floor(Math.random() * totalImages) + 1; 
        const imgType = (result/questions.length*10) >= 8 ? 'highscore' : 'lowscore'; 
        setResultImg(`/resource/${imgType}/${randomIndex}.png`); 
    }; 

    return(
        <>
            <div className='intime-view'> 
                <QuestionDetail 
                    question={questions[curQuestion]} 
                    curAnswer={userAnswer[curQuestion]} 
                    changeAnswer={onChange} 
                    nextPage={(p) => setCurQuestion(curQuestion + p)} 
                    maxQuesNum={questions.length} 
                    time={time} 
                    isEnd={isEnd} 
                    onTimeOut={() => { 
                        setOpenTimeoutModel(true);
                    }} 
                /> 

                {isEnd ? ( 
                    <div className='result'> 
                        <p className='m-0'>Kết quả: {result}/{questions.length}</p> 
                        <p className='m-0 score'>Điểm {result/questions.length*10}</p> 
                        <img src={resultImg} 
                            style={{ width: '100%', maxHeight: '40vh', objectFit: 'contain' }} 
                        /> 
                    </div> 
                ) : null} 

                <Row className='overview-question'> 
                    {questions.map((question) => ( 
                        <div className={`question-status 
                            ${!isEnd && userAnswer[question.quesNum] !== undefined ? 'answered ' : ''} 
                            ${curQuestion === question.quesNum ? 'active ' : ''} 
                            ${isEnd && isCorrectAnswer(question) ? 'correct ' : ''} 
                            ${isEnd && !isCorrectAnswer(question) ? 'incorrect ' : ''} 
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
                        onClick={onBack} 
                    >Quay về</Button> 
                )} 
            </div> 

            <Modal 
                title="Kết thúc" 
                open={openTimeoutModel} 
                closable={false}
                // onOk={() => { 
                //     submit(); 
                //     setOpenTimeoutModel(false); 
                // }} 
                centered 
                footer={[
                    <Button key="ok" type="primary" onClick={() => { 
                        submit(); 
                        setOpenTimeoutModel(false); 
                    }}>OK</Button>,
                ]}
            > 
                <p>Hết giờ, xin mời nộp bài.</p> 
            </Modal>

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
        </>
    )
}

export default ExamInProgress;