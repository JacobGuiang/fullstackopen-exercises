const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }

  const notificationStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  return (
    <div className='notification' style={notificationStyle}>
      {notification}
    </div>
  )
}

export default Notification