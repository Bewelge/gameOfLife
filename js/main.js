var descrText = ""
var cnv1 = null;
var cnv = null;
var cnvT = null;
var ctxT = null;
var ctx = null;
var ctx1 = null;
var dt1 = null;
var cnvW = 0;
var cnvH = 0;
var theImg = null;
var cnvBG = null;
var ctxBG = null;
var cnvFG = null;
var ctxFG = null;
var dt = null;
var highestMSE = 0;
const gpu = new GPU();
var getMSEGPU;
var doAStep;
var doAStepLevelColors;
var doAStepMod2
var render;
var superKernel;
var tickSpeed = 50;
var mouseDown = false;
var mouseX = 0;
var mouseY = 0;
var lastMouseX = 0;
var lastMouseY = 0;
var presetArray = [];
var presetOn = false;
var presetCnv = false;
var presetTileW = 0;
var presetTileH = 0;
var presets = [];
var selectedPreset;
var defaultW = 5;
var defaultH = 5;
var presetMx;
var presetMy;
var started = false;
var mouseX = 0;
var mouseY = 0;
var lastTick = 0;
var ticker = 0;
var theLoop = null;
var changed = true;
var dummyContext = document.createElement("canvas");
var shapeMons = 5;
var magnify = false;
var mainResolution = 4;
var tilesW = 100;
var tilesH = 100;


