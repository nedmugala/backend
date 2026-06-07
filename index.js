const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())

app.use(express.json())

let notes =[{
id: "1",
content: "HTML is easy",
important: true
},
{
id: "2",
content: "Browser can execute only JavaScript",
important: false
},
{
id: "3",
content: "GET and POST are the most important methods of HTTP protocol",
important: true
}

]

const idGenerator=()=>{
    let maxId = notes.length > 0? Math.max(...notes.map(n=>Number(n.id))) : 0
    return String(maxId+1)
}

app.post('/api/notes', (request,response)=>{
    const body = request.body
    if(!body.content){
        return response.status(400).json({
            error:'Content Missing'
        })
    }
    
    const note = {
        "id" : idGenerator(),
        "content" : body.content,
        "important" : body.important || false
    }
    axios.post('http:localhost:3001/notes', note).then((res)=>{
    notes.push(res.data)
    console.log(res.data)
    response.json(res.data)
    })
    
    
})

app.get('/', (request, response)=> {
    response.send('<h1> Hello World! </h1>')
})
app.get('/api/notes', (request, response)=>{
    response.json(notes)
})
app.get('/api/notes/:id', (request, response)=>{
    const id = request.params.id
    const note = notes.find((note)=> note.id === id)
    if(note) {
        response.json(note)
    }
    else{
        response.status(404).end()
    }
})
app.put('/api/notes/:id',(request, response)=>{
    console.log(request.body)
    const id = request.params.id
    const note = notes.find(n=> n.id===id)
    note.content = request.body.content
    response.json(note)

})

app.delete('/api/notes/:id', (request, response)=> {
    const id = request.params.id
    notes = notes.filter((note)=> note.id !== id)
    response.status(204).end()
})

const PORT = 3000
app.listen(PORT)
console.log(`server running at port http://localhost:${PORT}`)