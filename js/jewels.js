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
        bitmap.addEventListener('tick', function(){
            console.log('tick')
        });

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


                    createjs.Tween.get(selected[0], {loop: false}, true)
                        .to({x: e.target.x, y: e.target.y}, 300, createjs.Ease.Ease )
                        .to({x: selected[0].x, y: selected[0].y}, 300, createjs.Ease.Ease );

                    createjs.Tween.get(e.target, {loop: false}, true)
                        .call(function(){
                            selected = [];
                            stage.children.splice(i, 1);
                            stage.update();
                        })
                        .to({x: selected[0].x, y: selected[0].y}, 300, createjs.Ease.Ease )
                        .to({x: e.target.x, y: e.target.y}, 300, createjs.Ease.Ease )


                    createjs.Ticker.addEventListener("tick", stage);

                }

                selected = [];
                stage.children.splice(i, 1);
                stage.update();

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
