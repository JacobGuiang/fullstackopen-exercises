import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import phonebookService from './services/phonebook'
 
const App = () => {
  const [persons, setPersons] = useState([])
  const [filter, setFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    phonebookService
      .getAll()
      .then(initialPersons =>
        setPersons(initialPersons))
  }, [])

  const showMessage = (messageToShow) => {
    setNotification(messageToShow)
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const newPerson = {
      name: newName,
      number: newNumber,
    }

    setNewName('')
    setNewNumber('')
    
    const personFound = persons.find(person => person.name === newName)

    if(personFound) {
      if(window.confirm(`${newName} is already in the phonebook. Replace the old number with a new one?`)) {
        const personObject = {
          ...personFound,
          number: newNumber,
        }

        phonebookService
          .update(personObject.id, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id === personObject.id ? personObject : person))
            showMessage(`Updated ${personObject.name}`)
          })
      }
      return
    }

    phonebookService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        showMessage(`Added ${newPerson.name}`)
      })
      .catch(err => {
        console.log(err.response.data.error)
        showMessage('error')
      })
  }

  const deletePerson = (id) => {
    const personToDelete = persons.find(person => person.id === id)
    if(window.confirm(`Delete ${personToDelete.name}?`)) {
      phonebookService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          showMessage(`Deleted ${personToDelete.name}`)
        })
    }
  }

  const personsToShow = filter
  ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
  : persons

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification notification={notification} />

      <Filter
        filter={filter}
        handleChange={event => setFilter(event.target.value)}
      />

      <h3>Add a new</h3>

      <PersonForm
        handleSubmit={addPerson}
        newName={newName}
        handleNameChange={event => setNewName(event.target.value)}
        newNumber={newNumber}
        handleNumberChange={event => setNewNumber(event.target.value)}
      />

      <h3>numbers</h3>

      <Persons persons={personsToShow} handleDelete={deletePerson} />
    </div>
  )
}

export default App