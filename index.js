require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/phonebook')

app.use(express.static('build'))
app.use(express.json())

morgan.token('data', function (req, res) {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data')
)

app.use(cors())

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then((people) => {
    response.json(people)
  })
})

app.get('/info', (request, response) => {
  response.send(
    `<h2>Phonebook has info for ${
      persons.length
    } people</h2><h2>${new Date()}</h2>`
  )
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find((person) => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter((p) => p.id !== id)

  response.status(204).end()
})

const getRandomIntSection = (n, m) => {
  let number1 = Math.random() * (m - n + 1)
  let number2 = Math.floor(number1)
  return number2 + n
}

const generateId = () => {
  return getRandomIntSection(111111, 999999)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing',
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number missing',
    })
  }

  // const found = persons.find((p) => p.name === body.name)

  // if (found) {
  //   return response.status(400).json({
  //     error: 'name must be unique',
  //   })
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then((savePerson) => {
    response.json(person)
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