function start() {
    width = window.innerWidth || document.documentElement.clientWidth / 1 || document.body.clientWidth / 1;
    height = window.innerHeight || document.documentElement.clientHeight / 1 || document.body.clientHeight / 1;
    width = Math.floor(width);
    height = Math.floor(height);
    cnvW = Math.floor(width * 0.7); 
    cnvH = Math.floor(height * 0.65); 
    tilesW = Math.floor(cnvW / mainResolution);
    tilesH = Math.floor(cnvH / mainResolution);
    hlfSize = Math.floor(Math.min(width, height) / 2);
    qrtSize = Math.floor(hlfSize / 2);

    

    let descr = createDiv("descr", "description");
    descr.innerHTML = descrText;
    descr.style.position = "absolute";
    descr.style.maxWidth = "70%";
    descr.style.maxHeight = "65%";
    descr.style.minWidth = "70%";
    descr.style.minHeight = "65%";
    descr.style.left = "2.5%";
    descr.style.top = "7.5%";
    descr.style.zIndex = 10;
    descr.style.display = "none";
    document.body.appendChild(descr);



    let topTitle = createDiv("title", "title");
    topTitle.style.position = "absolute";
    topTitle.style.top = "0px";
    topTitle.style.left = "2.5%";
    topTitle.style.width = "75%";
    topTitle.innerHTML = "Conways Game of Life";
    document.body.appendChild(topTitle);

    let cnvWrap = createDiv("cnvWrap", "mainPanel");
    cnvWrap.style.position = "absolute";
    cnvWrap.style.maxWidth = "70%";
    cnvWrap.style.maxHeight = "65%";
    cnvWrap.style.minWidth = "70%";
    cnvWrap.style.minHeight = "65%";
    cnvWrap.style.left = "2.5%";
    cnvWrap.style.top = "10%";
    cnvWrap.style.overflow = "scroll";

    cnvBG = document.createElement("canvas");
    cnvBG.width = cnvW;
    cnvBG.height = cnvH;
    cnvBG.style.left = "0px"; 
    cnvBG.style.top = "0px"; 
    cnvBG.style.position = "absolute";
    cnvBG.style.zIndex = 2;
    cnvBG.id = "BG";
    ctxBG = cnvBG.getContext("2d");

    document.body.addEventListener("mousemove", mouseMove);
    cnvBG.addEventListener("mousedown", mouseClick);
    document.body.addEventListener("mouseup", mouseUp);
    cnvWrap.appendChild(cnvBG);

    cnvFG = document.createElement("canvas");
    cnvFG.width = cnvW;
    cnvFG.height = cnvH;
    cnvFG.style.left = "0px"; 
    cnvFG.style.top = "0px"; 
    cnvFG.style.position = "absolute";
    cnvFG.style.zIndex = 3;
    cnvFG.style.pointerEvents = "none";
    cnvFG.id = "FG";
    ctxFG = cnvFG.getContext("2d");
    cnvWrap.appendChild(cnvFG);


    document.body.appendChild(cnvWrap);

    
    let rightSide = createDiv("rightSide", "rightSide mainPanel");
    rightSide.style.right = "5%";
    rightSide.style.height = "65%"; { 
        let runBut = createDiv("run", "button buttonBig");
        runBut.innerHTML = "Run";
        runBut.addEventListener("click", function() {
            if (!started) {
                run();
                runBut.innerHTML = "Pause";
            } else {
                theLoop = null;
             
                changed = true;
                started = false;
                runBut.innerHTML = "Run";
            }

        })
        rightSide.appendChild(runBut);
    }

    { //resetBut
        let resetBut = createDiv("reset", "button buttonBig");
        resetBut.innerHTML = "Clear";
        resetBut.addEventListener("click", function() {

            theLoop = null;
            emptyGameArray();
            changed = true;
            started = false;
            document.getElementById("run").innerHTML = "Run";


        })
        rightSide.appendChild(resetBut);
    }
    rightSide.appendChild(createDiv("divider", "divider")); { //setSize


        let setSize = createDiv("setSize", "setSize");

        let confSizeTitle = createDiv("confSizeTitle");
        confSizeTitle.innerHTML = "<b>Set World Size</b>";
        confSizeTitle.style.textAlign = "center";
        setSize.appendChild(confSizeTitle);

        let row1 = createDiv("row1");
        let labX = document.createElement("label");
        /*labX.style.float="left";*/
        labX.innerHTML = "width &nbsp(px):&nbsp";
        let inpX = document.createElement("input");
        /*inpX.style.float = "right";*/
        inpX.type = "number";
        inpX.max = 1500;
        inpX.min = 1;
        inpX.value = cnvW;

        labX.appendChild(inpX);
        row1.appendChild(labX);
        setSize.appendChild(row1);

        let row2 = createDiv("row2");
        let labY = document.createElement("label");
        /*labY.style.float="left";*/
        labY.innerHTML = "</br>height  (px):&nbsp";
        let inpY = document.createElement("input");
        /*inpY.style.float = "right";*/
        inpY.type = "number";
        inpY.max = 1500;
        inpY.min = 1;
        inpY.value = cnvH;

        labY.appendChild(inpY);
        row2.appendChild(labY);
        setSize.appendChild(row2);

        let confSize = createDiv("confSize", "button");
        confSize.innerHTML = "Confirm";
        confSize.addEventListener("click", function() {
            setWorldSize(inpX.value, inpY.value);
        })
        setSize.appendChild(confSize);
        rightSide.appendChild(setSize);
    }

    rightSide.appendChild(createDiv("divider", "divider")); { //setSpeed

        let setSpeed = createDiv("setSpeed", "setSpeed");
        setSpeed.style.textAlign = "center";

        let spdL = document.createElement("label");
        spdL.innerHTML = "<b>Tick-Speed: </b>";

        let spd = document.createElement("input");
        spd.type = "range";
        spd.max = 1500;
        spd.min = 5;
        spd.value = tickSpeed;
        let val = createDiv("tSpeedVal");
        val.innerHTML = tickSpeed + "(ms)";


        spd.addEventListener("change", function() {
            if (spd.value > 0 && !isNaN(spd.value)) {
                tickSpeed = spd.value;
                val.innerHTML = tickSpeed + "(ms)";
            }
        })

        spdL.appendChild(spd);
        setSpeed.appendChild(spdL);
        setSpeed.appendChild(val);

        rightSide.appendChild(setSpeed);
    }
    /* rightSide.appendChild(createDiv("divider", "divider")); { //setResolution

         let setReso = createDiv("setReso", "setReso");
         setReso.style.textAlign = "center";

         let resL = document.createElement("label");
         resL.innerHTML = "<b>Resolution: </b>";

         let res = document.createElement("input");
         res.type = "range";
         res.max = 16;
         res.min = 1;
         res.value = mainResolution;
         let val = createDiv("tResVal");
         val.innerHTML = "x"+mainResolution;


         res.addEventListener("change", function() {
             if (res.value > 0 && !isNaN(res.value)) {
                 mainResolution = res.value;
                 val.innerHTML = "x"+ mainResolution;
             }
         })

         resL.appendChild(res);
         setReso.appendChild(resL);
         setReso.appendChild(val);

         rightSide.appendChild(setReso);
     }*/

    rightSide.appendChild(createDiv("divider", "divider")); { //magnifyier
        let inpWrap = createDiv("inpWrap");

        let inpTitle = createDiv("inpTitle");
        inpTitle.innerHTML = "<b>Magnify: </b>";
        inpTitle.style.textAlign = "center";

        let sel = document.createElement("select");
        sel.name = "magnify";
        sel.style.width = "100%";
        sel.addEventListener("change", function(that) {
            magnify = that.target.value;
        })

        let inpFalse = document.createElement("option");
        inpFalse.value = "false";
        inpFalse.innerHTML = "Off";

        let inpSqu = document.createElement("option");
        inpSqu.value = "square";
        inpSqu.innerHTML = "Square";

        let inpCirc = document.createElement("option");
        inpCirc.value = "round";
        inpCirc.innerHTML = "Round";

        sel.appendChild(inpFalse);
        sel.appendChild(inpSqu);
        sel.appendChild(inpCirc);


        let wrap = document.createElement("div");


        let labStr = document.createElement("div");
        labStr.style.textAlign = "center";
        labStr.innerHTML = "Strength : x" + magnifyStr + "";

        let magStr = document.createElement("input");
        magStr.type = "range";
        magStr.value = magnifyStr;
        magStr.min = 1;
        magStr.max = 8;
        magStr.steps = 1;
        magStr.addEventListener("change", function(that) {
            magnifyStr = magStr.value;
            labStr.innerHTML = "Strength : x" + magnifyStr + "";
        })

        wrap.appendChild(labStr);
        wrap.appendChild(magStr);


        let wrap2 = document.createElement("div");


        let labSiz = document.createElement("div");
        labSiz.innerHTML = "Zoom-Radius : " + zoomRadius + "px";
        labSiz.style.textAlign = "center";
        let magSiz = document.createElement("input");
        magSiz.type = "range";
        magSiz.value = zoomRadius;
        magSiz.min = 5;
        magSiz.max = 150;
        magSiz.steps = 5;
        magSiz.addEventListener("change", function(that) {
            zoomRadius = magSiz.value;
            labSiz.innerHTML = "Zoom-Radius : " + zoomRadius + "px";
        })

        wrap2.appendChild(labSiz);
        wrap2.appendChild(magSiz);

        inpWrap.appendChild(inpTitle);
        inpWrap.appendChild(sel);
        inpWrap.appendChild(wrap);
        inpWrap.appendChild(wrap2);
        rightSide.appendChild(inpWrap);
    }

    document.body.appendChild(rightSide);
    
    let outerPreset = createDiv("outerPreset", "outerPreset mainPanel");
    outerPreset.style.left = "2.5%";
    outerPreset.style.width = "92.5%";
    let presetWrap = createDiv("presetWrap", "presetWrap");
    let openPrBut = createDiv("openPresets", "button");
    openPrBut.innerHTML = "Create New Preset";
    openPrBut.addEventListener("click", openPresetMaker);
    outerPreset.appendChild(presetWrap);
   
    document.body.appendChild(outerPreset);
    document.body.appendChild(openPrBut);
    initPresets();

    emptyGameArray();

    

    
    initKernels();
    
    tick();

}

