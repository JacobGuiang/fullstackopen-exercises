const express = require('express');
const router = express.Router();

const configs = require('../util/config')

const {getAsync, setAsync} = require('../redis')

let visits = 0

/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits
  });
});

router.get('/statistics', async (req, res) => {
  let numTodos = await getAsync('added_todos')
  if(numTodos === null) {
    await setAsync('added_todos', '0')
    numTodos = 0
  }

  res.send({
    'added_todos': numTodos
  });
})

module.exports = router;
