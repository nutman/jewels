manifest = [
    {src:"img/hexagon_1.png", id:"hexagon_1"},
    {src:"img/hexagon.png", id:"hexagon"},
    {src:"img/pentagon.png", id:"pentagon"},
    {src:"img/rhombus.png", id:"rhombus"},
    {src:"img/sphere.png", id:"sphere"},
    {src:"img/square.png", id:"square"},
    {src:"img/triangle.png", id:"triangle"}
];
helper_images = [
    {src:"img/frame.png", id:"frame"}
];




    function init(manifest) {
        if (window.top != window) {
            document.getElementById("header").style.display = "none";
        }


        loader = new createjs.LoadQueue(false);

        loader.addEventListener("complete", function () {
            handleComplete(loader);
        });
        loader.loadManifest(manifest);
        loader.load();

        helper_loader = new createjs.LoadQueue(false);
        helper_loader.loadManifest(helper_images);
        helper_loader.load();
    }

    function Jewel(i, j) {

        var r = Math.floor(Math.random() * 11) % manifest.length;

        var bitmap = new createjs.Bitmap(loader.getResult(manifest[r].id));

        bitmap.x = j * 100 | 0;
        bitmap.y = i * 100 | 0;

        var hit = new createjs.Shape();
        hit.graphics.beginFill("#000").drawRect(0, 0, bitmap.getBounds().width, bitmap.getBounds().height);
        bitmap.hitArea = hit;

        bitmap.name = manifest[r].id;
        bitmap.cursor = "pointer";

        bitmap.addEventListener('click', jewelClick);

        return bitmap;

    }

    function complete(tween) {
        console.log('lolo');
        var ball = tween._target;
    }

var selected = [];


    function jewelClick(e) {

        selected.push(e.target);

        stage.children.forEach(function (item, i) {
            if (item.name == "frame") {

                if (e.target.x + 100 == item.x && e.target.y == item.y
                    || e.target.x - 100 == item.x && e.target.y == item.y
                    || e.target.y + 100 == item.y && e.target.x == item.x
                    || e.target.y - 100 == item.y && e.target.x == item.x) {

                    console.log("etarget",e.target);
                    console.log("item", item);

                    createjs.Tween.get(selected[0], true)

                        .to({x: e.target.x, y: e.target.y}, 100)
                        .call(function(){
                            console.log(item);
                            console.log(i);
                            stage.children.splice(i, 1);

                            stage.update();
                            selected = [];
                        })
                    ;
                } else {
                    selected = [];
                    stage.children.splice(i, 1);

                }

            }
        });

        var bitmap = new createjs.Bitmap(helper_loader.getResult("frame"));
        bitmap.x = e.target.x | 0;
        bitmap.y = e.target.y | 0;
        bitmap.name = "frame";
        stage.addChild(bitmap);

        stage.update();
    }

    function handleComplete(loader) {

        document.getElementById("loader").className = "";
        stage = new createjs.Stage("testCanvas");

        createjs.Touch.enable(stage);
        stage.mouseEventsEnabled = true;

        stage.enableMouseOver();
        var container = new createjs.Container();
        stage.addChild(container);


        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {

                container.addChild(new Jewel(i, j));
            }

        }

        stage.update();


    }



document.addEventListener('DOMContentLoaded', function() {
    init(manifest);
});



/*var canvas;
var stage;
function init() {
    if (window.top != window) {
        document.getElementById("header").style.display = "none";
    }
    canvas = document.getElementById("testCanvas");
    stage = new createjs.Stage(canvas);
    stage.autoClear = true;
    var ball = new createjs.Shape();
    ball.graphics.setStrokeStyle(5, 'round', 'round');
    ball.graphics.beginStroke(('#000000'));
    ball.graphics.beginFill("#FF0000").drawCircle(0,0,50);
    ball.graphics.endStroke();
    ball.graphics.endFill();
    ball.graphics.setStrokeStyle(1, 'round', 'round');
    ball.graphics.beginStroke(('#000000'));
    ball.graphics.moveTo(0,0);
    ball.graphics.lineTo(0,50);
    ball.graphics.endStroke();
    ball.x = 200;
    ball.y = -50;
    var tween = createjs.Tween.get(ball, {loop:true})
        .to({x:ball.x, y:canvas.height - 55, rotation:-360}, 1500, createjs.Ease.bounceOut)
        .wait(1000)
        .to({x:canvas.width-55, rotation:360}, 2500, createjs.Ease.bounceOut)
        .wait(1000).call(handleComplete)
        .to({scaleX:2, scaleY:2, x:canvas.width - 110, y:canvas.height-110}, 2500, createjs.Ease.bounceOut)
        .wait(1000)
        .to({scaleX:.5, scaleY:.5, x:30, rotation:-360, y:canvas.height-30}, 2500, createjs.Ease.bounceOut);
    stage.addChild(ball);
    createjs.Ticker.addEventListener("tick", stage);
}
function handleComplete(tween) {
    var ball = tween._target;
}*/
