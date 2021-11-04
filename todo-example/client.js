const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader")

const packageDef = protoLoader.loadSync("todo.proto", {});

const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const text = process.argv[2];

// Create an Object of the Todo service
const client = new todoPackage.Todo("localhost:40000", 
grpc.credentials.createInsecure())


console.log(text)

client.createTodo({
    "id": -1,
    "text": text
}, (err, response) => {

    console.log("Recieved from server " + JSON.stringify(response))

})

// Send an empty object (could be {}) and it takes back a callback (err,response)
client.readTodos(null, (err, response) => {

    console.log("read the todos from server " + JSON.stringify(response))
    if (typeof response.items !== 'undefined'){
        response.items.forEach(a=>console.log(a.text));
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