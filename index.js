import express from "express"

const app = express()

app.get('/', (req, res) => {
	res.json('test ok')
})

app.listen(5000)