//recreate Canvases and Kernels.
function setWorldSize(w, h) {
    if (w < 1 || h < 1 ||  w > 2000 || h > 2000 ||  isNaN(w) || isNaN(h)) {
        return;
    }
    $(cnvBG).remove();
    $(cnvFG).remove();

    cnvW = parseInt(w);
    cnvH = parseInt(h);

    cnvBG = document.createElement("canvas");
    cnvBG.width = cnvW;
    cnvBG.height = cnvH;
    cnvBG.style.left = width * 0.7 / 2 - cnvW / 2 + "px";
    cnvBG.style.top = height * 0.65 / 2 - cnvH / 2 + "px";
    cnvBG.style.position = "absolute";
    cnvBG.style.zIndex = 2;
    cnvBG.id = "BG";
    ctxBG = cnvBG.getContext("2d");
    document.body.addEventListener("mousemove", mouseMove);
    cnvBG.addEventListener("mousedown", mouseClick);
    document.body.addEventListener("mouseup", mouseUp);
    document.getElementById("cnvWrap").appendChild(cnvBG);

    cnvFG = document.createElement("canvas");
    cnvFG.width = cnvW;
    cnvFG.height = cnvH;
    cnvFG.style.left = width * 0.7 / 2 - cnvW / 2 + "px";
    cnvFG.style.top = height * 0.65 / 2 - cnvH / 2 + "px";
    cnvFG.style.position = "absolute";
    cnvFG.style.zIndex = 3;
    cnvFG.style.pointerEvents = "none";
    cnvFG.id = "FG";
    ctxFG = cnvFG.getContext("2d");
    document.getElementById("cnvWrap").appendChild(cnvFG);

    emptyGameArray();

    initKernels();
    changed = true;
}

function initKernels() {

    doAStep = gpu.createKernel(function(arr) {

        if (arr[this.thread.y][this.thread.x] == 0) {
            let liv = 0;
            let lv = arr[this.thread.y][this.thread.x];


            if (arr[this.thread.y][this.thread.x + 1] == 1) {
                liv++;
            }
            if (arr[this.thread.y][this.thread.x - 1] == 1) {
                liv++;
            }
            if (arr[this.thread.y - 1][this.thread.x - 1] == 1) {
                liv++;
            }
            if (arr[this.thread.y - 1][this.thread.x + 1] == 1) {
                liv++;
            }
            if (arr[this.thread.y + 1][this.thread.x - 1] == 1) {
                liv++;
            }
            if (arr[this.thread.y + 1][this.thread.x + 1] == 1) {
                liv++;
            }
            if (arr[this.thread.y - 1][this.thread.x] == 1) {
                liv++;
            }
            if (arr[this.thread.y + 1][this.thread.x] == 1) {
                liv++;
            }

            if (liv == 3) {
                return 1;
            } else {
                return 0;

            }
        } else {
            let liv = 0;

            if (arr[this.thread.y][this.thread.x + 1] == 1) {
                liv++;
            }
            if (arr[this.thread.y][this.thread.x - 1] == 1) {
                liv++;
            }
            if (arr[this.thread.y - 1][this.thread.x - 1] == 1) {
                liv++;
            }
            if (arr[this.thread.y - 1][this.thread.x + 1] == 1) {
                liv++;
            }
            if (arr[this.thread.y + 1][this.thread.x - 1] == 1) {
                liv++;
            }
            if (arr[this.thread.y + 1][this.thread.x + 1] == 1) {
                liv++;
            }
            if (arr[this.thread.y - 1][this.thread.x] == 1) {
                liv++;
            }
            if (arr[this.thread.y + 1][this.thread.x] == 1) {
                liv++;
            }

            if (liv == 2) {
                return 1;
            } else if (liv == 3) {
                return 1;
            } else {
                return 0;
            }
        }
    }).setOutput([tilesW, tilesH]);
}

function render() {
    ctxBG.fillStyle = "rgba(255,255,255,1)";
    ctxBG.fillRect(0, 0, cnvW, cnvH);
    ctxBG.fillStyle = "rgba(0,0,0,1)";
    for (let i = 0; i < tilesW * tilesH; i++) {
        try {
            if (gameArray[Math.floor(i / tilesW)][i % tilesW]) {
                ctxBG.fillRect(i % tilesW * mainResolution, (tilesH - 1 - Math.floor(i / tilesW)) * mainResolution, mainResolution, mainResolution);
            }
        } catch (e) {
        }
    }
}

