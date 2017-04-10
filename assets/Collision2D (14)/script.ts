module Collision2D {
  
  export class Bounds {
    top: number;
    bottom: number;
    left: number;
    right: number;
  }
  
  export class Vertex {
    x: number;
    y: number;
  }
  
  export class Segment {
    A: Vertex;
    B: Vertex;
  }
  
  export class BBox {
    edges: Bounds;
    vert: { A:Vertex, B:Vertex, C:Vertex, D:Vertex };
    seg: { top:Segment, bottom:Segment, left:Segment, right:Segment };
  }
        
  export class Triangle {
    A: Vertex;
    B: Vertex;
    C: Vertex;
  }
  
  export class BPoly {
    length: number;
    vert: Vertex[]; // Provided in CCW order
    tri: Triangle[]; // Provided in CCW order
  }
  
  // given an arcadeBody2D, calculate the edge and vertex values of the bounding box in world-space
  // needs to be recalculated whenever the actor moves
  export function getBBox( actor:Sup.Actor ) {
    
    // An arcadeBody2D is centered at the Actor's position (which is based on the Sprite's origin point)
    // Cartesian Coordinates with +Y === UP and +X === RIGHT
    // A ------------ B
    // |     |        |   |
    // |   off.y      |   |
    // |     |        |   |
    // |    pos ----- |   | size.height
    // |        off.x |   |
    // |              |   |
    // |              |   |
    // C ------------ D
    //   ------------
    //    size.width
    
    let pos = actor.getPosition();
    let size = actor.arcadeBody2D.getSize();
    let off = actor.arcadeBody2D.getOffset();
    
    // Return the edge and vertex values in the result
    let edges = {
      top: pos.y + size.height/2 - off.y,
      bottom: pos.y - size.height/2 + off.y,
      left: pos.x - size.width/2 + off.x,
      right:pos.x + size.width/2 - off.x
    };
    
    let vert = {
      A: { x:edges.left , y:edges.top },
      B: { x:edges.right , y:edges.top },
      C: { x:edges.left , y:edges.bottom },
      D: { x:edges.right , y:edges.bottom } 
    };
    
    let seg = {
      top: { A:vert.A, B:vert.B },
      bottom: { A:vert.C, B:vert.D },
      left: { A:vert.A, B:vert.C },
      right: { A:vert.B, B:vert.D } 
    }
    
    //Sup.log(edges); Sup.log(vert); Sup.log(seg); 
    return { edges:edges, vert:vert, seg:seg };
  }
  
  // given an actor with a spriterenderer, calculate the edge and vertex values of the bounding box in world-space
  // convert pixel values to world space using Game.Settings.PPU
  // needs to be recalculated whenever the actor moves
  export function getBBoxSprite( actor:Sup.Actor, padding?:Sup.Math.Vector2 ) {
    
    let pad = new Sup.Math.Vector2(padding.x / Game.Settings.PPU, padding.y / Game.Settings.PPU) || new Sup.Math.Vector2(0,0);
    
    // An actor's sprite is centered at the Actor's position (which is based on the Sprite's origin point)
    // Cartesian Coordinates with +Y === UP and +X === RIGHT
    // A ------------ B
    // |     |        |   |
    // |   off.y      |   |
    // |     |        |   |
    // |    pos ----- |   | size.height
    // |        off.x |   |
    // |              |   |
    // |              |   |
    // C ------------ D
    //   ------------
    //    size.width
    
    let pos = actor.getPosition();
    let gridsize = actor.spriteRenderer.getSprite().getGridSize();
    let size = new Sup.Math.Vector2( gridsize.width / Game.Settings.PPU, gridsize.height / Game.Settings.PPU  );
    let origin = actor.spriteRenderer.getSprite().getOrigin();
    let off = new Sup.Math.Vector2( origin.x / 100 * size.x, origin.y /100 * size.y );
    
    // Return the edge and vertex values in the result
    let edges = {
      top: pos.y + size.y - off.y - pad.y,
      bottom: pos.y - size.y + off.y + pad.y,
      left: pos.x - size.x + off.x + pad.x,
      right:pos.x + size.x - off.x - pad.x
    };
    
    let vert = {
      A: { x:edges.left , y:edges.top },
      B: { x:edges.right , y:edges.top },
      C: { x:edges.left , y:edges.bottom },
      D: { x:edges.right , y:edges.bottom } 
    };
    
    let seg = {
      top: { A:vert.A, B:vert.B },
      bottom: { A:vert.C, B:vert.D },
      left: { A:vert.A, B:vert.C },
      right: { A:vert.B, B:vert.D } 
    }
    //Sup.log("===========");
    //Sup.log(edges); Sup.log(vert); Sup.log(seg); 
    return { edges:edges, vert:vert, seg:seg };
  }
  
  // Returns null if no intersections
  // Returns an object of booleans for edge intersections and whether or not segment is fully inside/on box
  // Assumes bbox and seg in world space
  export function collides( edges:{ top:number,bottom:number,left:number,right:number }, 
                            seg:{ A:{x:number,y:number}, B:{x:number,y:number} } ) {
    // Check if A or B is inside bbox
    let innerA = (seg.A.x >= edges.left && seg.A.x <= edges.right) && (seg.A.y >= edges.bottom && seg.A.y <= edges.top);
    let innerB = (seg.B.x >= edges.left && seg.B.x <= edges.right) && (seg.B.y >= edges.bottom && seg.B.y <= edges.top);
    
    // Stop early if neither is inside
    if (!innerA && !innerB) return null;
    
    let result = {
      top: false, 
      bottom: false, 
      left: false, 
      right: false, 
      inside: false
    };
    
    // Simple check for sitting on an edge
    if ( innerA ) {
      result.top = seg.A.y == edges.top || result.top;
      result.bottom = seg.A.y == edges.bottom || result.bottom;
      result.left = seg.A.x == edges.left || result.left;
      result.right = seg.A.x == edges.right || result.right;
    }
    if ( innerB ) {
      result.top = seg.B.y == edges.top || result.top;
      result.bottom = seg.B.y == edges.bottom || result.bottom;
      result.left = seg.B.x == edges.left || result.left;
      result.right = seg.B.x == edges.right || result.right;
    }
    
    // Set whether or not the segment sits entirely in/on the box
    result.inside = innerA && innerB;
    
    // If not completely inside/on bbox, check where the other point is located wrt bbox
    if (!result.inside) {
      let outerPoint = ( innerA ) ? seg.B : seg.A;
      result.top = outerPoint.y > edges.top || result.top;
      result.bottom = outerPoint.y < edges.bottom || result.bottom;
      result.left = outerPoint.x < edges.left || result.left;
      result.right = outerPoint.x > edges.right || result.right;
    }
    
    return result;
  }  
  
  
  // Return true if point exists in or on the bounding box
  export function isPointInBounds( point: Sup.Math.Vector2, bounds:Bounds ):boolean {
    //Sup.log(bounds);
    return (point.x >= bounds.left && point.x <= bounds.right) && (point.y >= bounds.bottom && point.y <= bounds.top);
  }
  
  // Return true if point exists in or on the bounding polygon
  // Recursive function on inner triangles, assumes the triangles are given in CCW order with points listed in CCW order
  export function isPointInPoly( point: Sup.Math.Vector2, poly:BPoly ):boolean { 
    // TODO
    return false; 
  }
}
