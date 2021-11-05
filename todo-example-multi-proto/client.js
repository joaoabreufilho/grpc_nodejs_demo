const path = require('path');
const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader")

const serviceProtoPath = path.resolve(__dirname, './proto/todoService.proto');
const importDSProtoPath = path.resolve(__dirname, './proto/data_structures');
const importEnumProtoPath = path.resolve(__dirname, './proto/enumerations');

// These options help make definitions usable in our code
const protoOptions = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  }

// Get the package definition
const packageDef = protoLoader.loadSync(serviceProtoPath, {
    includeDirs: [importDSProtoPath, importEnumProtoPath],
    protoOptions
});

const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const text = process.argv[2];

// Create an Object of the Todo service
const client = new todoPackage.Todo("localhost:40000",
    grpc.credentials.createInsecure())




const dev1 = todoPackage.IdofDevice.type.value[2];

client.createTodo({
    "id": -1,
    "text": text,
    "devId": "kHost"
}, (err, response) => {

    console.log("Received from server " + JSON.stringify(response))

})

// Send an empty object (could be {}) and it takes back a callback (err,response)
client.readTodos(null, (err, response) => {

    console.log("read the todos from server " + JSON.stringify(response))
    if (typeof response.items !== 'undefined') {
        response.items.forEach(a => console.log(a.text));
    }
})


// Stream is not a callback anymore
// Define a call object
const call = client.readTodosStream();
// Assign events
call.on("data", item => {
    console.log("received item from server " + JSON.stringify(item))
})

call.on("end", e => console.log("server done!"))