function draw() {
    let dt = ctxBG.getImageData(0, 0, cnvW, cnvH);
    dt.data = render(dt.data);
    ctxBG.putImageData(dt, 0, 0);
}

function createPresetDiv(aPreset, ind) {
    let div = createDiv("presetDiv" + ind, "presetDiv");

    let tit = createDiv("presetDivT" + ind, "presetDivT");
    tit.innerHTML = aPreset.name + "</br> (" + aPreset.width + "x" + aPreset.height + ")";
    let c = document.createElement("canvas");
    let ct = c.getContext("2d");
    ct.fillStyle = "black";
    c.width = 50;
    c.height = 50;
    let adjArr = [];
    let arr = aPreset.dots;
    let minX = 0;
    let minY = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][0] < minX) {
            minX = arr[i][0];
        }
        if (arr[i][1] < minY) {
            minY = arr[i][1];
        }
    }
    minX *= -1;
    minY *= -1;

    for (let i = 0; i < arr.length; i++) {
        adjArr.push([arr[i][0] + minX, arr[i][1] + minY])

    }

    let tW = 50 / (2 + Math.max(aPreset.width, aPreset.height));
    for (let i = 0; i < aPreset.dots.length; i++) {
        let x = tW + adjArr[i][0] * tW;
        let y = tW + adjArr[i][1] * tW;
        ct.fillRect(x, y, tW, tW);
    }
    div.addEventListener("click", function() {
        selectedPreset = aPreset;
        $(".presetDiv").removeClass("selected");
        $("#presetDiv" + ind).addClass("selected");
    }, ind)
    div.appendChild(tit);
    div.appendChild(c);
    return div;

}

function savePreset(name) {
    let points = [];
    /*let mx = Math.ceil(presetArray[0].length/2);
    let my = Math.ceil(presetArray.length/4);*/
    /*for (let i = 0;i<presetArray.length;i++) {
        for(let j = 0;j<presetArray[0].length;j++) {
            if (presetArray[i][j]==1) {
                points.push([j-mx,i-my]);
            }
        }
    }*/
    createPreset(presetArray, name);
    document.getElementById("presetWrap").appendChild(createPresetDiv(presets[presets.length - 1], presets.length - 1));
    presetOn = false;
    $("#presetMaker").remove();
    $("#rightSide").fadeIn();
    //presets.push(new preset(presetArray[0].length,presetArray.length,points));
}

function emptyPresetArray() {
    if (presetArray.length > 1) {
        defaultH = presetArray.length
        if (presetArray[0].length > 1) {
            defaultW = presetArray[0].length
        } else {
            defaultW = 5;
        }
    } else {
        defaultH = 5;
    }
    presetArray = [];

    for (let i = 0; i < defaultH; i++) {
        presetArray.push([]);
        for (let j = 0; j < defaultW; j++) {
            presetArray[i].push(0);
        }
    }

}
var preset = function(w, h, arr, name) {
    /* let minX = 0;
     let minY = 0;
     for (let i = 0;i<arr.length;i++) {
         if (arr[i][0]<minX) {
             minX = arr[i][0];
         }
         if (arr[i][1]<minY) {
             minY = arr[i][1];
         }
     }
     minX*= -1;
     minY*= -1;
     if(minX!=0 || minY != 0) {
         for (let i = 0;i<arr.length;i++) {
             arr[i][0]+=minX
             arr[i][1]+=minY
         }
     } */
    this.width = w;
    this.height = h;
    this.dots = arr;
    this.name = name;
}

//selectedPreset=new preset(1,1,[[0,0]]);
function selectPreset(preset) {
    selectedPreset = preset;
}

function increasePresetW() {
    for (let i = 0; i < presetArray.length; i++) {
        presetArray[i].push(0);
    }
    refreshPreset();
}

function increasePresetH() {
    let w = presetArray[0].length;
    let row = []
    for (let i = 0; i < w; i++) {
        row.push(0);
    }
    presetArray.push(row);
    refreshPreset();
}

function addPreset(arr, preset, x, y) {
    ctxBG.fillStyle = "black";
    for (let p = 0; p < preset.dots.length; p++) {
        try {
            let x1 = Math.floor(x / mainResolution) + preset.dots[p][0];
            let y1 = Math.floor((cnvH - 1 - y) / mainResolution) + preset.dots[p][1];
            if (arr.length < y1 || arr[0].length < x1) {
                return;
            }
            arr[y1][x1] = 1;
            ctxBG.fillRect(Math.floor(x1 * mainResolution), Math.floor((tilesH - 1 - y1) * mainResolution), mainResolution, mainResolution);
        } catch (e) {
        }
    }

}

function addPresetFG(arr, preset, x, y) {
    ctxFG.fillStyle = "rgba(0,0,0,0.5)";
    for (let p = 0; p < preset.dots.length; p++) {
        try {
            let mg = 1;
            if (magnify == "round" || magnify == "square") {
                mg = magnifyStr;
            }
            let x1 = Math.floor(x / mainResolution) + preset.dots[p][0] * mg;
            let y1 = Math.floor((cnvH - 1 - y) / mainResolution) + preset.dots[p][1] * mg;
            ctxFG.fillRect(x1 * mainResolution, (tilesH - 1 - y1) * mainResolution, mainResolution * mg, mainResolution * mg);
        } catch (e) {
        }
    }

}

