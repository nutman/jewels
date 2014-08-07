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

        bitmap.coordX = j;
        bitmap.coordY = i;

        var hit = new createjs.Shape();
        hit.graphics.beginFill("#000").drawRect(0, 0, bitmap.getBounds().width, bitmap.getBounds().height);
        bitmap.hitArea = hit;

        bitmap.name = manifest[r].id;
        bitmap.cursor = "pointer";

        bitmap.addEventListener('click', jewelClick);
//        bitmap.addEventListener('tick', function(){
//            console.log('tick')
//        });

        return bitmap;

    }

    var selected = [];


    function jewelClick(e) {

        console.log(e.target);

        selected.push(e.target);

        stage.children.forEach(function (item, i) {
            if (item.name == "frame") {

                if (e.target.x + 100 == item.x && e.target.y == item.y) {
                    console.log('shift_left');
                    replaceJewels(e.target, selected[0], i, 'shift_left');
                }
                if (e.target.x - 100 == item.x && e.target.y == item.y) {
                    console.log('shift_rigth');
                    replaceJewels(e.target, selected[0], i, 'shift_rigth');
                }
                if (e.target.y + 100 == item.y && e.target.x == item.x) {
                    console.log('shift_up');
                    replaceJewels(e.target, selected[0], i, 'shift_up');
                }
                if (e.target.y - 100 == item.y && e.target.x == item.x) {
                    console.log('shift_down');
                    replaceJewels(e.target, selected[0], i, 'shift_down');
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


    function checkStage(){
//        console.log('hello');
        console.log('hello',container.children[0]);

        var swap = [];

        container.children.forEach(function(elem, i, arr) {
            swap.push(elem)

            if ( i > 0 && elem.name == swap[0].name /*&& i % 8 == 0*/  ) {

//                console.log('swap ', swap);
//                console.log('swap length ---------- ', swap.length);

                switch (swap.length) {
                    case 3:
                        console.log('swap', swap);
                        console.log(3);
                        break;
                    case 4:
                        console.log('swap', swap);
                        console.log(4);
                        break;
                    case 5:
                        console.log('swap', swap);
                        console.log(5);
                        break;
                }
            } else {
                swap = [];
            }
        })

    }

    var chewField = new createjs.Event('chewField');

    function replaceJewels(target, selected, i, key) {
        createjs.Tween.get(selected, {loop: false}, true)
            .to({x: target.x, y: target.y}, 500, createjs.Ease.Ease )

            .to({x: selected.x, y: selected.y}, 500, createjs.Ease.Ease );

        createjs.Tween.get(target, {loop: false}, true)
            .call(function(){
                selected = [];
                stage.children.splice(i, 1);
                stage.update();
            })
            .to({x: selected.x, y: selected.y}, 500, createjs.Ease.Ease )
            .call( function() {
                stage.dispatchEvent(chewField)
            })
            .to({x: target.x, y: target.y}, 500, createjs.Ease.Ease )

    }

    function handleComplete(loader) {

        document.getElementById("loader").className = "";
        stage = new createjs.Stage("testCanvas");
        createjs.Ticker.addEventListener("tick", stage);


        createjs.Touch.enable(stage);
        stage.mouseEventsEnabled = true;

        stage.enableMouseOver();
        container = new createjs.Container();




        for (var i = 0; i < 8; i++) {
            var container = new createjs.Container();
            for (var j = 0; j < 8; j++) {

                container.addChild(new Jewel(i, j));
            }
            stage.addChild(container);
        }

        stage.update();
        stage.addEventListener("chewField", checkStage);

        console.log('container', stage)

    }



document.addEventListener('DOMContentLoaded', function() {
    init(manifest);
});

/*
 for(var y=0; y<8; y++) {
 var items = [[y,0]];

 for(var x=1; x<8; x++) {
 if($this.grid[y][x] != $this.grid[items[0][0]][items[0][1]]) {
 if(items.length>2) for(var i=0; i<items.length;i++) scores.push(items[i]);
 items = [];
 }
 items.push([y,x]);
 }
 if(items.length>2) for(var i=0; i<items.length;i++) scores.push(items[i]);
 } */