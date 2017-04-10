class ButtonBehavior extends Sup.Behavior {
  
  callback: string = "debug";
  padding: Sup.Math.Vector2;
  spriteAsChild: boolean = false;
  allowMultiple: boolean = false;
  
  private bbox;
  private spriteActor;
  private textActor;
  
  private isHovered = false;
  private isSelected = false;
  
  awake() {
    // Get the sprite actor
    this.spriteActor = (this.spriteAsChild) ? this.actor.getChild("Sprite") : this.actor;
    this.textActor = this.actor.getChild("Text");
    // Get our bounding box for mouse/touch interaction
    this.bbox = Collision2D.getBBoxSprite(this.spriteActor, this.padding);
  }

  update() {
  }
  
  // GETTERS
  
  getHovered():boolean {
    return this.isHovered;
  }
  
  getSelected():boolean {
    return this.isSelected;
  }
  
  getBounds():Collision2D.Bounds {
    return this.bbox.edges;
  }
  
  
  // EVENTS
  
  processCallback():void {
    if (this.isSelected) {
      this.unSelect();
    } else {
      this.Select();
    }
    this.callbackObj[this.callback]( this.isSelected );
  }
  
  Select():void {
    this.isSelected = true;
    this.spriteActor.spriteRenderer.setAnimation( "Selected", false ); 
    this.textActor.textRenderer.setColor(0,0,0);
  }
  
  unSelect():void {
    this.isSelected = false;
    this.spriteActor.spriteRenderer.setAnimation( "Default", false ); 
    this.textActor.textRenderer.setColor(1,1,1);
  }
  
  onMouseOver():void {
    this.isHovered = true;
    this.spriteActor.spriteRenderer.setAnimation( "HoveredDefault", false );    
    if (this.isSelected) this.spriteActor.spriteRenderer.setAnimation( "HoveredSelected", false );
  }
  
  onMouseOut():void {
    this.isHovered = false;
    this.spriteActor.spriteRenderer.setAnimation( "Default", false );
    if (this.isSelected) this.spriteActor.spriteRenderer.setAnimation( "Selected", false );
  }
  
  // CALLBACKS
  
  private callbackObj = {
    // TODO
    
    debug: function( selected:boolean ) { 
      Sup.log("Invoked debug callback"); 
      if (selected) {
        Sup.log("Do debug stuff");
      } else {
        Sup.log("Unset debug stuff");
      }
    },
    
    pet: function( selected:boolean ) { 
      Sup.log("Invoked pet callback"); 
      if (selected) {
        Sup.log("Do pet mode stuff");
      } else {
        Sup.log("Unset pet mode stuff");
      }
    },
    
    play: function( selected:boolean ) { 
      Sup.log("Invoked play callback"); 
      if (selected) {
        Sup.log("Do play mode stuff");
      } else {
        Sup.log("Unset play mode stuff");
      }
    },
    
    explore: function( selected:boolean ) { 
      Sup.log("Invoked explore callback"); 
      if (selected) {
        Sup.log("Do explore mode stuff");
      } else {
        Sup.log("Unset explore mode stuff");
      }
    },
    
    feed: function( selected:boolean ) { 
      Sup.log("Invoked feed callback"); 
      if (selected) {
        Sup.log("Do feed mode stuff");
      } else {
        Sup.log("Unset feed mode stuff");
      }
    },
    
    clean: function( selected:boolean ) { 
      Sup.log("Invoked clean callback"); 
      if (selected) {
        Sup.log("Do clean mode stuff");
      } else {
        Sup.log("Unset clean mode stuff");
      }
    },
    
    build: function( selected:boolean ) { 
      Sup.log("Invoked build callback"); 
      if (selected) {
        Sup.log("Do build mode stuff");
      } else {
        Sup.log("Unset build mode stuff");
      }
    },
    
    fullscreen: function( selected:boolean ) { 
      if ( Game.isFullScreen ) 
        {
          Sup.Input.exitFullscreen();
          Game.isFullScreen = false;
        } 
      else 
        {
          Sup.Input.goFullscreen();
          Game.isFullScreen = true;
        }
    }
  };
  
}
Sup.registerBehavior(ButtonBehavior);