function createPreset(pixelBox, name) {
    let w = pixelBox[0].length;
    let h = pixelBox.length;
    let arr = [];
    let mx = Math.ceil(pixelBox[0].length / 2);
    let my = Math.ceil(pixelBox.length / 2);
    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            if (pixelBox[i][j] == 1) {
                arr.push([j - mx, i - my]);
            }
        }
    }
    if (!name) {
        name = generateName();
    }
    presets.push(new preset(w, h, arr, name))
}


function openPresetMaker() {
    if (presetOn) return;
    presetOn = true;
    $("#rightSide").fadeOut();
    let preSetMaker = createDiv("presetMaker", "presetMaker");
    preSetMaker.style.position = "absolute";
    preSetMaker.style.left = Math.floor(width * 0.75 / 2 - cnvW / 2) + "px";
    preSetMaker.style.top = Math.floor(height * 0.85 / 2 - cnvH / 2) + "px";
    preSetMaker.style.width = cnvW + "px";
    preSetMaker.style.height = cnvH + "px";
    preSetMaker.style.backgroundColor = "rgba(255,255,255,1)";
    preSetMaker.style.zIndex = "5";
    emptyPresetArray();

    let cnvSizeW = Math.min(Math.ceil(cnvW * 0.8), Math.ceil(cnvH * 0.8));
    let cnvSizeH = cnvSizeW;

    presetCnv = document.createElement("canvas");
    presetCnv.width = cnvSizeW;
    presetCnv.height = cnvSizeH;
    presetCnv.style.float = "left";
    presetCnv.addEventListener("mousemove", presetMove)
    presetCnv.addEventListener("click", presetClick)
    preSetMaker.appendChild(presetCnv);

    presetTileW = cnvSizeW / presetArray[0].length;
    presetTileH = cnvSizeH / presetArray.length;

    presetTileW = Math.min(presetTileW, presetTileH);
    presetTileH = presetTileW;


    { //+ - Columns
        let colPM = createDiv("colPM");

        colPM.style.height = Math.min(cnvSizeW, cnvSizeH) + "px";
        colPM.style.width = Math.floor(cnvSizeW * 0.15) + "px";
        colPM.style.marginLeft = Math.floor(cnvW * 0.05) + "px";
        colPM.style.float = "left";
        let colM = createDiv("colM", "incDecV");
        colM.style.float = "left";
        colM.innerHTML = "-";
       

        let filler = createDiv("filler");
        filler.style.float = "left";
        filler.style.width = "10px";
        filler.style.height = Math.min(cnvSizeW, cnvSizeH) / 2 - 40 + "px";

        let cols = createDiv("cols");
        cols.style.float = "left";
        cols.style.textAlign = "center";
        cols.style.height = Math.min(cnvSizeW, cnvSizeH) / 2 - 40 + "px";
        cols.innerHTML = "Columns";

        let colP = createDiv("colP", "incDecV");
        colP.style.float = "left";
        colP.innerHTML = "+";
        colP.addEventListener("click", increasePresetW);

        colPM.appendChild(colP);
        colPM.appendChild(filler);
        colPM.appendChild(cols);
        colPM.appendChild(colM);

        preSetMaker.appendChild(colPM);

    } { //+ - Rows
        let rowPM = createDiv("rowPM");

        rowPM.style.width = Math.min(cnvSizeW, cnvSizeH) + "px";
        rowPM.style.height = Math.floor(cnvH * 0.15) + "px";
        rowPM.style.marginTop = Math.floor(cnvH * 0.05) + "px";
        let rowM = createDiv("rowM", "incDec");
        rowM.style.float = "left";
        rowM.innerHTML = "-";
    

        let rows = createDiv("rows");
        rows.style.float = "left";
        rows.style.textAlign = "center";
        rows.style.width = Math.min(cnvSizeW, cnvSizeH) - 64 + "px";
        rows.innerHTML = "Rows";

        let rowP = createDiv("rowP", "incDec");
        rowP.style.float = "left";
        rowP.innerHTML = "+";
        rowP.addEventListener("click", increasePresetH);

        rowPM.appendChild(rowM);
        rowPM.appendChild(rows);
        rowPM.appendChild(rowP);

        preSetMaker.appendChild(rowPM);

    }

    let prName = document.createElement("input");
    prName.value = generateName();
    let saveBut = createDiv("save", "button");
    saveBut.style.float = "right";
    saveBut.innerHTML = "Save Preset";
    saveBut.addEventListener("click", function() {
        savePreset(prName.value);
    })
    preSetMaker.appendChild(saveBut);



    document.body.appendChild(preSetMaker)
}

function generateName() {
    let j = 0;
    let name = "Custom_Preset_" + j;
    while (checkIfNameExists(name)) {
        j++;
        name = "Custom_Preset_" + j;
    }
    return name;
}

function checkIfNameExists(name) {
    for (var i = 0; i < presets.length; i++) {
        if (presets[i].name == name) {
            return true;
        }
    }
    return false;
}

function refreshPreset() {
    let cnvSize = Math.min(Math.ceil(cnvW * 0.8), Math.ceil(cnvH * 0.8))
    presetTileW = cnvSize / presetArray[0].length;
    presetTileH = cnvSize / presetArray.length;

    presetTileW = Math.min(presetTileW, presetTileH);
    presetTileH = presetTileW;
}


