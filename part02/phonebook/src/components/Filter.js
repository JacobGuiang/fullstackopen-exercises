const Filter = ({ filter, handleChange }) => {
  return (
    <div>filter
      <input value={filter} onChange={handleChange} />
    </div>
  )
}

export default Filter