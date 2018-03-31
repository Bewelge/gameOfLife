# gameOfLife
A GPU-accelerated simulation & visualisation of Conway's Game of Life.

[Try it Here!](https://bewelge.github.io/gameOfLife/)

![Image of GameOfLife](https://github.com/Bewelge/GameOfLife/blob/master/img/ConwayScreenshot.png)

### What it does

* Simulates and visualizes [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life).

### How to play


* Click anywhere on main the main board to place a one or more living Cells.
* Choose one of the preset Shapes at the bottom to place entire shapes at once.
* Click on "Create New Preset" at the bottom of the screen to create your own preset shapes.
* You can place entire shapes within the preset-creator as well, allowing you to create and combine shapes.
* Press "Run" to start the Simulation!
* Adjust other settings like tickspeed & Worldsize in the right menu.

### How it works

The program is built upon GPU.js which allows the creation of Kernels that are executed on a computers GPU. 
For each simulation-step, each Kernel will calculate the result of one cell within the game-world. 

For each simulation-step, the next state for every cell is determined by checking how many neighbouring cells are alive. 

 * If a cell is alive, it ...
    * will live on if exactly two or three neighboring cells are alive.
    * will die in the next round if less than two or more than three neighboring cells are alive.
    
 * If a cell is dead, it ...
    * will become alive in the next round if exactly three neighboring cells are alive.
    * will stay dead in all other cases.

### To-Do

- [x] Allow Custom Shape creation
- [x] Allow setting of world size
- [x] Allow placing shapes while game runs (still need to fix larger shapes not placing simultaneously)
- [ ] Add "Resolution" Setting
- [ ] Parallize the rendering. Problem is it only draw 1 Pixel per cell now and that's ugly.
- [ ] Make shape creation screen more user friendly.

### Libaries
* jQuery
* [GPU.js](gpu.rocks) - Allows parallel simulation of the game world.
* [QuickSettings.js - Settings Menu](https://github.com/bit101/quicksettings)
