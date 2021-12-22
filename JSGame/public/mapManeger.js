class Vector2{
    constructor(x = 0, y = 0){
        this.x = x
        this.y = y
    }

    move(vect_dir){
        this.x += vect_dir.x
        this.y += vect_dir.y
    }

    // static method
    static get_left(){
        return new Vector2(0, -1)
    }
    static get_right(){
        return new Vector2(0, 1)
    }
    static get_down(){
        return new Vector2(1, 0)
    }
    static get_up(){
        return new Vector2(-1, 0)
    }
    static stay(){
        return new Vector2(0, 0)
    }
}

class DoubleListHelper{
    static get_elements(list_target, vect_pos, vect_dir, count = 1){
        let list_result = []
        let dst_x = vect_pos.x, dst_y = vect_pos.y // 不改vect_pos位置，這裡用來定位
        for(let __ = 0; __ < count; __++){
            dst_x += vect_dir.x
            dst_y += vect_dir.y
            let element = list_target[dst_x][dst_y]
            list_result.push(element)
        }
        return list_result
    }

    static set_elements(list_target, vect_pos, vect_dir, element, count = 1){
        let dst_x = vect_pos.x, dst_y = vect_pos.y
        for(let __ = 0; __ < count; __++){
            dst_x += vect_dir.x
            dst_y += vect_dir.y
        }
        list_target[dst_x][dst_y] = element
    }
}

let player_pos
let create_pos = [new Vector2(7,7), new Vector2(37,37), new Vector2(37,7), new Vector2(7,37), new Vector2(22,22)] // 最後一個是goast

function player_controller(map, pos_map){
    if(start_game) switch_map()
    if(id == 0){
        if(p1_map[player_pos.x][player_pos.y]==-89){
            console.log("dead")
            player = -89 // 死了
            dead = true
        }
    }
    if(id == 2){
        if(p2_map[player_pos.x][player_pos.y]==-89){
            console.log("dead")
            player = -89 // 死了
            dead = true
        }
    }
    if(id == 3){
        if(p3_map[player_pos.x][player_pos.y]==-89){
            console.log("dead")
            player = -89 // 死了
            dead = true
        }
    }
    if (keystate["KeyW"]) {
        //console.log(DoubleListHelper.get_elements(map, position, Vector2.get_up()))
        movement(map, Vector2.get_up(), player, pos_map)    
    }
    if (keystate["KeyA"]) {
        //console.log(DoubleListHelper.get_elements(map, position, Vector2.get_left(),3)[2])
        movement(map, Vector2.get_left(), player, pos_map)
    }
    if (keystate["KeyS"]) {
        movement(map, Vector2.get_down(), player, pos_map)
    }
    if (keystate["KeyD"]) {
        //console.log(DoubleListHelper.get_elements(map, position, Vector2.get_right()))
        movement(map, Vector2.get_right(), player, pos_map)
    }
    
    if(map == start_map){
        socket.send(JSON.stringify({
            type:'start_map',
            m: map
        }))
        if(id == 0){
            socket.send(JSON.stringify({
                type:'p1_start_map',
                m: p1_start_map
            }))
        }
        if(id == 1){
            socket.send(JSON.stringify({
                type:'p2_start_map',
                m: p2_start_map
            }))
        }
        if(id == 2){
            socket.send(JSON.stringify({
                type:'p3_start_map',
                m: p3_start_map
            }))
        }
        if(id == 3){
            socket.send(JSON.stringify({
                type:'p4_start_map',
                m: p4_start_map
            }))
        }
    }
    else{
        if (keystate["KeyJ"] && !dead) {
            player = change(player)
        }
        if (keystate["KeyK"] && !dead) {
            player = change_back(__player) // player = -99 (人)
        }
        // 把地圖推到伺服器
        socket.send(JSON.stringify({
            type:'game_map',
            m: map
        }))
        if(id == 0){
            socket.send(JSON.stringify({
                type:'p1_map',
                m: p1_map
            }))
        }
        if(id == 2){
            socket.send(JSON.stringify({
                type:'p2_map',
                m: p2_map
            }))
        }
        if(id == 3){
            socket.send(JSON.stringify({
                type:'p3_map',
                m: p3_map
            }))
        }
    }
    
}


function set_postion(map, player){
    let pos
    for(let x = 0; x < map.length; x++){
        for(let y = 0; y < map[x].length; y++){
            if(map[x][y]==player) pos = new Vector2(x, y)
        }
    }
    console.log(pos)
    return pos
}



function move(map, vect_dir, player){
    DoubleListHelper.set_elements(map, player_pos, Vector2.stay(), 0) // 原地設成0
    DoubleListHelper.set_elements(map, player_pos, vect_dir, player)
    player_pos.move(vect_dir)
}

function push(map, vect_dir, item){
    let p = item_pos(vect_dir)
    DoubleListHelper.set_elements(map, p, Vector2.stay(), 0)
    DoubleListHelper.set_elements(map, p, vect_dir, item)
}

