import Queue from 'bull'
import es from '../init/es.js'

const queue = new Queue('syncES', {
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        username: process.env.REDIS_USER,
        password: process.env.REDIS_PASS
    }
})

queue.process(async (job, done) => {
    try {
        const { index, id, body, operation } = job.data
        console.log("[JOB CALLED]", job.data)
        if (operation === 'create') {
            await es.index({
                index: index,
                id: id,
                document: body
            })
        } else if (operation === 'update') {
            const res = await es.update({
                index: index,
                id: id,
                script: {
                    source: 'ctx._source = params.body',
                    params: {
                        body: body
                    },
                    lang: 'painless'
                }
            })
            console.log(res)
        } else if (operation === 'delete') {
            await es.delete({
                index: index,
                id: id
            })
        }
        done()
    } catch (error) {
        console.log(error)
        done(error)
    }
})

export default queue