function presetMove(ev) {
    let rec = presetCnv.getBoundingClientRect();
    presetMx = ev.clientX - rec.left;
    presetMy = ev.clientY - rec.top;
}

function presetClick(ev) {
    ev.preventDefault();
    let rec = presetCnv.getBoundingClientRect();
    presetMx = ev.clientX - rec.left;
    presetMy = ev.clientY - rec.top;
    let x = Math.floor(presetMx / presetTileW);
    let y = Math.floor(presetMy / presetTileH);
    for (let i = 0; i < selectedPreset.dots.length; i++) {
        try {
            if (presetArray[y + selectedPreset.dots[i][1]][x + selectedPreset.dots[i][0]] == 1) {
                presetArray[y + selectedPreset.dots[i][1]][x + selectedPreset.dots[i][0]] = 0;
            } else if (presetArray[y + selectedPreset.dots[i][1]][x + selectedPreset.dots[i][0]] == 0) {
                presetArray[y + selectedPreset.dots[i][1]][x + selectedPreset.dots[i][0]] = 1;
            }
        } catch (e) {
            //outofbounds
        }
    }
}

function emptyGameArray() {
    gameArray = [];
    for (let i = 0; i < tilesH  ; i++) {
        gameArray.push([]);
        for (let j = 0; j < tilesW  ; j++) {
            gameArray[i].push(0);
        }
    }

}

function mouseMove(ev) {
    let rect = cnvBG.getBoundingClientRect();
    mouseX = Math.round(ev.clientX - rect.left);
    mouseY = Math.round(ev.clientY - rect.top);
}

function mouseClick(ev) {

    lastMouseX = mouseX;
    lastMouseY = mouseY;
    mouseDown = true;
}

function mouseUp(ev) {
    mouseDown = false;
    if (ev.target.id == "bg") {

    }
}



function initPresets() {
    presets.push(new preset(1, 1, [
        [0, 0]
    ], "Dot"));
    selectPreset(presets[0]);

    presets.push(new preset(3, 3, [
        [0, 0],
        [-1, 0],
        [1, 0],
        [0, 1],
        [-1, 1],
        [1, 1],
        [0, -1],
        [-1, -1],
        [1, -1],
    ], "Dot"));

    presets.push(new preset(3, 15, [
        [0, 0],
        [0, 1],
        [0, 2],
        [-1, 2],
        [+1, 2],
        [0, 5],
        [-1, 5],
        [+1, 5],
        [0, 6],
        [0, 7],

        [0, -0],
        [0, -1],
        [0, -2],
        [-1, -2],
        [+1, -2],
        [0, -5],
        [-1, -5],
        [+1, -5],
        [0, -6],
        [0, -7]
    ], "Colum"));
    presets.push(new preset(3, 15, [
        [0, 0],
        [0, 1],
        [0, 2],
        [-1, 2],
        [+1, 2],
        [0, 5],
        [-1, 5],
        [+1, 5],
        [0, 6],
        [0, 7],

        [0, -1],
        [0, -2],
        [0, -3],
        [-1, -3],
        [+1, -3],
        [0, -5],
        [-1, -5],
        [+1, -5],
        [0, -6],
        [0, -7],

    ], "Angel"));
    presets.push(new preset(13, 13, [
        [-1, -2],
        [-1, -3],
        [-1, -4],

        [+1, -2],
        [+1, -3],
        [+1, -4],

        [-1, +2],
        [-1, +3],
        [-1, +4],

        [+1, +2],
        [+1, +3],
        [+1, +4],

        [-2, -1],
        [-3, -1],
        [-4, -1],

        [-2, +1],
        [-3, +1],
        [-4, +1],

        [+2, -1],
        [+3, -1],
        [+4, -1],

        [+2, +1],
        [+3, +1],
        [+4, +1],

        [-6, -2],
        [-6, -3],
        [-6, -4],

        [+6, -2],
        [+6, -3],
        [+6, -4],

        [-6, +2],
        [-6, +3],
        [-6, +4],

        [+6, +2],
        [+6, +3],
        [+6, +4],

        [-2, -6],
        [-3, -6],
        [-4, -6],

        [-2, +6],
        [-3, +6],
        [-4, +6],

        [+2, -6],
        [+3, -6],
        [+4, -6],

        [+2, +6],
        [+3, +6],
        [+4, +6],

    ], "Pulsar"));
    presets.push(new preset(3, 3, [
        [0, 0],
        [-1, 0],
        [-2, 0],
        [0, -1],
        [-1, -2]

    ], "Glider"));
    presets.push(new preset(3, 3, [
        [0, 0],
        [1, 0],
        [2, 0],
        [0, 1],
        [1, 2]

    ], "Glider Reverse"));
    presets.push(new preset(5, 4, [
        [0, 0],
        [0, 1],
        [0, 2],
        [-1, 3],
        [-1, 0],
        [-2, 0],
        [-3, 0],
        [-4, 1],
        [-4, 3],

    ], "Glider2"));
    presets.push(new preset(5, 4, [
        [0, 0],
        [1, 1],
        [0, 2],
        [0, 3],
        [1, 1],
        [2, 2],
        [3, 3],
        [4, 1],
        [4, 3],

    ], "Glider2 Reverse"));
    presets.push(new preset(2, 2, [
        [-1, 0],
        [1, 0],
        [0, 1],
        [0, -1],

    ], "Cross"));
    presets.push(new preset(4, 4, [
        [0, 0],
        [-1, 0],
        [-2, 1],
        [-2, 2],
        [-1, 3],
        [0, 3],
        [1, 2],
        [1, 1],
    ], "Static Object"));

    presets.push(new preset(11, 36, [
        [-1, -18],
        [0, -18],
        [-1, -17],
        [0, -17],
        [-2, -10],
        [-1, -10],
        [0, -10],
        [-3, -9],
        [1, -9],
        [-4, -7],
        [2, -7],
        [-4, -6],
        [-3, -6],
        [1, -6],
        [2, -6],
        [1, -3],
        [2, -3],
        [1, -2],
        [3, -2],
        [3, -1],
        [2, 0],
        [3, 0],
        [-1, 1],
        [-1, 2],
        [2, 2],
        [-1, 3],
        [-2, 6],
        [-1, 6],
        [1, 6],
        [3, 6],
        [4, 6],
        [-2, 8],
        [4, 8],
        [-1, 10],
        [0, 10],
        [2, 10],
        [3, 10],
        [1, 11],
        [1, 16],
        [2, 16],
        [1, 17],
        [2, 17]
    ], "Glider Cannon"));



    let par = document.getElementById("presetWrap");
    for (let i = 0; i < presets.length; i++) {
        par.appendChild(createPresetDiv(presets[i], i));
    }
}

