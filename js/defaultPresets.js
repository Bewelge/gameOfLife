
/*function addCol(x, y, arr) {

    arr[y][x] = 1;
    arr[y + 1][x] = 1;
    arr[y + 2][x] = 1;
    arr[y + 2][x - 1] = 1;
    arr[y + 2][x + 1] = 1;
    arr[y + 5][x] = 1;
    arr[y + 5][x - 1] = 1;
    arr[y + 5][x + 1] = 1;
    arr[y + 6][x] = 1;
    arr[y + 7][x] = 1;


    arr[y - 1][x] = 1;
    arr[y - 2][x] = 1;
    arr[y - 3][x] = 1;
    arr[y - 3][x - 1] = 1;
    arr[y - 3][x + 1] = 1;
    arr[y - 6][x] = 1;
    arr[y - 6][x - 1] = 1;
    arr[y - 6][x + 1] = 1;
    arr[y - 7][x] = 1;
    arr[y - 8][x] = 1;
}*/


/*function addAngel(x, y, arr) {

    arr[y][x] = 1;
    arr[y + 1][x] = 1;
    arr[y + 2][x] = 1;
    arr[y + 2][x - 1] = 1;
    arr[y + 2][x + 1] = 1;
    arr[y + 5][x] = 1;
    arr[y + 5][x - 1] = 1;
    arr[y + 5][x + 1] = 1;
    arr[y + 6][x] = 1;
    arr[y + 7][x] = 1;


    arr[y - 1][x] = 1;
    arr[y - 2][x] = 1;
    arr[y - 3][x] = 1;
    arr[y - 3][x - 1] = 1;
    arr[y - 3][x + 1] = 1;
    arr[y - 5][x - 1] = 1;
    arr[y - 5][x + 1] = 1;
    arr[y - 6][x] = 1;
    arr[y - 7][x] = 1;
}*/
function addSpiral(x, y, steps, marg) {
    let dis = 1;
    let dirX = 0;
    let dirY = -1;
    let curX = x;
    let curY = y;
    for (let i = 0; i < steps; i++) {
        for (let d = 1; d < dis; d++) {
            gameArray[curY][curX] = 1;
            curX += dirX;
            curY += dirY;
        }
        if (dirY == -1) {
            dirY = 0;
            dirX = 1;
        } else if (dirX == 1) {
            dirX = 0;
            dirY = 1;
        } else if (dirY == 1) {
            dirY = 0;
            dirX = -1;
        } else if (dirX == -1) {
            dirX = 0;
            dirY = -1;
        }
        dis += marg;
    }

}

function addHSVLogo(x, y, w, h) {
    addSquare(x - w / 2, y - 2, w * 2, h);
    addTiltSquare(x + 1, y + 1, w - 1);
    addTiltSquare(x + 3, y + 3, w - 5);

    addTiltSquare(x + 8, x + 8, w - 15);
    addTiltSquare(x + 10, x + 10, w - 19);
}

function addSquare(x, y, w, h, arr) {
    //gameArray[y][x] = 1;
    for (let i = 0; i < w; i++) {
        arr[y + h - 1][x + i] = 1;
        arr[y][x + i] = 1;
    }
    for (let i = 0; i < h; i++) {
        arr[y + i][x] = 1;
        arr[y + i][x + w - 1] = 1;
    }
};

function addTiltSquare(x, y, w, arr) {
    for (let i = 0; i < w / 2; i++) {
        arr[y + Math.floor(w / 2) + i][x + i] = 1;
        arr[y + Math.floor(w / 2) - i][x + i] = 1;
    }
    for (let i = 0; i < w / 2; i++) {
        arr[y + Math.floor(w / 2) - i][x + w - 1 - i] = 1;
        arr[y + Math.floor(w / 2) + i][x + w - 1 - i] = 1;
    }
}


