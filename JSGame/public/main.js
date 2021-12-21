let FPS = 10, fpsInterval, startTime, timestamp = Date.now(), preTimestamp, progress, timer = 0, win_time = 10; 
let keystate = [], ispress = false;
let __player = -99, player = -99;
let goast = 100;
let flag = true, start_game = false, game_over = false; dead = false, goast_win = false;  // flag: true = 人, false = 鬼


function StartScence(){
    timer = 0; goast_win = false
    startAnimating(10) // 調整fps
    console.log("in")
    if(id==1) flag = false  // 鬼
    create_player(create_pos[0], start_map)
    player_pos = set_postion(start_map, __player)
    var loop = function () {
        timestamp = Date.now(); //調整速率
        progress = timestamp - preTimestamp;
        if (progress > fpsInterval) { 
            if(!start_game){
                game_instruction()
                game_begin()
            }
            else {
                MainGame()
                return 0
            }
            startAnimating(10);
            if(id == 0) player_controller(start_map, p1_start_map)
            if(id == 1) player_controller(start_map, p2_start_map)
            if(id == 2) player_controller(start_map, p3_start_map)
            if(id == 3) player_controller(start_map, p4_start_map)
            draw(start_map)
        }
        window.requestAnimationFrame(loop);
    }
    window.requestAnimationFrame(loop);
}

function MainGame() {
    document.getElementById("instruction").innerHTML = ``
    startAnimating(FPS) // 調整fps
    create_people()
    //random_item(25) // 1/25
    var loop = function () {
        timestamp = Date.now(); //調整速率
        progress = timestamp - preTimestamp;
        if (progress > fpsInterval) { 
            startAnimating(FPS);
            if(game_over){
                GameOverScence()
                draw_goast(goast_map)
                return 0
            }
            if(flag) {
                if(id == 0) player_controller(map, p1_map)
                if(id == 2) player_controller(map, p2_map)
                if(id == 3) player_controller(map, p3_map) 
            }
            else {
                goast_controller(goast_map)
            }

            if((timer > win_time && !detect_game_over()) || goast_win){
                console.log("game_over")
                socket.send(JSON.stringify({
                    type:'game_over',
                    flag: goast_win
                })) 
            } 
            draw(map)
        }
        window.requestAnimationFrame(loop);
    }
    window.requestAnimationFrame(loop);
}

function GameOverScence(){
    startAnimating(10) // 調整fps
    player_pos = set_postion(win_map, -99)
    min_x = 0; max_x = 15; min_y = 0; max_y = 15;
    var loop = function () {
        timestamp = Date.now(); //調整速率
        progress = timestamp - preTimestamp;
        if (progress > fpsInterval) { 
            startAnimating(10);
            if(goast_win){
                console.log("goast win")
                if(flag) {
                    draw(lose_map)
                    player_controller(lose_map, lose_map)
                }  
                else {
                    draw(win_map) 
                    player_controller(win_map, win_map)
                }
            }
            else{
                console.log("player win!!")
                if(flag) {
                    draw(win_map) 
                    player_controller(win_map, win_map)
                } 
                else {
                    draw(lose_map)
                    player_controller(lose_map, lose_map)
                }
            }
            if(game_reset()==-1){
                location.reload() // 重新整理 XD
                game_over = false
                console.log("restart")
                // 鬼固定 時間統一 地圖重新判定
                return 0
            }
        }
        window.requestAnimationFrame(loop);
    }
    window.requestAnimationFrame(loop);
}
function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    preTimestamp = Date.now();
    startTime = preTimestamp;
}

function draw(map) {
    draw_background(map)
    draw_p1(p1_map)
    draw_p2(p2_map)
    draw_p3(p3_map)
    draw_goast(goast_map)
    if(start_game){
        document.getElementById("small_map").innerHTML = `時間: `+timer.toFixed(0)+`<br><br> 小地圖 <br><br>`+print_small_map()
    }
    else{
        draw_p1(p1_start_map)
        draw_p2(p2_start_map)
        draw_p3(p3_start_map)
        draw_p4(p4_start_map)
        document.getElementById("small_map").innerHTML = ``
    }
}

function draw_goast(map){
    if(start_game) {
        document.getElementById("goast_area").innerHTML = parse_map(init_map(map))
        document.getElementById("show_player_pos").innerHTML = `<br><br> 小地圖 <br><br>`+print_detect_map(detect_pos_map)
    }
    else{
        document.getElementById("goast_area").innerHTML = ``
        document.getElementById("show_player_pos").innerHTML = ``
    }
}
function draw_background(map){
    document.getElementById("game").innerHTML = parse_map(init_map(map))
}
function draw_p1(map){
    if(!game_over) document.getElementById("p1_area").innerHTML = parse_map(init_map(map))
    else document.getElementById("p1_area").innerHTML = ``
}
function draw_p2(map){
    if(!game_over)document.getElementById("p2_area").innerHTML = parse_map(init_map(map))
    else document.getElementById("p2_area").innerHTML = ``
}
function draw_p3(map){
    if(!game_over)document.getElementById("p3_area").innerHTML = parse_map(init_map(map))
    else document.getElementById("p3_area").innerHTML = ``
}
function draw_p4(map){
    if(!game_over)document.getElementById("p4_area").innerHTML = parse_map(init_map(map))
    else document.getElementById("p4_area").innerHTML = ``
}

