import { useState, useEffect } from 'react';

import MonthView from "./month/MonthView";
import SettingModel from "./setting/SettingModel";
import GiftModal from "./gift/GiftModal";
import { CAL_VIEW_MODE } from "../../models/Constants";
import "../../styles/Calendar.scss";
import {ReactComponent as SettingIcon} from '../../../assets/imgs/settings-cute-svgrepo-com.svg';
import {ReactComponent as SettingIconSm} from '../../../assets/imgs/settings-cute-svgrepo-com-small.svg';
import {ReactComponent as ArrowPrevIcon} from '../../../assets/imgs/arrow-prev-svgrepo-com.svg';
import {ReactComponent as ArrowPrevIconSm} from '../../../assets/imgs/arrow-prev-svgrepo-com-small.svg';
import {ReactComponent as ArrowNextIcon} from '../../../assets/imgs/arrow-next-svgrepo-com.svg';
import {ReactComponent as ArrowNextIconSm} from '../../../assets/imgs/arrow-next-svgrepo-com-small.svg';
import {ReactComponent as ReloadIcon} from '../../../assets/imgs/refresh-alt-svgrepo-com.svg';
import {ReactComponent as ReloadIconSm} from '../../../assets/imgs/refresh-alt-svgrepo-com-small.svg';
import {ReactComponent as GiftIcon} from '../../../assets/imgs/gift-icon-stroke-pink-by-Vexels.svg';
import {ReactComponent as GiftIconSm} from '../../../assets/imgs/gift-icon-stroke-pink-by-Vexels-small.svg';
import {ReactComponent as BackIcon} from '../../../assets/imgs/left-arrow-back-svgrepo-com.svg';
import {ReactComponent as BackIconSm} from '../../../assets/imgs/left-arrow-back-svgrepo-com-small.svg';

const Calendar = () => {
    const [selectYear, setSelectYear] = useState(new Date().getFullYear());
    const [selectMonth, setSelectMonth] = useState(1);
    const [viewMode, setVewMode] = useState(CAL_VIEW_MODE.year);
    const [monthOfLine, setMonthOfLine] = useState(2);
    const [scrSize, setScrSize] = useState('sm'); //  xs, sm, md, lg
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [giftOpen, setGiftOpen] = useState(false);
    const [settingData, setSettingData] = useState({});

    function handleWindowSizeChange() {
        let screenWidth = window.innerWidth;
        if (screenWidth < 410) {
            setScrSize('xs');
            setMonthOfLine(2);
        } else if (screenWidth <= 768) {
            setScrSize('sm');
            setMonthOfLine(2);
        } else if (screenWidth <= 970) {
            setScrSize('md');
            setMonthOfLine(3);
        } else {
            setScrSize('lg');
            setMonthOfLine(4);
        }
    }

    useEffect(() => {
        reload(false);
        handleWindowSizeChange();
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    function renderMonthView() {
        const renderedAll = [];
        for (let line = 0; line < 12/monthOfLine; line++) {
            let renderedItems = [];
            for (let month = (line * monthOfLine) + 1; month <= monthOfLine * (line + 1); month++) {
                renderedItems.push(
                    <div className='month-view-block'
                        onClick={() => selectMonthDetail(month)}
                    >
                        <MonthView
                            month={month}
                            year={selectYear}
                            viewMode={viewMode}
                            scrSize={scrSize}
                            settingData={settingData}
                        />
                    </div>
                )
            }
            renderedAll.push(
                <div className='month-view-line'>
                    {renderedItems}
                </div>
            )
        }
        return renderedAll;
    }

    function reload() {
        setSelectYear(new Date().getFullYear());
        setVewMode(CAL_VIEW_MODE.year);
    }

    function selectMonthDetail(month) {
        setVewMode(CAL_VIEW_MODE.month);
        setSelectMonth(month);
    }

    return (
        <div className={`calendar scr-${scrSize}`}>
            <div className={`calendar-header scr-${scrSize}`}>
                <div className='button-left'>
                    {viewMode === CAL_VIEW_MODE.year ? (
                        <button className="my-btn anime-btn-2 btn-md"
                            onClick={() => setGiftOpen(true)}>
                            {scrSize != 'lg' ? <GiftIconSm/> : <GiftIcon/>}
                        </button>
                    ) : (
                        <button className="my-btn anime-btn-2 btn-md"
                            onClick={() => setVewMode(CAL_VIEW_MODE.year)}>
                            {scrSize != 'lg' ? <BackIconSm/> : <BackIcon/>}
                        </button>
                    )}
                </div>
                <div className={`calendar-year scr-${scrSize}`}>
                    <button className="my-btn anime-btn-2 btn-md mr-4"
                        onClick={() => setSelectYear(selectYear - 1)}>
                        {scrSize != 'lg' ? <ArrowPrevIconSm/> : <ArrowPrevIcon/>}
                    </button>
                    {selectYear}
                    <button className="my-btn anime-btn-2 btn-md ml-4"
                        onClick={() => setSelectYear(selectYear + 1)}>
                        {scrSize != 'lg' ? <ArrowNextIconSm/> : <ArrowNextIcon/>}
                    </button>
                </div>
                <div className='button-right'>
                    <button className="my-btn anime-btn-2 btn-md"
                        onClick={() => setIsModalOpen(true)}>
                        {scrSize != 'lg' ? <SettingIconSm/> : <SettingIcon/>}
                    </button>
                    <button className={`my-btn anime-btn-2 btn-md cal-btn-ml`}
                        onClick={() => reload()}>
                        {scrSize != 'lg' ? <ReloadIconSm/> : <ReloadIcon/>}
                    </button>
                </div>
            </div>

            {viewMode === CAL_VIEW_MODE.year ? (
                <div className='calendar-mode__year'>
                    {renderMonthView()}
                </div>
            ) : null}

            {viewMode === CAL_VIEW_MODE.month ? (
                <div className='calendar-mode__month'>
                    <MonthView
                        month={selectMonth}
                        year={selectYear}
                        viewMode={viewMode}
                        scrSize={scrSize}
                        settingData={settingData}
                        setMonth={(m) => setSelectMonth(m)}
                        setYear={(y) => setSelectYear(y)}
                    />
                </div>
            ) : null}

            <SettingModel
                isModalOpen={isModalOpen}
                handleCancel={() => setIsModalOpen(false)}
                handleConfirm={(settingData) => {
                    setSettingData(settingData);
                    setIsModalOpen(false);
                }}
                scrSize={scrSize}
            />
            <GiftModal
                isModalOpen={giftOpen}
                handleCancel={() => setGiftOpen(false)}
            />
        </div>
    )
}

export default Calendar;