function drawPreset() {
    let ct = presetCnv.getContext("2d");
    ct.clearRect(0, 0, cnvW, cnvH);
    ct.lineWidth = 5;
    ct.strokeStyle = "rgba(100,100,100,0.5)";

    for (let i = 0; i < presetArray.length; i++) {
        for (let j = 0; j < presetArray[0].length; j++) {
            if (presetArray[i][j] == 1) {
                ct.fillStyle = "rgba(0,0,0,0.8)";
                ct.fillRect(j * presetTileW, i * presetTileH, presetTileW, presetTileH);
            }
            ct.strokeRect(j * presetTileW, i * presetTileH, presetTileW, presetTileH);


        }
    }
    for (let i = 0; i < presetArray.length; i++) {
        for (let j = 0; j < presetArray[0].length; j++) {
            //highlight tile under mouse
            if (presetMx > j * presetTileW &&
                presetMx < j * presetTileW + presetTileW &&
                presetMy > i * presetTileH &&
                presetMy < i * presetTileH + presetTileH) {
                ct.fillStyle = "rgba(150,150,150,0.5)";

                for (let p = 0; p < selectedPreset.dots.length; p++) {
                    let x = j + selectedPreset.dots[p][0];
                    let y = i + selectedPreset.dots[p][1];
                    ct.fillRect(x * presetTileW, y * presetTileH, presetTileW, presetTileH);
                }
            }

        }
    }
}
var zoomRadius = 20;

function drawForeGroundZoom() {

    ctxFG.clearRect(0, 0, cnvW, cnvH);



    ctxFG.strokeStyle = "rgba(0,0,0,0.5)";
    ctxFG.lineWidth = "3";
    if (magnify == "round") {
        ctxFG.save();
        ctxFG.beginPath();
        ctxFG.arc(mouseX, mouseY, zoomRadius, 0, Math.PI * 2, 0);
        ctxFG.stroke();
        ctxFG.clip();

        ctxFG.drawImage(cnvBG, mouseX - zoomRadius / magnifyStr, mouseY - zoomRadius / magnifyStr, zoomRadius * 2 / magnifyStr, zoomRadius * 2 / magnifyStr, mouseX - zoomRadius, mouseY - zoomRadius, zoomRadius * 2, zoomRadius * 2);

        ctxFG.closePath();
        ctxFG.restore();
    } else if (magnify == "square") {
        ctxFG.save();
        ctxFG.beginPath();
        ctxFG.rect(mouseX - zoomRadius, mouseY - zoomRadius, zoomRadius * 2, zoomRadius * 2);
        ctxFG.stroke();
        ctxFG.clip();
        ctxFG.drawImage(cnvBG, mouseX - zoomRadius / magnifyStr, mouseY - zoomRadius / magnifyStr, zoomRadius * 2 / magnifyStr, zoomRadius * 2 / magnifyStr, mouseX - zoomRadius, mouseY - zoomRadius, zoomRadius * 2, zoomRadius * 2);

        ctxFG.closePath();
        ctxFG.restore();
    } else {

    }



    
    ctxFG.fillStyle = "rgba(0,0,0,0.2)";
    let zr = 1;
    if (magnify == "square" ||  magnify == "round") {
        zr = Math.min(magnifyStr, zoomRadius / 20);
    }
    ctxFG.beginPath();
    ctxFG.arc(mouseX, mouseY, 20 * zr, 0, Math.PI * 2, 0);
    ctxFG.fill();
    ctxFG.closePath();
    ctxFG.fillStyle = "rgba(250,250,250,0.5)";
   
    ctxFG.fillRect(mouseX - 20 * zr, mouseY, 40 * zr, 1);
    ctxFG.fillRect(mouseX, mouseY - 20 * zr, 1, 40 * zr);
    addPresetFG(gameArray, selectedPreset, mouseX, mouseY);
    

}


var magnifyStr = 2;
var gameArray = [];

function run() {
    ctxBG.clearRect(0, 0, cnvW, cnvH);
    ticker = 0;
    started = true;
}



