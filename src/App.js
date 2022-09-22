
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import AddVacationForm from './components/AddVacationForm/AddVacationForm';
import EditPayForm from './components/EditPayForm/EditPayForm';
import NavBar from './components/NavBar/NavBar';
import UserList from './components/UserList/UserList';
function App() {
  return (
    <div className='container'>
      <BrowserRouter>
        <NavBar/>
        <Routes>
          <Route path='/' element={<UserList />} />
          <Route path='user/:userId/pay' element={<EditPayForm />} />
          <Route path='user/:userId/vacations' element={<AddVacationForm />} />
        </Routes>
      </BrowserRouter>

    </div>
 

  );
}

export default App;
