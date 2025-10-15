
import { Modal, InputNumber, Checkbox, Row, Col } from "antd";
import { useEffect, useState } from "react";

import {EXAM_SET} from "../../utils/examUtils"; 

const SetupExam = (props) => {
    const { isOpen, defaultVal, onConfirm, onCancel } = props;
    const [maxQuesNum, setMaxQuesNum] = useState(); 
    const [time, setTime] = useState(); //minute
    const [selectExam, setSelectExam] = useState(null);
    const [ratioExam, setRatioExam] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setMaxQuesNum(defaultVal.maxQuesNum);
            setTime(defaultVal.time);
            setSelectExam(defaultVal.selectExam);
            setRatioExam(defaultVal.ratioExam);
        }
    }, [isOpen, defaultVal]);

    function onOk() {
        onConfirm({
            maxQuesNum,
            time,
            selectExam,
            ratioExam
        });
    }

    return (
        <>
            <Modal 
                title="Cài đặt" 
                open={isOpen} 
                onOk={onOk} 
                centered 
                onCancel={onCancel} 
            > 
                <Row>
                    <Col span={6}>Số câu:</Col>
                    <Col><InputNumber value={maxQuesNum} onChange={setMaxQuesNum} /></Col>
                </Row>
                <Row className='mt-3'>
                    <Col span={6}>Thời gian:</Col>
                    <Col><InputNumber value={time} onChange={setTime} /> phút</Col>
                </Row>
                <Row className='mt-3'>
                    <Col span={6}>Chọn bộ đề:</Col>
                    <Col>
                        <Checkbox.Group
                            name={'examSetSelect'}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 8,
                            }}
                            value={selectExam}
                            onChange={setSelectExam}
                        >
                            {selectExam ? EXAM_SET.map((a) => (
                                <Checkbox key={a.value} value={a.value}>
                                    <InputNumber value={ratioExam[a.value]}
                                        suffix="%" disabled={!selectExam.includes(a.value)}
                                        onChange={val => setRatioExam({
                                            ...ratioExam,
                                            [a.value]: val
                                        })}
                                    />
                                    <span>{a.label}</span>
                                </Checkbox>
                            )) : null}
                        </Checkbox.Group>
                    </Col>
                </Row>
            </Modal> 
        </>
    )
}

export default SetupExam;