var socket = new WebSocket("ws://"+window.location.hostname+":8080")  // 連到server port
let id = 0  
// 開啟時觸發
socket.onopen = async function (event) { 
    console.log()
    console.log('socket:onopen()...') 
    socket.send(JSON.stringify({
        type:'id',
        id: 0
    }))
    
}
socket.onerror = function (event) { console.log('socket:onerror()...') }
// websocket關閉時觸發
socket.onclose = function (event) { console.log(event.data) }


// 有字串時觸發 // server傳給client
socket.onmessage = function(event){
    //console.log(event.data);
    var date = JSON.parse(event.data)
    if(date.type == "id"){  // 拿到id 開始遊戲
        console.log(date.id)
        id = date.id
        __player += id
        player = __player
        StartScence()
    }
    if(date.type == "start"){
        console.log("start!!")
        console.log(__player)
        start_game = true // 開始遊戲
    }
    if(date.type == "close"){
        socket.send(JSON.stringify({
            type:'leave',
            id: id
        }))
    }
    if(date.type == "game_map") map = date.m
    if(date.type == "start_map") start_map = date.m
    if(date.type == "goast_map") goast_map = date.m
}
