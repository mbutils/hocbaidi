import { Routes, Route } from 'react-router-dom';

import Layout from "./app/pages/layout/Layout";
import Calendar from "./app/pages/calendar/Calendar";
import Exam from "./app/pages/exam/Exam";

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout/>}>
        <Route index element={<Exam/>}></Route>
        <Route path='/calendar' element={<Calendar/>}></Route>
      </Route>
    </Routes>
  );
}

export default App;
