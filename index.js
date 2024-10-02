const express=require('express');
const app=express();
const httpserver=require('http').createServer(app);
const io=require('socket.io')(httpserver);

const connections=[]

io.on("connect",(socket)=>{

    connections.push(socket);
    console.log(`${socket.id} has connected`);

    socket.on("disconnect",(reason)=>{
        connections=connections.filter((con)=>con.id!==socket.id);
    });
});

app.use(express.static('public'));

const PORT = process.env.PORT || 8000;
httpserver.listen(PORT,()=>console.log(`Server started on port ${PORT}`));

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
});
