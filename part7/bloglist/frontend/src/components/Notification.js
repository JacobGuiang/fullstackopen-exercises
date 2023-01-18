import { useSelector } from 'react-redux';

function Notification() {
  const notification = useSelector((state) => state.notification);
  if (notification === null) {
    return null;
  }

  const { message } = notification;

  return (
    <div className="text-5xl absolute bottom-5 right-5 bg-black text-white w-fit rounded-lg p-5">
      {message}
    </div>
  );
}

export default Notification;
