"use strict";

let canvas;
let context;
let game;
let SPEED = 50;
let gap = 150;
window.onload = () => {
    canvas = document.getElementById('theCanvas');
    

    canvas.width  = 300;
    canvas.height = 500;
    context = canvas.getContext('2d');
    game = new GameWorld(context,canvas);

    
    window.requestAnimationFrame((timeStamp)=>game.gameloop(timeStamp));
}

class GameWorld{
    constructor(context,canvas){
        this.context = context;
        this.canvas = canvas;
        
        this.oldTimeStamp = 0;
        this.secondPassed = 0;


        this.timer = 0;
        this.timeraccount =5;
        this.counter =0;
        this.startGame = false;

        this.run = false;
        this.gameover = false;
        
        this.listofPipe = [];
        this.createFish()
        this.createUI();
        this.listenInput();
    }
    gameloop(timeStamp){
        this.secondPassed = (timeStamp - this.oldTimeStamp) /1000;
        this.oldTimeStamp = timeStamp;

        this.update(this.secondPassed);
        this.draw()

        window.requestAnimationFrame((nextTimestamp)=>this.gameloop(nextTimestamp));
    }
    update(secondPassed){
        if(!this.run){
            return;
        }
        else{
                this.Fish.update(secondPassed);
            this.listofPipe.forEach(pipe => pipe.update(secondPassed));
            this.detectColision();
            this.timer += secondPassed;
            if(this.timer> 1 && !this.startGame){
                this.createpipe();
                this.timer-=1;
                this.startGame = true;
                console.log("tạo 1 pipe")
            }
            if(this.timer > this.timeraccount){
                this.createpipe();
                this.timer -=this.timeraccount;
                console.log("tạo 1 pipe")
            }
            for(let i=0;i<this.listofPipe.length;i++){
                let obj = this.listofPipe[i];
                if(obj.isCrosstheLine) continue;
                else if(obj.x+obj.width/2 < this.canvas.width/2){
                    obj.isCrosstheLine = true;
                    this.counter +=1;
                    this.scoreBoard.setScore(1);
                }
                
            }
            for(let i =0; i<this.listofPipe.length;i++){
                if(this.listofPipe[i].x < 0-this.listofPipe[i].width)
                    this.listofPipe.splice(i,1);
            }
        }
        
        // if(this.counter >=5){
        //     this.timeraccount = Math.min(3, this.timeraccount - 0.5);
        //     this.counter = 0;
        //     SPEED = Math.min(350, SPEED+10);
        //     gap = Math.max(100, gap -10);;
        // }

        
    }
    draw(){
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        if(!this.run && !this.gameover){
            this.StartButton.draw();
        }
        else if(this.run && !this.gameover){
           
            this.Fish.draw();
            this.listofPipe.forEach(pipe => pipe.draw());
            this.scoreBoard.draw();
        }
        else if(!this.run && this.gameover){
            this.RestartButton.draw();
        }
        
    }
    listenInput(){
        window.addEventListener('mousedown',event =>{
            if(!this.run && !this.gameover){
                if(this.StartButton.isMouseTouch(this.canvasX(event.clientX),this.canvasY(event.clientY))){
                    this.run = true;
                }
            }   
            else if(!this.run && this.gameover){
                if(this.RestartButton.isMouseTouch(this.canvasX(event.clientX),this.canvasY(event.clientY))){
                    this.resetGame()
                 }
            } 
            else if(this.run && !this.gameover){
                this.Fish.swim();
            }
        });
    }
    canvasX(mouseX){
        let rect = this.canvas.getBoundingClientRect();
        return mouseX - rect.left;
    }
    canvasY(mouseY){
        let rect = this.canvas.getBoundingClientRect();
        return mouseY - rect.top;
    }
    createFish(){
        this.Fish = new fish(this.context,this.canvas,this.canvas.width/2,this.canvas.height/2,30,50);
    }
    createpipe(){
       
        let distanceYrandom = Math.random() > 0.5 ? this.canvas.height / 2 - Math.random() * 50 : this.canvas.height / 2 + Math.random() * 50;
        let spawnX = canvas.width;
        this.listofPipe.push(new pipes(this.context,this.canvas,spawnX,distanceYrandom,100,250,SPEED,gap));
    }
    createUI(){
        this.scoreBoard = new Score(this.context,this.canvas,this.canvas.width,this.canvas.height,100,60);
        this.StartButton = new startButton(this.context,this.canvas,200,100);
        this.RestartButton = new restartButton(this.context,this.canvas,200,100);
    }
    detectColision(){
        for(let i=0;i<this.listofPipe.length;i++){
            let obj = this.listofPipe[i];
            if(obj.checkColision(this.Fish)){
                this.gameover = true;
                this.run = false;
                
                console.log("gameOver");
            }
        }
    }
    resetGame(){
        this.run = true;
        this.gameover = false;
        this.timer =0;
        this.startGame = false;
        this.listofPipe = [];   
        this.createFish();      
        this.scoreBoard.score = 0;
    }
}