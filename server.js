const port = 3000
const StorageInterface = require('./OrderStorageMemory')
const storage = new StorageInterface()
const { app, setStorageInterface } = require('./app')

setStorageInterface(storage)
app.listen(port)
