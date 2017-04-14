module Game {
  
  export let Settings = {
    PPU: 64, // Camera's ortho scale = Height / PPU; Default PPU is usually 100 so ortho scale would then be 5.4
    Width: 960,
    Height: 540
  };
  
  export let MapBounds = {
    Left: -4,
    Right: -14,
    Up: -14,
    Down: -4
  };
  
  export let SpawnPoints = {
    0: {x: -2, y: 6},
    1: {x: 4, y: 0},
    2: {x: -4, y: -4}
  };
  
  export let isFullScreen = false;
  
  export function init() {
    //Sup.loadScene("Scene");
    Sup.loadScene("Main");
  };
  
}

Game.init();