/*function addPulsar(x, y, arr) {
    arr[y - 2][x - 1] = 1;
    arr[y - 3][x - 1] = 1;
    arr[y - 4][x - 1] = 1;

    arr[y - 2][x + 1] = 1;
    arr[y - 3][x + 1] = 1;
    arr[y - 4][x + 1] = 1;

    arr[y + 2][x - 1] = 1;
    arr[y + 3][x - 1] = 1;
    arr[y + 4][x - 1] = 1;

    arr[y + 2][x + 1] = 1;
    arr[y + 3][x + 1] = 1;
    arr[y + 4][x + 1] = 1;



    arr[y - 1][x - 2] = 1;
    arr[y - 1][x - 3] = 1;
    arr[y - 1][x - 4] = 1;

    arr[y + 1][x - 2] = 1;
    arr[y + 1][x - 3] = 1;
    arr[y + 1][x - 4] = 1;

    arr[y - 1][x + 2] = 1;
    arr[y - 1][x + 3] = 1;
    arr[y - 1][x + 4] = 1;

    arr[y + 1][x + 2] = 1;
    arr[y + 1][x + 3] = 1;
    arr[y + 1][x + 4] = 1;



    arr[y - 2][x - 6] = 1;
    arr[y - 3][x - 6] = 1;
    arr[y - 4][x - 6] = 1;

    arr[y - 2][x + 6] = 1;
    arr[y - 3][x + 6] = 1;
    arr[y - 4][x + 6] = 1;

    arr[y + 2][x - 6] = 1;
    arr[y + 3][x - 6] = 1;
    arr[y + 4][x - 6] = 1;

    arr[y + 2][x + 6] = 1;
    arr[y + 3][x + 6] = 1;
    arr[y + 4][x + 6] = 1;



    arr[y - 6][x - 2] = 1;
    arr[y - 6][x - 3] = 1;
    arr[y - 6][x - 4] = 1;

    arr[y + 6][x - 2] = 1;
    arr[y + 6][x - 3] = 1;
    arr[y + 6][x - 4] = 1;

    arr[y - 6][x + 2] = 1;
    arr[y - 6][x + 3] = 1;
    arr[y - 6][x + 4] = 1;

    arr[y + 6][x + 2] = 1;
    arr[y + 6][x + 3] = 1;
    arr[y + 6][x + 4] = 1;
}*/


/*function addGlider(x, y, arr) {
    arr[y][x] = 1;
    arr[y][x - 1] = 1;
    arr[y][x - 2] = 1;
    arr[y - 1][x] = 1;
    arr[y - 2][x - 1] = 1;
}*/


/*function addGliderR(x, y, arr) {
    arr[y][x] = 1;
    arr[y][x + 1] = 1;
    arr[y][x + 2] = 1;
    arr[y + 1][x] = 1;
    arr[y + 2][x + 1] = 1;
}*/


/*function addGlider2(x, y, arr) {
    arr[y][x] = 1;
    arr[y + 1][x] = 1;
    arr[y + 2][x] = 1;
    arr[y + 3][x - 1] = 1;
    arr[y][x - 1] = 1;
    arr[y][x - 2] = 1;
    arr[y][x - 3] = 1;
    arr[y + 1][x - 4] = 1;
    arr[y + 3][x - 4] = 1;
}*/


/*function addGlider2R(x, y, arr) {
    arr[y][x] = 1;
    arr[y + 1][x] = 1;
    arr[y + 2][x] = 1;
    arr[y + 3][x + 1] = 1;
    arr[y][x + 1] = 1;
    arr[y][x + 2] = 1;
    arr[y][x + 3] = 1;
    arr[y + 1][x + 4] = 1;
    arr[y + 3][x + 4] = 1;
}*/

/*function addCross(x, y, arr) {
    arr[y][x - 1] = 1;
    arr[y][x + 1] = 1;
    arr[y - 1][x] = 1;
    arr[y + 1][x] = 1;


}*/

/*function addStaticObj(x, y, arr) {
    arr[y][x] = 1;
    arr[y][x - 1] = 1;
    arr[y + 1][x - 2] = 1;
    arr[y + 2][x - 2] = 1;
    arr[y + 3][x - 1] = 1;
    arr[y + 3][x] = 1;
    arr[y + 2][x + 1] = 1;
    arr[y + 1][x + 1] = 1;
}*/