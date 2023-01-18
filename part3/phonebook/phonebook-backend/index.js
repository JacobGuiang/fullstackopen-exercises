require('dotenv').config();
const express = require('express');

const app = express();
const cors = require('cors');
const Person = require('./models/person');

app.use(express.static('build'));
app.use(express.json());
app.use(cors());

app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then((numPersons) => {
      res.send(
        `<p>Phonebook has info for ${numPersons} people</p>`
        + `<p>${Date()}</p>`,
      );
    })
    .catch((err) => next(err));
});

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons);
    })
    .catch((err) => next(err));
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      res.json(person);
    })
    .catch((err) => next(err));
});

app.post('/api/persons', (req, res, next) => {
  const { body } = req;

  if (body.name === undefined) {
    return res.status(400).json({ error: 'name missing' });
  }
  if (body.number === undefined) {
    return res.status(400).json({ error: 'number missing' });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  return person.save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((err) => next(err));
});

app.put('/api/persons/:id', (req, res, next) => {
  const { body } = req;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(
    req.params.id,
    person,
    { new: true, runValidators: true, context: 'query' },
  )
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((err) => next(err));
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => next(err));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  return next(err);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
