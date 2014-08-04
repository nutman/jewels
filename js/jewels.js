manifest = [
    {src:"img/hexagon_1.png", id:"hexagon_1"},
    {src:"img/hexagon.png", id:"hexagon"},
    {src:"img/pentagon.png", id:"pentagon"},
    {src:"img/rhombus.png", id:"rhombus"},
    {src:"img/sphere.png", id:"sphere"},
    {src:"img/square.png", id:"square"},
    {src:"img/triangle.png", id:"triangle"}
];

function init(manifest) {
    if (window.top != window) {
        document.getElementById("header").style.display = "none";
    }




    // grab canvas width and height for later calculations:
//    w = stage.canvas.width;
//    h = stage.canvas.height;

    loader = new createjs.LoadQueue(false);

    loader.addEventListener("fileload", function(){
        console.log('loaded_image')

    }, this);

    loader.addEventListener("complete", function(){
        handleComplete(manifest, loader);
    });
    loader.loadManifest(manifest);
    loader.load();
}

function handleComplete(manifest, loader) {

    document.getElementById("loader").className = "";
    stage = new createjs.Stage("testCanvas");
    var bitmap;
    var container = new createjs.Container();
    stage.addChild(container);


    for(var i=0; i<8; i++) {
        for(var j=0; j<8; j++) {
            var r = Math.floor(Math.random()*11) % manifest.length;

//            bitmap = new createjs.Bitmap(manifest[r].src);

            bitmap = new createjs.Bitmap(loader.getResult(manifest[r].id));


            bitmap.x = j*100|0;
            bitmap.y = i*100|0;
//            bitmap.width = 100|0;
//            bitmap.height = 100|0;
//            bitmap.regX = bitmap.image.width/2|0;
//            bitmap.regY = bitmap.image.height/2|0;
//            bitmap.scaleX = bitmap.scaleY = bitmap.scale = Math.random()*0.4+0.6;
            bitmap.name = "jewel_"+i+"_"+j;
            bitmap.cursor = "pointer";
            console.log('bitmap', bitmap);
            container.addChild(bitmap);


        }
//        this.grid.push(row);

    }

    stage.update();

 /*    sky = new createjs.Shape();
    sky.graphics.beginBitmapFill(loader.getResult("sky")).drawRect(0,0,w,h);

    var groundImg = loader.getResult("ground");
    ground = new createjs.Shape();
    ground.graphics.beginBitmapFill(groundImg).drawRect(0, 0, w+groundImg.width, groundImg.height);
    ground.tileW = groundImg.width;
    ground.y = h-groundImg.height;

    hill = new createjs.Bitmap(loader.getResult("hill"));
    hill.setTransform(Math.random() * w, h-hill.image.height*3-groundImg.height, 3, 3);

    hill2 = new createjs.Bitmap(loader.getResult("hill2"));
    hill2.setTransform(Math.random() * w, h-hill2.image.height*3-groundImg.height, 3, 3);

    var data = new createjs.SpriteSheet({
        "images": [loader.getResult("grant")],
        "frames": {"regX": 0, "height": 292, "count": 64, "regY": 0, "width": 165},
        // define two animations, run (loops, 1.5x speed) and jump (returns to run):
        "animations": {"run": [0, 25, "run", 1.5], "jump": [26, 63, "run"]}
    });
    grant = new createjs.Sprite(data, "run");
    grant.setTransform(-200, 90, 0.8, 0.8);
    grant.framerate = 30;

    stage.addChild(sky, hill, hill2, ground, grant);
    stage.addEventListener("stagemousedown", handleJumpStart);

    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", tick);*/
}

function handleJumpStart() {
    grant.gotoAndPlay("jump");
}

function tick(event) {
    var deltaS = event.delta/1000;
    var position = grant.x+150*deltaS;

    var grantW = grant.getBounds().width*grant.scaleX;
    grant.x = (position >= w) ? -grantW : position;

    ground.x = (ground.x-deltaS*200) % ground.tileW;
    hill.x = (hill.x - deltaS*30);
    if (hill.x + hill.image.width*hill.scaleX <= 0) { hill.x = w; }
    hill2.x = (hill2.x - deltaS*45);
    if (hill2.x + hill2.image.width*hill2.scaleX <= 0) { hill2.x = w; }

    stage.update(event);
}

document.addEventListener('DOMContentLoaded', function() {
    init(manifest);
});
