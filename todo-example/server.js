const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader")

// Get the package definition
const packageDef = protoLoader.loadSync("todo.proto", {});

// Obtain the package (Load) as an object
const grpcObject = grpc.loadPackageDefinition(packageDef);

// Get the todo package as a package
const todoPackage = grpcObject.todoPackage;

const server = new grpc.Server();
server.bind("0.0.0.0:40000",
    grpc.ServerCredentials.createInsecure());


// Tell the server wich services we are using
server.addService(todoPackage.Todo.service,
    {
        // Mapping methods inside the service using [json object]
        "createTodo": createTodo,
        "readTodos": readTodos,
        "readTodosStream": readTodosStream
    });

server.start();

const todos = []

// Methods in gRPC takes two parameters 
// call: Object that is not the actual request, rather the whole call.
//      With it you have access to thw whole thing: TCP Connection, etc..
// callback: Used to send back response to the client.
function createTodo(call, callback) {
    console.log(call)
    const todoItem = {
        "id": todos.length + 1,
        "text": call.request.text
    }
    todos.push(todoItem)

    // @details null auto calculate the payload (bytesWtitten)
    // Send back todo item
    callback(null, todoItem);
}

function readTodosStream(call, callback) {
    if (!todos){
        todos.forEach(t => call.write(t));
    }
    call.end();
}


function readTodos(call, callback) {
    // The actual object inside the callback (return)
    callback(null, { "items": todos })
}
