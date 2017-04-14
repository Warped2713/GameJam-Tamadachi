module Game {
  
  export let Settings = {
    PPU: 64, // Camera's ortho scale = Height / PPU; Default PPU is usually 100 so ortho scale would then be 5.4
    Width: 960,
    Height: 540
  }
  
  export let isFullScreen = false;
  
  export function init() {
    //Sup.loadScene("Scene");
    Sup.loadScene("Main");
  }
  
}

Game.init();
