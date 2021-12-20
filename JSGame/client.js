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
        input_detect()
        StartScence()
    }
    if(date.type == "start"){
        console.log("start!!")
        console.log(__player)
        start_game = true // 開始遊戲
    }
    if(date.type == "game_over"){
        console.log("game over!!")
        console.log(__player)
        start_game = false // 結束遊戲
        game_over = true
        __player = -99
        player = -99
        goast_win = date.flag
    }
    if(date.type == "close"){
        socket.send(JSON.stringify({
            type:'leave',
            id: id
        }))
    }
    if(date.type == "game_map") map = date.m
    if(date.type == "start_map") start_map = date.m
    if(date.type == "p1_start_map") p1_start_map = date.m
    if(date.type == "p2_start_map") p2_start_map = date.m
    if(date.type == "p3_start_map") p3_start_map = date.m
    if(date.type == "p4_start_map") p4_start_map = date.m
    if(date.type == "goast_map") goast_map = date.m // id: 1
    if(date.type == "p1_map") p1_map = date.m // id: 0
    if(date.type == "p2_map") p2_map = date.m // id: 2
    if(date.type == "p3_map") p3_map = date.m // id: 3


    if(date.type == "get_player_pos" && flag){ // 人回覆位置
        socket.send(JSON.stringify({
            type:'set_player_pos',
            min_x: min_x,
            min_y: min_y
        }))
    }
    if(date.type == "set_player_pos" && !flag){ // 鬼收到位置
        add_player_pos(detect_pos_map, date.min_x, date.min_y)
    }

    if(date.type == "timer"){
        timer = date.t
    }
}
