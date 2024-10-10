import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import QuizChooser from './components/QuizChooser';
import Header from './components/layout/Header';
import Quiz from './pages/Quiz';
import { RootState } from './store';
import { useSelector } from 'react-redux';
import Modal from './components/Modal';
import getString from './lib/strings';
import useNetworkStatus from './hooks/useNetworkStatus';
import { useEffect, useRef } from 'react';

function App() {
  const navigate = useNavigate();
  const path = useSelector((state: RootState) => state.layout.currentPath);
  const isMainPage = (path === '/');
  let { isOnline } = useNetworkStatus();
  let wasOffline = useRef(false);
  const containerClasses = isMainPage
    ? "relative flex flex-col border-night-lightest border-2 rounded-md h-[90%] portrait:h-[85%] w-full p-5 pt-0 landscape:overflow-visible portrait:overflow-scroll"
    : "border-night-lightest border-2 rounded-md h-full w-full p-5 mt-10 h-[85vh] portrait:pb-8";
  useEffect(() => {
    if(!isOnline){
      navigate(`${path}?offline`, {replace: true});
      wasOffline.current = true
    }
    if(isOnline && wasOffline.current){
      navigate(path, {replace: true});
      wasOffline.current = false;
    }

  }, [isOnline, navigate, path]);
  return (
    <>
      <Modal current={path} query='offline' text={getString('modal_text_offline')} buttons={[]}/>
      <Modal current={path} query='error' text={getString('modal_text_error')} buttons={[{ text: getString("refresh"), target: "/", callback: null }]}/>
      {isMainPage && <Header/>}
      <div className={containerClasses}>
      
        <Routes>
          <Route path='/' element={<QuizChooser/>}/>
          <Route path='/quiz' element={<Quiz/>}/>
        </Routes>
      </div>
    </>
  );
}
export default App;
