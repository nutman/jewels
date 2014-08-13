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
    selected = [];
    var stage;

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

    function jewelClick(e) {

        console.log('event======', e.target);

        var is_exist = true;
        selected.push(e.target);

        stage.children.forEach(function (item, i) {
            if (item.name == "frame") {
                stage.removeChild(item);

                if (e.target.x + 100 == item.x && e.target.y == item.y
                    || e.target.x - 100 == item.x && e.target.y == item.y
                    || e.target.y + 100 == item.y && e.target.x == item.x
                    || e.target.y - 100 == item.y && e.target.x == item.x) {

//                    console.log('stage', stage);

                    replaceJewels(e.target, selected, i);

                    is_exist = false;
//                    console.log('selected[...]', selected);
                    selected = [];
//                    console.log('selected[]', selected);
                } else {
//                    console.log('selected no position', selected);

                    selected.shift();
                }
            }
        });

        if (is_exist) {
            var bitmap = new createjs.Bitmap(helper_loader.getResult("frame"));
            bitmap.x = e.target.x || 0;
            bitmap.y = e.target.y || 0;
            bitmap.name = "frame";
            stage.addChild(bitmap);

            stage.update();
        }

    }


    function checkStage(){

//        console.log('stage**', stage);

        //      CHECKING ROWS

        stage.children.forEach(function(container, i, stage) {
            var swap = [];
            container.children.forEach(function(bitmap, i, container) {

                swap.push(bitmap);

                if ( bitmap.name != swap[0].name && swap.length >= 3 ) {
                    swap.pop();
                    switchJewels(swap);
                    swap = [];
                } else if ( bitmap.name == swap[0].name && swap[0].name == swap[swap.length -1].name && i == (container.length-1) ) {
                    switchJewels(swap);
                } else if ( bitmap.name != swap[0].name && swap.length < 3 ) {
                    swap.shift();
                }
            })
        });

        //      CHECKING COLS

        stage.children.forEach(function(container, j) {
            var swap = [];
            container.children.forEach(function(bitmap, i, container) {

                swap.push(stage.children[i].children[j]);

                if ( stage.children[i].children[j].name != swap[0].name && swap.length >= 3 ) {
                    swap.pop();
                    switchJewels(swap);
                    swap = [];
                } else if ( stage.children[i].children[j].name == swap[0].name
                    && swap[0].name == swap[swap.length -1].name
                    && i == (stage.children.length-1) ) {
                    switchJewels(swap);
                } else if ( stage.children[i].children[j].name != swap[0].name && swap.length < 3 ) {
                    swap.shift();
                }
            })
        });


    }

    function switchJewels(swap){
//        console.log('swaaaaaap', swap);
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
            case 6:
                console.log('unbelievable ', swap);
                console.log(6);
                break;
        }
    }

    var chewField = new createjs.Event('chewField');

    function replaceJewels(target, select, i, key) {

//        stage.children.splice(i, 1);

//        console.log('target--', target);
//        console.log('select--', select);

        var selected = select[0];
        var selected_x = select[0].x;
        var selected_y = select[0].y;
        var selected_coordX = select[0].coordX;
        var selected_coordY = select[0].coordY;
//        var selected_name = select[0].name;

        var target = target;
        var target_x = target.x;
        var target_y = target.y;
        var target_coordX = target.coordX;
        var target_coordY = target.coordY;
//        var target_name = target.name;

//        stage.swapChildren(target, select[0]);


//        console.log('stageeeeeeeeeeeeeeeeee***', stage);


        selected.x = target_coordX*100;
        selected.y = target_coordY*100;
        selected.coordX = target_coordX;
        selected.coordY = target_coordY;

        target.x = selected_coordX*100;
        target.y = selected_coordY*100;
        target.coordX = selected_coordX;
        target.coordY = selected_coordY;


        stage.children[target.coordY].children[target.coordX] = target;


        stage.children[select[0].coordY].children[select[0].coordX] = selected;


//        console.log('1',stage.children[target.coordY].children[target.coordX])
//        console.log('2',stage.children[select[0].coordY].children[select[0].coordX])

        stage.update();
        stage.dispatchEvent(chewField);

        console.log('stage', stage)

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
console.log('stage1', stage)
        }
    }
})();




document.addEventListener('DOMContentLoaded', function() {
    jewels.init(manifest);
});

