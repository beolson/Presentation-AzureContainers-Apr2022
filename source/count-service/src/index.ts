import fastify from 'fastify'

const server = fastify()

var count = 0;

server.post('/count', async (request, reply) => {
  reply
  .code(200)
  .header('Content-Type', 'application/json; charset=utf-8')
  .send({ count: ++count })
})

server.get('/count', async (request, reply) => {
    reply
    .code(200)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send({ count: count })
  })

server.listen(8080, '0.0.0.0', (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})