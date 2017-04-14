class CreatureBehavior extends Sup.Behavior {
  
  awake() {
    
    let id = this.actor.getName();
    
    this.actor.setLocalX( Game.SpawnPoints[id].x );
    this.actor.setLocalY( Game.SpawnPoints[id].y );
  }

  update() {
    
  }
}
Sup.registerBehavior(CreatureBehavior);