function movement(map, vect_dir, player, pos_map){
    if(DoubleListHelper.get_elements(map, player_pos, vect_dir)==2 && DoubleListHelper.get_elements(map, item_pos(vect_dir), vect_dir)==0 && !dead){
        push(map, vect_dir, 2)
    }
    if(DoubleListHelper.get_elements(map, player_pos, vect_dir)==0) move(pos_map, vect_dir, player)   
    map_clear(pos_map)
    map_clear(map)
}
function switch_map(){
    if(player_pos.x >= max_x){
        min_x = max_x
        max_x += 15
    }
    if(player_pos.y >= max_y){
        min_y = max_y
        max_y += 15
    }
    if(player_pos.x < min_x){
        max_x = min_x
        min_x -= 15
    }
    if(player_pos.y < min_y){
        max_y = min_y
        min_y -= 15
    }
}

function create_player(pos, map){
    DoubleListHelper.set_elements(map, pos, Vector2.stay(), __player) // 把玩家放到map裡面
    player_pos = set_postion(map, __player)  // 設定位置
}
function create_goast(pos, map){
    DoubleListHelper.set_elements(map, pos, Vector2.stay(), __player) // 把玩家放到map裡面
    player_pos = set_postion(map, __player)  // 設定位置
}

function item_pos(vect_dir){
    let p = new Vector2(player_pos.x + vect_dir.x, player_pos.y + vect_dir.y)
    return p 
}

function change(p){
    if(DoubleListHelper.get_elements(map, player_pos, Vector2.get_left())>0) p = -DoubleListHelper.get_elements(map, player_pos, Vector2.get_left())
    if(DoubleListHelper.get_elements(map, player_pos, Vector2.get_right())>0) p = -DoubleListHelper.get_elements(map, player_pos, Vector2.get_right())
    if(DoubleListHelper.get_elements(map, player_pos, Vector2.get_up())>0) p = -DoubleListHelper.get_elements(map, player_pos, Vector2.get_up())
    if(DoubleListHelper.get_elements(map, player_pos, Vector2.get_down())>0) p = -DoubleListHelper.get_elements(map, player_pos, Vector2.get_down())
    DoubleListHelper.set_elements(map, player_pos, Vector2.stay(), p)
    return p
}
function change_back(p){
    p = __player
    DoubleListHelper.set_elements(map, player_pos, Vector2.stay(), p)
    return p 
}

function game_begin(){
    if(DoubleListHelper.get_elements(start_map, player_pos, Vector2.get_right())==8){
        DoubleListHelper.set_elements(start_map, new Vector2(0,7), Vector2.stay(), 10) // 玩
    }
    //if(DoubleListHelper.get_elements(start_map, player_pos, Vector2.get_left())==10) game_init()
    //if(DoubleListHelper.get_elements(start_map, player_pos, Vector2.get_right())==10) game_init()
    if(DoubleListHelper.get_elements(start_map, player_pos, Vector2.get_up())==10) game_init()
    //if(DoubleListHelper.get_elements(start_map, player_pos, Vector2.get_down())==10) game_init()
}
function game_instruction(){
    if(DoubleListHelper.get_elements(start_map, player_pos, Vector2.get_right())==18){
        document.getElementById("instruction").innerHTML = `
        <br>
            =====================遊戲說明==================== <br> <br>
            ==============用WASD控制人物上下左右============= <br> <br>
            =====================在遊戲中==================== <br> <br>
            我:按下J可以變成旁邊的文字，按下K可以變回原本的樣子 <br>
            鬼:按下J可以抓人，按下K可以在小地圖偵測玩家位置 <br>
            經過150秒如果鬼沒有抓到人的話，就算鬼輸，反之則人贏 <br> 
            一次最多可以4人遊玩 !! <br> <br>
            ================================================ <br> <br>
        `
    }
    else{
        document.getElementById("instruction").innerHTML = ` `
    }

}
function game_reset(){
    if(DoubleListHelper.get_elements(lose_map, player_pos, Vector2.get_right())==15){ // '重'新玩
        return -1
    }
    if(DoubleListHelper.get_elements(win_map, player_pos, Vector2.get_right())==15){ // '重'新玩
        return -1
    }
}