function nextIteration() {
    //normal conways rules
    gameArray = doAStep(gameArray.slice(0));

    //rules with evolution / different stages
    //gameArray = doAStepLevelColors(gameArray.slice(0))

    //mod2 world (always replicating itself)

    //gameArray = doAStepMod2(gameArray.slice(0))



}



function tick() {
    var now = window.performance.now(); // current time in ms

    var deltaTime = now - lastTick; // amount of time elapsed since last tick

    lastTick = now;


    ticker += deltaTime;
    if (started || changed) {

        render(gameArray);
        changed = false;
    }
    drawForeGroundZoom();
 

    if (mouseX > 0 && mouseX < cnvW && mouseY > 0 && mouseY < cnvH) {
        if (mouseDown) {
            addPreset(gameArray, selectedPreset, mouseX, mouseY);
        } else {
           

        }
    }
   
    if (presetOn) {

        drawPreset();
    }
    let maxTicks = 10;
    while (ticker > tickSpeed) {

        ticker = 0;
        if (started) {
            nextIteration();
        }
    }

    theLoop = window.requestAnimationFrame(tick);

}



function createDiv(id, className, w, h, t, l, mL, mT, abs) {
    let tmpDiv = document.createElement("div");
    tmpDiv.style.width = w;
    tmpDiv.style.height = h;
    tmpDiv.style.marginTop = mT;
    tmpDiv.style.marginLeft = mL;
    tmpDiv.id = id;
    tmpDiv.className = className;
    if (abs) {
        tmpDiv.style.position = "absolute";
    }
    return tmpDiv;
}

function createCanvas(w, h, mL, mT, id, className, L, T, abs) {

    let tmpCnv = document.createElement("canvas");
    tmpCnv.id = id;
    tmpCnv.className = className;
    tmpCnv.width = w;
    tmpCnv.height = h;
    tmpCnv.style.marginTop = mT + "px";
    tmpCnv.style.marginLeft = mL + "px";
    if (abs) {
        tmpCnv.style.position = "absolute";
    }
    return tmpCnv;
}


function hslToRgbString(h, s, l, a) {
    a = Math.floor(a * 100) / 100;
    dummyContext.fillStyle = 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ' )';
    return dummyContext.fillStyle;
}


function getColor(n, a) {


    let h = n * 5 + Math.floor((n * 5) / shapeMons) * 55 + Math.floor(n * 5 / 100) * 30;
    let s = 3 * 50 + n * 5 - Math.floor(n * 5 / 5); 
    let l = 65 - n * 5 * 5 + Math.floor(n * 5 / 5) * 25; 
    return hslToRgbString(h, s, l, a);

}

function Distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}

function angle(p1x, p1y, p2x, p2y) {

    return Math.atan2(p2y - p1y, p2x - p1x);

}

function getColorCanvas(x, y) {
    let imgD = ctx1.getImageData(x, y, 1, 1).data;
    return ("rgba(" + imgD[0] + "," + imgD[1] + "," + imgD[2] + "," + imgD[3] + ")");
}

function getColorCanvasA(x, y, a) {
    let imgD = ctx1.getImageData(x, y, 1, 1).data;
    return ("rgba(" + imgD[0] + "," + imgD[1] + "," + imgD[2] + "," + a + ")");
}

function count(that, arr) {
    let am = 0;
    for (let key in arr) {
        if (that == arr[key]) {
            am++;
        }
    }
    return am;
}

function countUntil(that, arr, key) {
    let am = 0;
    for (let kei = 0; kei < key; kei++) {
        if (that == arr[kei]) {
            am++;
        }
    }
    return am;
}

function countFrom(that, arr, key) {
    let am = 0;
    for (let kei = key + 1; kei < arr.length; kei++) {
        if (that == arr[kei]) {
            am++;
        }
    }
    return am;
}

function getPosForI(i, col, row) {

    let round = Math.ceil(Math.sqrt(i + 1));
    let base = round - round % 2 + 1;
    let end = Math.pow(base, 2) - 1;
    let start = Math.pow(base - 2, 2);
    let shortSide = ((end - start + 1) / 2 - 2) / 2;
    let longSide = shortSide + 2;
    let shift = Math.ceil(base / 2) - 1;
    i -= start;
    if (i < shortSide) {
        col += (-1) * shift;
        row += (Math.floor(shortSide / 2) - i);
    } else if (i < shortSide * 2) {
        i -= shortSide;
        col += (+1) * shift;
        row += (Math.floor(shortSide / 2) - i);
    } else if (i < shortSide * 2 + longSide) {
        i -= shortSide * 2;
        col += (Math.floor(longSide / 2) - i); 
        row += (-1) * shift;
    } else if (i < shortSide * 2 + longSide * 2) {
        i -= (shortSide * 2 + longSide);
        col += (Math.floor(longSide / 2) - i);
        row += (+1) * shift;
    }
    return {
        y: row,
        x: col
    };

}

function getPosForIY(i, col, row) {
    if (i < 3) {
      
        return row - 1 + i
    } else if (i < 6) {
      
        return row - 1 + i
    } else if (i < 7) {
       
        return col + 1
    } else if (i < 8) {
       
        return col - 1
    }
}

function getPosForIX(i, col, row) {
    if (i < 3) {
        return col - 1
        /*return row - 1 + i*/
    } else if (i < 6) {
        return col + 1
        /*return row - 1 + i*/
    } else if (i < 7) {
        return row
        /*return col+1    */
    } else if (i < 8) {
        return row
        /*return col-1*/
    }


}