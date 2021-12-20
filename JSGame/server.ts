import { WebSocketClient, WebSocketServer } from "https://deno.land/x/websocket/mod.ts";

// websocket serve  //不能用一樣的port  // client要和這個連到同一個才能互相傳資料
const wss = new WebSocketServer(8080);
let seat = [false, false, false, false]
let id = 0, count = 0, t_tmp = 0// token_move會用到
let token = [0,0,0,0] // 紀錄client seat位置
let id_flag = false
let timer = 0, f_time = Date.now(), b_time
let start_map, main_map, game_map, goast_map, win_map, lose_map


wss.on("connection", function (ws: WebSocketClient) {
	ws.on("message", function (message: string) { 
		let text = JSON.parse(message)
		
		if(text.type == "start") timer = 0 // 重製時間
		if(text.type == "id") {
			count = 0
			wss.clients.forEach(function each(client) {
				if (client == ws) {
					for(let i = 0; i < seat.length; i++){
						if(!seat[id]){
							if(id_flag) {
								token_move(token, count)
								id_flag = false
							}
							seat[id] = true
							token[count] = id
							console.log("p"+id+": inGame")
							console.log(seat, id, "count", count)
							console.log("token:", token)
							break
						}
						id += 1
					}
				}
				if(!client.isClosed) count += 1
			});
			text.id = id 
			id = 0
			ws.send(JSON.stringify(text)); // 單向
		}
		else if(text.type == "game_map"){ 
			game_map = text.m
			text.m = game_map
			wss.clients.forEach(function each(client) {
				if (!client.isClosed) {
					client.send(message);  
				}
			});
		}		
		else if(text.type == "start_map"){
			start_map = text.m
			text.m = start_map
			wss.clients.forEach(function each(client) {
				if (!client.isClosed) {
					client.send(message);  
				}
			});
		}
		else if(text.type == "goast_map"){
			goast_map = text.m
			text.m = goast_map
			wss.clients.forEach(function each(client) {
				if (!client.isClosed) {
					client.send(message);  
				}
			});
		}	
		else{
			wss.clients.forEach(function each(client) {
				if (!client.isClosed) {
					client.send(message);  
				}
			});
		}

		if(time_flow()){
			wss.clients.forEach(function each(client) {
				if (!client.isClosed) {
					client.send(JSON.stringify({
						type:'timer',
						t: timer
					}));  // broadcast message
				}
			});
		}
	}),
	ws.on("close", function(){ 
		console.log("close")
		count = 0
		wss.clients.forEach(function each(client) {
			if(!client.isClosed) count += 1
			if (client == ws) {
				seat[token[count]] = false
				console.log(seat, token[count])
				t_tmp = token[count] // 為了要用token_move()
				token[count] = -1 
				id_flag = true
			}
		});
		count = 0
	})
});

function token_move(list: number[], count: number){ // 向左移動
	for(let i = 0; i < count; i++){
		if(list[i] == -1){
			list[i] = list[i+1]
			list[i+1] = -1
			console.log("list:",list)
		} 
	}
	token[count] = t_tmp
}

function time_flow(){
	b_time = Date.now()
	if(Math.abs(f_time-b_time)>=1000){  // Data.now是ms為單位
		f_time = Date.now()
		console.log(f_time)
		timer += 1
		return true
	}
}