function game_init(){ // 觸發一次 // 碰到 玩 觸發  
    random_item(25)
    // 把地圖推到伺服器
    socket.send(JSON.stringify({
        type:'game_map',
        m: map
    })) 

    socket.send(JSON.stringify({ // 讓所有人進入地圖
        type:'start',
        m: MainGame()
    }))
    
}

function create_people(){
    console.log(map)
    console.log("pos:",create_pos[id])
    if(flag){
        create_player(create_pos[id], map)
        console.log("person:",player_pos, "id:", id, "pos:", create_pos[id])
    }
    else {
        __player = 100
        create_goast(create_pos[create_pos.length-1], map)
        console.log("goast:",player_pos, "id:", id)
    }
    player = __player
    player_pos = set_postion(map, __player)
}


function random_item(max){
    for(let x = 1; x < map.length-1; x++){
        for(let y = 1; y < map.length-1; y++){
            if(Math.floor(Math.random() * max)==0) map[x][y] = 2
        }
    } 
}

function init_map(map){
    let record_map = []
    for(let x = min_x; x < max_x; x++){
        record_map.push([])
        for(let y = min_y; y < max_y; y++){
            // item
            if(Math.abs(map[x][y]) == 2) record_map[x-min_x].push(`箱`)  
            // block
            if(Math.abs(map[x][y]) == 4) record_map[x-min_x].push(`上`) 
            if(Math.abs(map[x][y]) == 5) record_map[x-min_x].push(`下`) 
            if(Math.abs(map[x][y]) == 6) record_map[x-min_x].push(`左`) 
            if(Math.abs(map[x][y]) == 7) record_map[x-min_x].push(`右`)
            if(Math.abs(map[x][y]) == 8) record_map[x-min_x].push(`準`) 
            if(Math.abs(map[x][y]) == 9) record_map[x-min_x].push(`備`) 
            if(Math.abs(map[x][y]) == 10) record_map[x-min_x].push(`玩`) 
            if(Math.abs(map[x][y]) == 11) record_map[x-min_x].push(`抓`) 
            if(Math.abs(map[x][y]) == 12) record_map[x-min_x].push(`贏`)
            if(Math.abs(map[x][y]) == 13) record_map[x-min_x].push(`輸`)
            if(Math.abs(map[x][y]) == 14) record_map[x-min_x].push(`了`)
            if(Math.abs(map[x][y]) == 15) record_map[x-min_x].push(`重`)
            if(Math.abs(map[x][y]) == 16) record_map[x-min_x].push(`新`)
            if(Math.abs(map[x][y]) == 18) record_map[x-min_x].push(`說`)
            if(Math.abs(map[x][y]) == 19) record_map[x-min_x].push(`明`)
            if(Math.abs(map[x][y]) == 3) record_map[x-min_x].push(`樹`)  
            if(Math.abs(map[x][y]) == 1) record_map[x-min_x].push(`牆`)  
            
            if(map[x][y] == 0) record_map[x-min_x].push(`<a style="visibility: hidden; color: #00ADB5">路</a>`)  // road
            if(map[x][y] <= -90) record_map[x-min_x].push("我")  // player
            if(map[x][y] == -89) record_map[x-min_x].push("死")
            if(map[x][y] == 100) record_map[x-min_x].push("鬼")  // goast
        }
    }
    return record_map
}

function parse_map(map){
    let P_map, temp = []
    for(let x = 0; x < map.length; x++){
        temp.push(map[x].join(""))
    }
    P_map = temp.join("<br>")
    return P_map
}
function print_small_map(){
    let s_map = [[0,0,0],[0,0,0],[0,0,0],], temp = [], P_map
    for(let x = 0; x < 3; x++){
        for(let y = 0; y < 3; y++){
            s_map[x][y] = "囗"
            if(!flag){
                if(x == min_x/15 && y == min_y/15) s_map[x][y] = "鬼"
            }
            else{
                if(x == min_x/15 && y == min_y/15 && !dead) s_map[x][y] = "我"
                if(x == min_x/15 && y == min_y/15 && dead) s_map[x][y] = "死"
            }
        } 
        temp.push(s_map[x].join(""))
    }
    P_map = temp.join("<br>")
    return P_map
}

function input_detect(){
    document.addEventListener("keydown", function (event) {//這裡的evt是接收玩家的鍵盤事件
        keystate[event.code] = true//鍵盤按下
        ispress = true
    }, true);
    document.addEventListener("keyup", function (event) {
        keystate[event.code] = false;//放開取消事件，避免短期按太多按件
        ispress = false
    }, true);
}
