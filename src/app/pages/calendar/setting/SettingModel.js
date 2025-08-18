import { useState, useEffect } from 'react';
import { DatePicker, ColorPicker, Modal, Row, Col, Button, InputNumber } from 'antd';
import dayjs from 'dayjs';
import { DeleteOutlined } from '@ant-design/icons';

const SettingModel = (props) => {
    const { isModalOpen, handleCancel, handleConfirm, scrSize } = props;
    const [formData, setFormData] = useState({
        tuaNum: 5,
        em: '',
        other1: '',
        other2: '',
        other3: '',
    });
    const defaultColor = {
        em: '#e67376',
        other1: '#1677ff',
        other2: '#fff64c',
        other3: '#53ef62',
    };

    useEffect(() => {
        const savedData = localStorage.getItem('ngayTrucSetting');
        if (savedData) {
            setFormData(JSON.parse(savedData));
        }
    }, [isModalOpen]);

    const handleOk = () => {
        localStorage.setItem('ngayTrucSetting', JSON.stringify(formData));
        handleConfirm(formData);
    };
    const onChangeDate = (prop, date) => {
        setFormData({
            ...formData,
            [prop]: {
                ...formData[prop],
                date: date ? date.format('YYYY-MM-DD') : '',
                dayOfMonth: date ? date.date() : '',
                month: date ? date.month() : '',
            }
        });
    };

    const onChangeTua = (num) => {
        setFormData({
            ...formData,
            tuaNum: num ? num : 5
        });
    };

    function getDateString(date) {
        return date ? dayjs(date) : undefined;
    }
    
    return (
        <Modal
            title="Chọn ngày trực gần nhất"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            centered
        >
                <Row className='mb-3'>
                    <Col span={scrSize === 'xs' ? 6 : 8}><label className='mr-4'>Ngày tua:</label></Col>
                    <Col span={scrSize === 'xs' ? 18 : 16}>
                        <InputNumber min={1} max={30} defaultValue={5}
                            value={formData?.tuaNum}
                            onChange={num => onChangeTua(num)} />
                    </Col>
                </Row>

                <Row className='mb-3'>
                    <Col span={scrSize === 'xs' ? 6 : 8}><label className='mr-4'>Của em:</label></Col>
                    <Col span={scrSize === 'xs' ? 18 : 16}>
                        <Row>
                            <DatePicker
                                value={getDateString(formData?.em?.date)} 
                                onChange={date => onChangeDate('em', date)} />
                            <ColorPicker defaultValue={defaultColor.em} disabled
                                className='ml-2'
                            />
                            <Button danger icon={<DeleteOutlined />}
                                className='ml-2'
                                onClick={() => onChangeDate('em', null)}
                            ></Button>
                        </Row>
                    </Col>
                </Row>

                {[1, 2, 3].map((num) => (
                    <Row className='mb-3'>
                        <Col span={scrSize === 'xs' ? 6 : 8}><label className='mr-4'>{scrSize === 'xs' ? 'Khác' : 'Người khác'} {num}:</label></Col>
                        <Col span={scrSize === 'xs' ? 18 : 16}>
                            <Row>
                                <DatePicker 
                                    value={getDateString(formData[`other${num}`]?.date)} 
                                    onChange={date => onChangeDate(`other${num}`, date)} />
                                <ColorPicker defaultValue={defaultColor[`other${num}`]}
                                    className='ml-2'
                                    disabled
                                />
                                <Button danger icon={<DeleteOutlined />}
                                    className='ml-2'
                                    onClick={() => onChangeDate(`other${num}`, null)}
                                ></Button>
                            </Row>
                        </Col>
                    </Row>
                ))}
        </Modal>
    );
}

export default SettingModel;