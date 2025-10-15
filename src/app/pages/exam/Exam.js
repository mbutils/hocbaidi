import { useEffect, useState } from 'react'; 
import { Button, Row, Col } from 'antd'; 
import { EditOutlined } from '@ant-design/icons';
import { isMobile } from "react-device-detect";

import "../../styles/Exam copy.css"; 
import ExamInProgress from './ExamInProgress';
import SetupExam from './SetupExam';
import {parseQuestions, shuffleQuestions, EXAM_SET} from "../../utils/examUtils"; 

const Exam = () => { 
    const [questions, setQuestions] = useState([]); 
    const [startView, setStartView] = useState(true);
    const [openSetupModel, setOpenSetupModel] = useState(false);
    const [examSetup, setExamSetup] = useState({
        maxQuesNum: 50,
        time: 40,
        selectExam: [0],
        ratioExam: {0: 100, 1: 80, 2: 20}
    });

    useEffect(() => {
        const setup = localStorage.getItem("examSetup");
        console.log("setup",setup,isMobile);
        if (setup) {
            setExamSetup(JSON.parse(setup));
        }
    }, []);

    const startExam = () => { 
        // fetch("/resource/quiz_chuyenmon2025.txt") 
        // .then(res => res.text()) 
        // .then(text => { 
        //     const parsed = parseQuestions(text, maxQuesNum); 
        //     console.log("question: ", typeof parsed, parsed); 
        //     setQuestions(parsed); 

        //     // open question view 
        //     setStartView(false); 
        // });
        const { maxQuesNum, selectExam, ratioExam } = examSetup;
        var isDone = 0;
        var finalQuestions = [];

        selectExam.map((setId) => {
            const exam = EXAM_SET.find(s => s.value === setId);
            if (!exam) return;

            fetch(`/resource/${exam.file}`) 
            .then(res => res.text()) 
            .then(text => { 
                const numOfQues = ratioExam[setId] / 100 * maxQuesNum;
                const parsed = parseQuestions(text, numOfQues); 
                finalQuestions = finalQuestions.concat(parsed);
                isDone++;

                if (isDone === selectExam.length) {
                    finalQuestions = shuffleQuestions(finalQuestions);
                    console.log("question:", finalQuestions);
                    setQuestions(finalQuestions);

                    // open question view 
                    setStartView(false); 
                }
            });
        });
    }

    return ( 
        <div className='exam-container'> 
            {startView ? ( 
                <div className='start-view'> 
                    <div className='title'>Thi thử</div> 
                    <Button icon={<EditOutlined />} onClick={() => setOpenSetupModel(true)}/>
                    <div className='info-exam'>
                        <Row className='mt-2'>
                            <Col span={isMobile ? 6 : 2} offset={isMobile ? 4 : 10}>Số câu hỏi:</Col>
                            <Col span={12}>{examSetup.maxQuesNum}</Col>
                        </Row>
                        <Row className='mt-2'>
                            <Col span={isMobile ? 6 : 2} offset={isMobile ? 4 : 10}>Thời gian:</Col>
                            <Col span={12}>{examSetup.time} phút</Col>
                        </Row>
                        <Row className='mt-2'>
                            <Col span={isMobile ? 6 : 2} offset={isMobile ? 4 : 10}>Bộ đề thi:</Col>
                            <Col span={12}>
                                {EXAM_SET.map((a) => {
                                    if (!examSetup.selectExam.includes(a.value)) return;
                                    return (
                                    <Row>
                                        <Col span={isMobile ? 4 : 3}>{examSetup.ratioExam[a.value]}%</Col>
                                        <Col>{a.label}</Col>
                                    </Row>
                                )
                                })}
                            </Col>
                        </Row>
                    </div>
                    <Button type='primary' className='btn-start' 
                        onClick={startExam} 
                    >Bắt đầu</Button> 
                </div> 
            ) : null} 

            {!startView ? ( 
                <ExamInProgress
                    questions={questions}
                    time={examSetup.time}
                    onBack={() => setStartView(true)}
                />
            ) : null} 
            
            {openSetupModel ? (
                <SetupExam
                    isOpen={openSetupModel}
                    examSet={EXAM_SET}
                    defaultVal={examSetup}
                    onConfirm={(val) => {
                        setExamSetup(val);
                        localStorage.setItem("examSetup", JSON.stringify(val));
                        setOpenSetupModel(false);
                    }}
                    onCancel={() => setOpenSetupModel(false)}
                />
            ) : null}
        </div> 
    ) 
} 

export default Exam;