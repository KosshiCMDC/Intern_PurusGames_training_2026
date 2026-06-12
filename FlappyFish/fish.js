//@ts-check
class fish extends GameObject{
    static sprite;
    static numcol = 2;
    static framewidth = 0;
    static frameheight = 0;
    constructor(context,canvas,x,y,radius,vy){
        super(context,canvas,x,y);
        this.radius = radius;
        this.vy = vy;
        this.angle =0;
        this.gravity = 200;
        this.frame = 1;
        this.loadImage();
    }
    loadImage(){
        fish.sprite = new Image();
        fish.sprite.src = "assetGame/fish.png";
        fish.sprite.onload = function(){
            fish.framewidth = fish.sprite.width / fish.numcol;
            fish.frameheight = fish.sprite.height/1;
        }
    }
    draw(){
        this.context.save(); 
        
        this.context.translate(this.x, this.y);
        this.context.rotate(this.angle);
        let col = this.frame % fish.numcol;
        let sX = col * fish.framewidth;
        this.context.imageSmoothingEnabled = false;
        let fishWidth = this.radius*2;
        let scale = this.radius*2/fish.framewidth;
        let fishHeight = fish.frameheight* scale;
        this.context.drawImage(fish.sprite,
            sX,
            0,
            fish.framewidth,
            fish.frameheight,
            -fishWidth/2,
            -fishHeight/2,
            fishWidth,
            fishHeight
        );
        this.context.restore(); // Khôi phục lại thế giới cũ cho frame sau
    }
    update(secondPassed){
        this.vy += secondPassed*this.gravity;
        this.y += this.vy * secondPassed ;

        if(this.vy<0){
            this.angle = -0.3;
        }
        else{
            this.frame = 1;
            this.angle = Math.min(1.2, this.angle + 3 * secondPassed);
        }
    }
    swim(){
        let force = -100;
        this.vy =force;
        this.angle = -0.3;
        this.frame = 0;
    }
}