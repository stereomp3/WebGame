import { WebSocketClient, WebSocketServer } from "https://deno.land/x/websocket/mod.ts";

// websocket serve  //不能用一樣的port  // client要和這個連到同一個才能互相傳資料
const wss = new WebSocketServer(8080);
let seat = [false, false, false, false]
let id = 0, count = 0, t_tmp = 0// token_move會用到
let token = [0,0,0,0] // 紀錄client seat位置
let id_flag = false


wss.on("connection", function (ws: WebSocketClient) {
	ws.on("message", function (message: string) { 
		let text = JSON.parse(message)
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
		else{ // map // start
			// forEach是回乎函數，只要client沒關，這個就還會在，這邊做的效果是任何人傳訊息都會廣播給所有人
			wss.clients.forEach(function each(client) {
				if (!client.isClosed) {
					client.send(message);  // broadcast message
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

