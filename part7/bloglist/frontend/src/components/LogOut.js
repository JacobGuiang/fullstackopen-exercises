import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../reducers/userReducer';
import { setNotification } from '../reducers/notificationReducer';

function LogOut() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = (event) => {
    event.preventDefault();
    dispatch(logoutUser());
    dispatch(setNotification('goodbye'));
    navigate('/');
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="w-fit bg-black p-5 rounded-xl"
    >
      logout
    </button>
  );
}

export default LogOut;
