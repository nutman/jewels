const jewels = (() => {
  const images = [
    {src: "img/hexagon_1.png", id: "hexagon_1"},
    {src: "img/hexagon.png", id: "hexagon"},
    {src: "img/pentagon.png", id: "pentagon"},
    {src: "img/rhombus.png", id: "rhombus"},
    {src: "img/sphere.png", id: "sphere"},
    {src: "img/square.png", id: "square"},
    {src: "img/triangle.png", id: "triangle"},
  ];
  const helperImages = [
    {src: "img/frame.png", id: "frame"}
  ];

  const TIMEOUT = 1500;
  const JEM_SWITCH_TIMEOUT = 100;
  const JEM_SWITCH_TIME = 500;
  const COLOR_BLACK = '#000000';
  const INDEX_RANDOM = 11;

  let selected = [];
  let cheatCache = [];
  let score = 0;
  let isAnimation = false;

  let stage, loader, helper_loader, scoreElement;

  function defineScoreElement() {
    scoreElement = document.getElementById('score');
  }

  function updateScore(s) {
    scoreElement.innerHTML = s;
  }

  function GenerateNewJewel(i, j) {
    const r = Math.floor(Math.random() * INDEX_RANDOM) % images.length;
    const bitmap = new createjs.Bitmap(loader.getResult(images[r].id));
    const hit = new createjs.Shape();

    hit.graphics.beginFill(COLOR_BLACK).drawRect(0, 0, bitmap.getBounds().width, bitmap.getBounds().height);

    [bitmap.x, bitmap.y] = [j * 100 | 0, i * 100 | 0];
    [bitmap.CoordinateX, bitmap.CoordinateY] = [j, i];

    bitmap.hitArea = hit;
    bitmap.name = images[r].id;
    bitmap.cursor = "pointer";
    bitmap.addEventListener('click', jewelClick);

    return bitmap;
  }

  function jewelClick(e) {
    if (isAnimation) {
      return;
    }
    clearCheatCache();

    let is_exist = true;
    if (e.target) {
      selected.push(e.target);
    }

    stage.children.forEach(function (item, i) {
      if (item.name !== "frame") {
        return
      }
      stage.removeChild(item);

      if (e.target.x + 100 === item.x && e.target.y === item.y
        || e.target.x - 100 === item.x && e.target.y === item.y
        || e.target.y + 100 === item.y && e.target.x === item.x
        || e.target.y - 100 === item.y && e.target.x === item.x) {

        isAnimation = true;

        setTimeout(() => {
          isAnimation = false;
        }, TIMEOUT);

        replaceJewels(e.target, selected, i);

        is_exist = false;
        selected = [];
      } else {
        selected.shift();
      }
    });

    if (!is_exist) {
      return;
    }

    drawFrame(e.target)
  }

  function drawFrame(elem) {
    const bitmap = new createjs.Bitmap(helper_loader.getResult("frame"));
    [bitmap.x, bitmap.y] = [elem.x || 0, elem.y || 0];
    bitmap.name = "frame";
    stage.addChild(bitmap);
    stage.update();
    return bitmap;
  }

  function pushSwapToResult(result, swap) {
    if (swap.length < 3) {
      return;
    }
    result.push(swap);
  }

  function handleResultAndSwap(result, swap) {
    const elem = swap.pop();
    pushSwapToResult(result, swap);
    return [elem];
  }

  function findOptions() {
    if (!stage?.children) {
      return null;
    }
    for (let i = 0; i < stage.children.length; i++) {
      let container = stage.children[i]
      if (!container.children) {
        return null;
      }

      for (let j = 0; j < container.children.length; j++) {
        let bitmap = container.children[j];
        let directions = [
          // move to the right
          [0, 2, 0, 3], [1, 1, 2, 1], [-1, 1, -2, 1], [-1, 1, 1, 1],
          // move to the left
          [0, -2, 0, -3], [-1, -1, -2, -1], [1, -1, 2, -1], [-1, -1, 1, -1],
          // move to the bottom
          [2, 0, 3, 0], [1, 1, 1, -1], [1, 1, 1, 2], [1, -1, 1, -2],
          //move to the top
          [-2, 0 - 3, 0], [-1, 1, -1, -1], [-1, 1, -1, 2], [-1, -1, -1, -2]
        ];

        for (let index = 0; index < directions.length; index++) {
          let [w, x, y, z] = directions[index]

          if (
            stage.children[i]?.children?.[j]?.name === stage.children[i + w]?.children?.[j + x]?.name &&
            bitmap.name === stage.children[i + y]?.children?.[j + z]?.name
          ) {
            return bitmap
          }
        }
      }
    }
    return null;
  }

  function checkRows(container, bitmap, j, rowsSwap, result) {
    rowsSwap.push(bitmap);
    if (bitmap.name !== rowsSwap[0].name && rowsSwap.length >= 3) {
      rowsSwap = handleResultAndSwap(result, rowsSwap);
    } else if (bitmap.name === rowsSwap[0].name && rowsSwap[0].name === rowsSwap[rowsSwap.length - 1].name && j === (container.length - 1)) {
      pushSwapToResult(result, rowsSwap)
    } else if (bitmap.name !== rowsSwap[0].name && rowsSwap.length < 3) {
      rowsSwap.shift();
    }
    return rowsSwap;
  }

  function checkColumns(container, bitmap, j, i, columnsSwap, result) {
    columnsSwap.push(stage.children[j].children[i]);
    if (stage.children[j].children[i].name !== columnsSwap[0].name && columnsSwap.length >= 3) {
      columnsSwap = handleResultAndSwap(result, columnsSwap);
    } else if (stage.children[j].children[i].name === columnsSwap[0].name && columnsSwap[0].name === columnsSwap[columnsSwap.length - 1].name && j === (stage.children.length - 1)) {
      pushSwapToResult(result, columnsSwap)
    } else if (stage.children[j].children[i].name !== columnsSwap[0].name && columnsSwap.length < 3) {
      columnsSwap.shift();
    }
    return columnsSwap
  }

  function checkRowsAndCols(stage, result) {
    stage.children.forEach((container, i) => {
      if (!container.children) {
        return;
      }

      let rowsSwap = [];
      let columnsSwap = [];

      container.children.forEach((bitmap, j, container) => {
        rowsSwap = checkRows(container, bitmap, j, rowsSwap, result);
        columnsSwap = checkColumns(container, bitmap, j, i, columnsSwap, result);
      })
    });
  }

  function checkStage() {
    const result = [];
    if (!stage?.children) return;
    checkRowsAndCols(stage, result)

    if (result.length !== 0) {
      score += new Set(result.flat()).size;
      updateScore(score)

      slideDownJewels(result);
      setTimeout(() => {
        stage.addEventListener("tick", checkStage);
      }, TIMEOUT)

      return true;
    }

    stage.removeEventListener("tick", checkStage);

    return false;
  }

  function slideDownJewels(result) {

    for (let i = 0; i < result.length; i++) {
      for (let j = 0; j < result[i].length; j++) {
        const num = result[i][j].CoordinateY;
        for (let x = num; 0 <= x; x--) {
          if (x === 0) {
            stage.children[x].children[result[i][j].CoordinateX] = new GenerateNewJewel(x, result[i][j].CoordinateX);
            stage.children[x].children[result[i][j].CoordinateX].y -= 100;

            createjs.Tween.get(stage.children[x].children[result[i][j].CoordinateX], {loop: false}, true)
              .to({x: result[i][j].CoordinateX * 100, y: x * 100}, JEM_SWITCH_TIME, createjs.Ease.Ease);
            continue;
          }

          stage.children[x].removeChildAt(result[i][j].CoordinateX);
          stage.children[x].addChildAt(stage.children[(x - 1)].children[result[i][j].CoordinateX].clone(), result[i][j].CoordinateX);
          stage.children[x].children[result[i][j].CoordinateX].CoordinateY = stage.children[(x - 1)].children[result[i][j].CoordinateX].CoordinateY + 1;
          stage.children[x].children[result[i][j].CoordinateX].CoordinateX = stage.children[(x - 1)].children[result[i][j].CoordinateX].CoordinateX;

          createjs.Tween.get(stage.children[x].children[result[i][j].CoordinateX], {loop: false}, true)
            .to({
              x: stage.children[(x - 1)].children[result[i][j].CoordinateX].CoordinateX * 100,
              y: (stage.children[(x - 1)].children[result[i][j].CoordinateX].CoordinateY + 1) * 100
            }, JEM_SWITCH_TIME, createjs.Ease.Ease);

          stage.children[x].children[result[i][j].CoordinateX].cursor = "pointer";

          const hit = new createjs.Shape();
          hit.graphics.beginFill(COLOR_BLACK).drawRect(0, 0, stage.children[x].children[result[i][j].CoordinateX].getBounds().width, stage.children[x].children[result[i][j].CoordinateX].getBounds().height);
          stage.children[x].children[result[i][j].CoordinateX].hitArea = hit;

          stage.children[x].children[result[i][j].CoordinateX].addEventListener('click', jewelClick);
        }
      }
    }
    setTimeout(() => {
      checkStage()
    }, TIMEOUT)
  }


  function replaceJewels(target, select) {
    const selectedCoordinateX = select[0].CoordinateX;
    const selectedCoordinateY = select[0].CoordinateY;
    const targetCoordinateX = target.CoordinateX;
    const targetCoordinateY = target.CoordinateY;

    createjs.Tween.get(select[0], {loop: false}, true)
      .to({x: targetCoordinateX * 100, y: targetCoordinateY * 100}, JEM_SWITCH_TIME, createjs.Ease.Ease);

    createjs.Tween.get(target, {loop: false}, true)
      .to({x: selectedCoordinateX * 100, y: selectedCoordinateY * 100}, JEM_SWITCH_TIME, createjs.Ease.Ease)
      .call(function () {
        select[0].CoordinateX = targetCoordinateX;
        select[0].CoordinateY = targetCoordinateY;
        target.CoordinateX = selectedCoordinateX;
        target.CoordinateY = selectedCoordinateY;

        stage.children[target.CoordinateY].children[target.CoordinateX] = target;
        stage.children[select[0].CoordinateY].children[select[0].CoordinateX] = select[0];

        if (!checkStage()) {
          setTimeout(() => {
            replaceJewelsBack(target, select, targetCoordinateX, targetCoordinateY, selectedCoordinateX, selectedCoordinateY);
          }, JEM_SWITCH_TIMEOUT);
        }
      });
  }

  function replaceJewelsBack(target, select, targetCoordinateX, targetCoordinateY, selectedCoordinateX, selectedCoordinateY) {
    createjs.Tween.get(target, {loop: false}, true)
      .to({x: targetCoordinateX * 100, y: targetCoordinateY * 100}, JEM_SWITCH_TIME, createjs.Ease.Ease);

    createjs.Tween.get(select[0], {loop: false}, true)
      .to({x: selectedCoordinateX * 100, y: selectedCoordinateY * 100}, JEM_SWITCH_TIME, createjs.Ease.Ease);

    target.CoordinateX = targetCoordinateX;
    target.CoordinateY = targetCoordinateY;
    select[0].CoordinateX = selectedCoordinateX;
    select[0].CoordinateY = selectedCoordinateY;
    stage.children[target.CoordinateY].children[target.CoordinateX] = target;
    stage.children[select[0].CoordinateY].children[select[0].CoordinateX] = select[0];
  }

  function initLoader(manifest) {
    loader = new createjs.LoadQueue(false);
    loader.addEventListener("complete", handleComplete);
    loader.loadManifest(manifest);
    loader.load();
  }

  function initHelperLoader(helperImages) {
    helper_loader = new createjs.LoadQueue(false);
    helper_loader.loadManifest(helperImages);
    helper_loader.load();
  }

  function handleComplete() {
    document.getElementById("loader").className = "";
    stage = new createjs.Stage("testCanvas");

    createjs.Ticker.addEventListener("tick", stage);
    createjs.Touch.enable(stage);
    stage.mouseEventsEnabled = true;

    stage.enableMouseOver();
    fillLevel();
    stage.addEventListener("tick", checkStage);
  }

  function fillLevel() {
    for (let i = 0; i < 8; i++) {
      const container = new createjs.Container();
      for (let j = 0; j < 8; j++) {
        container.addChild(new GenerateNewJewel(i, j));
      }
      stage.addChild(container);
    }
  }

  function clearCheatCache() {
    if (!cheatCache.length) {
      return;
    }
    cheatCache.forEach((item) => stage.removeChild(item))
    cheatCache = [];
  }

  function findMove() {
    clearCheatCache();

    let elem = findOptions();
    if (!elem) {
      alert('Game over');
      return;
    }
    cheatCache.push(drawFrame(elem))
  }

  function initFindMove() {
    document.getElementById('findMove').addEventListener('click', findMove)
  }

  return {
    init: function () {
      initLoader(images);
      initHelperLoader(helperImages);
      checkStage();
      defineScoreElement();
      updateScore(score);
      initFindMove();
    }
  }
})();

document.addEventListener('DOMContentLoaded', jewels.init);
