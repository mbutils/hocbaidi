import React, { useState, useEffect } from 'react'; 
import { Radio, Button, Checkbox } from 'antd'; 

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
           <div className="question" style={{whiteSpace: "pre-wrap"}}>
               <span className="fw-b">Câu {question.quesNum + 1}: </span>
               {question.question}
           </div> 
           {isEnd ? ( 
               <div className='answer-correct'> 
                   Đáp án:
                   {question.answerTxt.map(a => (
                       <pre><i>{a}</i></pre>
                   ))}
               </div> 
           ) : null} 

           {question.isMulti ? (
               <Checkbox.Group
                   name={'questionGroup' + question.quesNum}
                   style={{
                       display: 'flex',
                       flexDirection: 'column',
                       gap: 8,
                   }}
                   value={curAnswer}
                   onChange={(checkedValues) => changeAnswer(question.quesNum, checkedValues)}
                   disabled={timeout || isEnd}
               >
                   {question.options.map((option) => (
                       <Checkbox key={option.value} value={option.value}>
                           <span style={{ whiteSpace: 'pre-line' }}>{option.label}</span>
                       </Checkbox>
                   ))}
               </Checkbox.Group>
           ) : null}

           {!question.isMulti ? (
               <Radio.Group 
                   name={'questionGroup' + question.quesNum} 
                   style={{ 
                       display: 'flex', 
                       flexDirection: 'column', 
                       gap: 8, 
                   }} 
                   onChange={(e) => changeAnswer(question.quesNum, e.target.value)} 
                   value={curAnswer} 
                   // options={question.options} 
                   disabled={timeout || isEnd} 
               >
                   {question.options.map((opt, idx) => (
                       <Radio key={idx}
                           value={opt.value ?? idx}
                           style={{ whiteSpace: 'pre-wrap', alignItems: 'flex-start' }}
                       >
                           {opt.label}
                       </Radio>
                   ))}
               </Radio.Group> 
           ) : null}
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