let isLeft = false, isRight = false, isUp = false, isDown = false
function goast_controller(map){
    if(start_game) switch_map()
    if (keystate["KeyW"]) {
        movement(map, Vector2.get_up(), player, map) 
        isUp = true; isLeft = false; isDown = false; isRight = false  
    }
    if (keystate["KeyA"]) {
        movement(map, Vector2.get_left(), player, map)
        isLeft = true; isUp = false; isDown = false; isRight = false
    }
    if (keystate["KeyS"]) {
        movement(map, Vector2.get_down(), player, map)
        isDown = true; isLeft = false; isUp = false; isRight = false
    }
    if (keystate["KeyD"]) {
        movement(map, Vector2.get_right(), player, map)
        isRight = true; isLeft = false; isUp = false; isDown = false
    }

    if(map == start_map){ // 鬼這邊不會用到
        socket.send(JSON.stringify({
            type:'start_map',
            m: map
        }))
    }
    else{
        if (keystate["KeyJ"]) {
            grasp()
            if(detect_game_over()) {
                goast_win = true
            }
        }
        if (keystate["KeyK"]) { // 偵測玩家位置
            set_map_all(detect_pos_map, 0)
            socket.send(JSON.stringify({
                type:'get_player_pos',
            }))
        }
        // 把地圖推到伺服器
        socket.send(JSON.stringify({
            type:'goast_map',
            m: map
        }))
    }
    
}

function grasp(){
    if(isLeft && player_pos.y > 1){
        grasp_dir(Vector2.get_left())
    }
    if(isRight && player_pos.y < 43){
        grasp_dir(Vector2.get_right())
    }
    if(isUp && player_pos.x > 1){
        grasp_dir(Vector2.get_up())
    }
    if(isDown && player_pos.x < 43){
        grasp_dir(Vector2.get_down())
    }
}
function grasp_dir(dir){
    DoubleListHelper.set_elements(goast_map, player_pos, dir, 11)
    setTimeout(() => {
        DoubleListHelper.set_elements(goast_map, player_pos, dir, 0)
        socket.send(JSON.stringify({
            type:'goast_map',
            m: goast_map
        }))
    }, 1);
    if(DoubleListHelper.get_elements(p1_map, player_pos, dir)<0){
        console.log("grasp!!!")
        DoubleListHelper.set_elements(p1_map, player_pos, dir, -89)
        socket.send(JSON.stringify({ // 讓玩家變成 "死" 後傳回
            type:'p1_map',
            m: p1_map
        }))
    }
    if(DoubleListHelper.get_elements(p2_map, player_pos, dir)<0){
        console.log("grasp!!!")
        DoubleListHelper.set_elements(p2_map, player_pos, dir, -89)
        socket.send(JSON.stringify({ // 讓玩家變成 "死" 後傳回
            type:'p2_map',
            m: p2_map
        }))
    }
    if(DoubleListHelper.get_elements(p3_map, player_pos, dir)<0){
        console.log("grasp!!!")
        DoubleListHelper.set_elements(p3_map, player_pos, dir, -89)
        socket.send(JSON.stringify({ // 讓玩家變成 "死" 後傳回
            type:'p3_map',
            m: p3_map
        }))
    }
}

let detect_pos_map = [[0,0,0],[0,0,0],[0,0,0],]
function print_detect_map(map){
    let temp = [], P_map
    for(let x = 0; x < map.length; x++){
        for(let y = 0; y < map[x].length; y++){
            if(map[x][y] == 0){
                map[x][y] = `<a style="visibility: hidden; color: #00ADB5">無</a>`
            } 
        } 
        temp.push(map[x].join(""))
    }
    P_map = temp.join("<br>")
    return P_map
}

function add_player_pos(map, min_x, min_y){ // 在client觸發
    for(let x = 0; x < map.length; x++){
        for(let y = 0; y < map[x].length; y++){
            if(x == min_x/15 && y == min_y/15 && !dead) map[x][y] = "人"
        } 
    }
}

function set_map_all(map, element){
    for(let x = 0; x < map.length; x++){
        for(let y = 0; y < map[x].length; y++){
            map[x][y] = element
        } 
    }
}



function detect_game_over(){ // 確認地圖上是否有玩家
    let flag = true
    for(let x = 0; x < p1_map.length; x++){
        for(let y = 0; y < p1_map[x].length; y++){
            if(p1_map[x][y]!=-89 && p1_map[x][y]<0) flag = false // 帶表還有玩家
        }
    }
    for(let x = 0; x < p2_map.length; x++){
        for(let y = 0; y < p2_map[x].length; y++){
            if(p2_map[x][y]!=-89 && p2_map[x][y]<0) flag = false // 帶表還有玩家
        }
    }
    for(let x = 0; x < p3_map.length; x++){
        for(let y = 0; y < p3_map[x].length; y++){
            if(p3_map[x][y]!=-89 && p3_map[x][y]<0) flag = false // 帶表還有玩家
        }
    }
    console.log("detect:", flag)
    return flag  // true --> 玩家全滅 flase --> 還有玩家
}


function map_clear(map){
    for(let x = 0; x < map.length; x++){
        for(let y = 0; y < map[x].length; y++){
            if(map[x][y]<0 && (x!=player_pos.x || y!=player_pos.y)) map[x][y] = 0
        } 
    }
}

function map_clear_element(map, element){
    for(let x = 0; x < map.length; x++){
        for(let y = 0; y < map[x].length; y++){
            if(map[x][y] == element) map[x][y] = 0
        } 
    }
}