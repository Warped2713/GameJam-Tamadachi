class InterfaceBehavior extends Sup.Behavior {
  
  private currentSelection = null;
  
  awake() {
    
  }

  update() {
    // Get the position of the mouse or touch
    let {x,y}:Sup.Math.Vector2 = Sup.Input.getMousePosition() || Sup.Input.getTouchPosition(0);

    // Convert to world coordinates
    x = x * Game.Settings.Width / Game.Settings.PPU / 2;
    y = y * Game.Settings.Height / Game.Settings.PPU / 2;

    let pos = new Sup.Math.Vector2(x,y);

    // Check if the position intersects one of our button spriteRenderer
    for ( let button of this.actor.getChildren() ) {
      if ( button.getVisible() )
        {
          //Sup.log("processing " + button.getName());
          if ( Collision2D.isPointInBounds( pos, button.getBehavior(ButtonBehavior).getBounds() ) )
            {
              // Check for new mouse press or touch
              if ( Sup.Input.wasMouseButtonJustPressed(0) || Sup.Input.wasTouchStarted(0) )
                {
                  //Sup.log( "Pressed button: " + button.getName() );
                  // Process Button Callback function
                  button.getBehavior(ButtonBehavior).processCallback();
                  if (!button.getBehavior(ButtonBehavior).allowMultiple) this.currentSelection = button;
                } 
              else 
                {
                  // Process Button hover effect
                  button.getBehavior(ButtonBehavior).onMouseOver();
                }
            } else {
              // Process Button unhover effect
              if ( button.getBehavior(ButtonBehavior).getHovered() ) button.getBehavior(ButtonBehavior).onMouseOut();
              // Only let one button be selected at a time
              if ( !button.getBehavior(ButtonBehavior).allowMultiple && 
                   button.getBehavior(ButtonBehavior).getSelected() && 
                   this.currentSelection != button ) 
                button.getBehavior(ButtonBehavior).unSelect();
            }
        }
    }
  }
  
}
Sup.registerBehavior(InterfaceBehavior);
