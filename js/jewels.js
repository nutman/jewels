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


var jewels = (function(){


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

        return bitmap;

    }


    var selected = [],
        stage;


    function jewelClick(e) {

//        console.log(e.target);

        var is_exist = true;
        selected.push(e.target);

        stage.children.forEach(function (item, i) {
            if (item.name == "frame") {
//                stage.children.splice(i, 1);
                stage.removeChild(item);

                if (e.target.x + 100 == item.x && e.target.y == item.y
                    || e.target.x - 100 == item.x && e.target.y == item.y
                    || e.target.y + 100 == item.y && e.target.x == item.x
                    || e.target.y - 100 == item.y && e.target.x == item.x) {


                    console.log('stage', stage);


                    replaceJewels(e.target, selected, i);
//                stage.update();

                    is_exist = false;
                    console.log('selected', selected);
                    selected = [];

                } else {
                    console.log('selected no position', selected)

                    selected.shift();
                }


            }

        });

        if (is_exist) {
            var bitmap = new createjs.Bitmap(helper_loader.getResult("frame"));
            bitmap.x = e.target.x | 0;
            bitmap.y = e.target.y | 0;
            bitmap.name = "frame";
            stage.addChild(bitmap);

            stage.update();
        }

    }


    function checkStage(){

//        console.log('stage**', stage);

        stage.children.forEach(function(container, i, stage) {
            var swap = [];
            container.children.forEach(function(bitmap, i, container) {
                swap.push(bitmap);
                if ( i > 0 && bitmap.name == swap[0].name ) {

//                                 console.log('swap', swap);
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
        });

/*
//        console.log('hello');
        console.log('hello',container.children[0]);

        var swap = [];

        container.children.forEach(function(elem, i, arr) {
            swap.push(elem)

            if ( i > 0 && elem.name == swap[0].name */
/*&& i % 8 == 0*//*
  ) {

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
*/

    }

    var chewField = new createjs.Event('chewField');

    function replaceJewels(target, select, i, key) {

//        console.log('i -', i);
//        console.log('target -', target);

        stage.children.splice(i, 1);

        var selected = select[0];

        var selected_y = select[0].y;
        var selected_name = select[0].name;

        var target_x = target;
        var target_y = target.y;
        var target_name = target.name;

        stage.swapChildren(target, select[0]);

        stage.children[target.coordY].children[target.coordX] = selected;
//        stage.children[target.coordY].children[target.coordX].y = selected_y;

        stage.children[select[0].coordY].children[select[0].coordX] = target_x;
//        stage.children[select[0].coordY].children[select[0].coordX].y = target_y;



        selected = [];
        stage.update();
        stage.dispatchEvent(chewField);

        /*        createjs.Tween.get(selected, {loop: false}, true)
         .to({x: target.x, y: target.y}, 500, createjs.Ease.Ease )

         .to({x: selected.x, y: selected.y}, 500, createjs.Ease.Ease );

         createjs.Tween.get(target, {loop: false}, true)
         .call(function(){
         selected = [];

         stage.update();
         })
         .to({x: selected.x, y: selected.y}, 500, createjs.Ease.Ease )
         .call( function() {

         })
         .to({x: target.x, y: target.y}, 500, createjs.Ease.Ease )*/
    }



    return {

        init: function (manifest) {
            if (window.top != window) {
                document.getElementById("header").style.display = "none";
            }

            loader = new createjs.LoadQueue(false);

            loader.addEventListener("complete", this.handleComplete);
            loader.loadManifest(manifest);
            loader.load();

            helper_loader = new createjs.LoadQueue(false);
            helper_loader.loadManifest(helper_images);
            helper_loader.load();
        },
        handleComplete: function(loader) {

            console.log('helllo')

            document.getElementById("loader").className = "";
            stage = new createjs.Stage("testCanvas");

            createjs.Ticker.addEventListener("tick", stage);

            createjs.Touch.enable(stage);
            stage.mouseEventsEnabled = true;

            stage.enableMouseOver();

            for (var i = 0; i < 8; i++) {
                var container = new createjs.Container();
                for (var j = 0; j < 8; j++) {
                    container.addChild(new Jewel(i, j));
                }
                stage.addChild(container);
            }

            stage.addEventListener("chewField", checkStage);

        }
    }
})();




document.addEventListener('DOMContentLoaded', function() {
    jewels.init(manifest);
});

