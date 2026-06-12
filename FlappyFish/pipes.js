//@ts-check
class pipes extends GameObject{
    static pipeSprite;
    constructor(context, canvas,x,y,width,height,vx,gap){
        super(context,canvas,x,y);

        this.width = width;
        this.height = height;
        this.vx = vx;
        this.gap = gap;
        this.isCrosstheLine = false;
        this.loadImage();
    }
    loadImage(){
        pipes.pipeSprite = new Image();
        pipes.pipeSprite.src = "assetGame/pipe.png";
    }
    draw(){
        this.context.imageSmoothingEnabled = false;
        let spriteWidth = this.width;
        let scale = this.width/pipes.pipeSprite.width;
        let spriteHeight = pipes.pipeSprite.height * scale;
        this.context.save();
        this.context.translate(this.x,this.y);
        this.context.drawImage(pipes.pipeSprite,0,0,spriteWidth+10,spriteHeight+10);
        this.context.restore();

        this.context.save()
        this.context.translate(this.x,this.y-this.gap);
        this.context.scale(1,-1)
        this.context.drawImage(pipes.pipeSprite,
            0,
            0,
            spriteWidth+10,
            spriteHeight+10
        )

        
        this.context.restore();
    }
    update(secondPassed){
        this.x -= this.vx * secondPassed
    }
    getHitbox(){
        return{
            
            topPipe:{
                x: this.x,
           
                y : 0,
                width: this.width,
                height: this.y-this.gap
            },

            bottomPipe:{
                x:this.x,
                y:this.y,
                width: this.width,
                height: this.height,
            }
        }
    }
    checkColision(fish){
        const {topPipe,bottomPipe} = this.getHitbox();
        let hitTop = this.isCircleColisionWithRect(fish,topPipe);
        let hitBottom = this.isCircleColisionWithRect(fish,bottomPipe);

        if(hitTop || hitBottom){
            console.log("da cham vao pipe");
            return true
        }
        return false;
    }
    isCircleColisionWithRect(circle,rect){
        let closestX = Math.max(rect.x,Math.min(circle.x,rect.x+rect.width));
        let closestY = Math.max(rect.y,Math.min(circle.y,rect.y+rect.height));
        let distanceX = circle.x - closestX;
        let distanceY = circle.y - closestY;

        let distanceSquared = (distanceX * distanceX) + (distanceY*distanceY);

        return distanceSquared < (circle.radius * circle.radius);
    }
}