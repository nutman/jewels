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
    var chewField = new createjs.Event('chewField');
    var slideJewelsEvent = new createjs.Event('slideJewelsEvent');

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

//        console.log('event======', e.type);

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
        var result = [];
        //      CHECKING ROWS

        stage.children.forEach(function(container, i, stage) {
            var swap = [];
            container.children.forEach(function(bitmap, i, container) {

                swap.push(bitmap);

                if ( bitmap.name != swap[0].name && swap.length >= 3 ) {
                    var elem = swap.pop();
                    if (swap.length > 2 ) {
                        result.push(swap);
                    }
                    swap = [elem];
                } else if ( bitmap.name == swap[0].name && swap[0].name == swap[swap.length -1].name && i == (container.length-1) ) {
                    if (swap.length > 2 ) {
                        result.push(swap);
                    }
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
                    if (swap.length > 2 ) {
                        result.push(swap);
                    }
                    swap = [];
                } else if ( stage.children[i].children[j].name == swap[0].name
                    && swap[0].name == swap[swap.length -1].name
                    && i == (stage.children.length-1) ) {
                    if (swap.length > 2 ) {
                        result.push(swap);
                    }
                } else if ( stage.children[i].children[j].name != swap[0].name && swap.length < 3 ) {
                    swap.shift();
                }
            })
        });

        if ( result.length != 0 ) {
            slideDownJewels(result);
            return true;
        } else {
            return false;
        }

    }

    function slideDownJewels(result){
        console.log('stageCheked===================================');
        console.log('result', result);

        for ( var i = 0; i < result.length; i++) {
            for ( var j = 0; j < result[i].length; j++) {
                var num = result[i][j].coordY;
                for ( var x = num; 0 <= x; x-- ) {
                    if ( x == 0 ) {
                        stage.children[x].children[result[i][j].coordX] = new Jewel(x, result[i][j].coordX);
                        stage.children[x].children[result[i][j].coordX].y -= 100;

                        createjs.Tween.get(stage.children[x].children[result[i][j].coordX], {loop: false}, true)
                            .to({x: result[i][j].coordX*100, y: x*100}, 500, createjs.Ease.Ease );

                    } else {
                        stage.children[x].removeChildAt(result[i][j].coordX);
                        stage.children[x].addChildAt( stage.children[(x-1)].children[result[i][j].coordX].clone(), result[i][j].coordX );

                        stage.children[x].children[result[i][j].coordX].coordY = stage.children[(x-1)].children[result[i][j].coordX].coordY + 1;
                        stage.children[x].children[result[i][j].coordX].coordX = stage.children[(x-1)].children[result[i][j].coordX].coordX;

//                        stage.children[x].children[result[i][j].coordX].y = (stage.children[(x-1)].children[result[i][j].coordX].coordY + 1)*100;
//                        stage.children[x].children[result[i][j].coordX].x = stage.children[(x-1)].children[result[i][j].coordX].coordX*100;

                        createjs.Tween.get(stage.children[x].children[result[i][j].coordX], {loop: false}, true)
                            .to({x: stage.children[(x-1)].children[result[i][j].coordX].coordX*100,
                                y: (stage.children[(x-1)].children[result[i][j].coordX].coordY + 1)*100}, 500, createjs.Ease.Ease );


                        stage.children[x].children[result[i][j].coordX].cursor = "pointer";

                        var hit = new createjs.Shape();
                        hit.graphics.beginFill("#000").drawRect(0, 0, stage.children[x].children[result[i][j].coordX].getBounds().width, stage.children[x].children[result[i][j].coordX].getBounds().height);
                        stage.children[x].children[result[i][j].coordX].hitArea = hit;

                        stage.children[x].children[result[i][j].coordX].addEventListener('click', jewelClick);

                    }
                }
            }
        }
        checkStage();
       /* switch (swap.length) {

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
        }*/
    }



    function replaceJewels( target, select ) {

        var selected = select[0];

        var selected_coordX = select[0].coordX;
        var selected_coordY = select[0].coordY;
//        var selected_name = select[0].name;

        var target = target;

        var target_coordX = target.coordX;
        var target_coordY = target.coordY;

//        selected.x = target_coordX*100;
//        selected.y = target_coordY*100;

        createjs.Tween.get(selected, {loop: false}, true)
            .to({x: target_coordX*100, y: target_coordY*100}, 500, createjs.Ease.Ease );



//        target.x = selected_coordX*100;
//        target.y = selected_coordY*100;

        createjs.Tween.get(target, {loop: false}, true)
            .to({x: selected_coordX*100, y: selected_coordY*100}, 500, createjs.Ease.Ease )
            .call(function(){
                selected.coordX = target_coordX;
                selected.coordY = target_coordY;
                target.coordX = selected_coordX;
                target.coordY = selected_coordY;

                stage.children[target.coordY].children[target.coordX] = target;

                stage.children[select[0].coordY].children[select[0].coordX] = selected;

                if ( !checkStage()) {
                    setTimeout(function(){

//                target.x = target_coordX*100;
//                target.y = target_coordY*100;

                        createjs.Tween.get(target, {loop: false}, true)
                            .to({x: target_coordX*100, y: target_coordY*100}, 500, createjs.Ease.Ease );

                        target.coordX = target_coordX;
                        target.coordY = target_coordY;

//                selected.x = selected_coordX*100;
//                selected.y = selected_coordY*100;

                        createjs.Tween.get(selected, {loop: false}, true)
                            .to({x: selected_coordX*100, y: selected_coordY*100}, 500, createjs.Ease.Ease );

                        selected.coordX = selected_coordX;
                        selected.coordY = selected_coordY;

                        stage.children[target.coordY].children[target.coordX] = selected;

                        stage.children[select[0].coordY].children[select[0].coordX] = target;

                    }, 100);
                }

            });



//        stage.update();




        console.log('stage', stage);

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
//            stage.addEventListener("slideJewelsEvent", slideJewels);
console.log('stage1', stage)
        }
    }
})();




document.addEventListener('DOMContentLoaded', function() {
    jewels.init(manifest);
});

