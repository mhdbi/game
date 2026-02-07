import * as YUKA from '../library/yuka.module.js';


////////////////////////////////////////////////////////////////////
//........

class PatrolState extends YUKA.State {
    enter(vehicle){

      const walk = vehicle.animations.get('go');
            walk.reset().fadeIn(vehicle.crossFadeDuration);

            vehicle.userData.tarPos = vehicle.position;
    }

    execute(vehicle ) {
        if (vehicle.manager === null) return;
            vehicle.mixer.update(vehicle.userData.delta)

        const entities = vehicle.manager.entities;
        const AR = vehicle.userData.attackRad;

       for(const entity of entities){ 
            if (entity === vehicle || !entity.userData.enemy ) continue; // Don't target yourself
          //  if (vehicle.userData.type === 'Ground' && entity.userData.type === 'Air') continue;
                  
            const distSq = vehicle.position.squaredDistanceTo(entity.position);

            // 1. Priority 1: Look for Enemy Troops

             if ( distSq <=  AR *AR ) {

                        vehicle.userData.targetEnemy = entity;
                        vehicle.stateMachine.changeTo('ATTACK');
                        return;
                 
             }
        };
     // end of the loop 

           if( vehicle.name!=vehicle.userData.selected.Hname ) return;

           if( vehicle.userData.tarPos==vehicle.userData.selected.Gpos ){
            return;
           }else{
               vehicle.userData.tarPos = vehicle.userData.selected.Gpos;
               findFromPathTo(vehicle , vehicle.userData.selected.Gpos);
           };
        
            
    

    }

    exit(vehicle){
      const walk = vehicle.animations.get('go');
            walk.reset().fadeOut(vehicle.crossFadeDuration);
    }
}

////..............

class AttackState extends YUKA.State {
    enter(vehicle) {
         // animations 
         const attack = vehicle.animations.get('attack');
               attack.reset().fadeIn(vehicle.crossFadeDuration);

        // 1. Stop the movement behaviors
        const followPath = vehicle.steering.behaviors.find(b => b instanceof YUKA.FollowPathBehavior);
        if (followPath) {followPath.active = false;
                vehicle.velocity.set(0,0,0);}

        // 2. Face the enemy
        vehicle.lookAt(vehicle.userData.targetEnemy.position);
       
        // Initialize attack timer
        vehicle.userData.lastAttackTime = 0;
        console.log("Entering Combat!");
      }


    execute(vehicle ) {
        // update animations;
        vehicle.mixer.update(vehicle.userData.delta);

        const target = vehicle.userData.targetEnemy;
        const delta  = vehicle.userData.delta;
        const AR     = vehicle.userData.attackRad;

        // 3. Safety Check: If target is dead or gone, go back to Patrol
        if (!target || !target.manager) {
            vehicle.stateMachine.changeTo('PATROL');
            console.log('no enemy 1')
            return;
        }

        // 4. Check Distance: If enemy moved away, go back to Patrol to chase them
        const distSq = vehicle.position.squaredDistanceTo(target.position);
        if (distSq > AR*AR) { // Range + buffer
            vehicle.stateMachine.changeTo('PATROL');
            console.log('no enemy 2')
            return;
        }

        // Use delta for attack speed
        vehicle.userData.lastAttackTime += delta;

        if (vehicle.userData.lastAttackTime >= 1.0) { // 1 second interval
            this.attack( target);
            vehicle.userData.lastAttackTime = 0;
        }

      }

     exit(vehicle){
        const attack = vehicle.animations.get('attack');
               attack.reset().fadeOut(vehicle.crossFadeDuration);
     }

     attack( target) {
           // Play Three.js animation here if you have one
           

          target.userData.health -= 500; // Deal 10 damage
        
          const healthPercent = target.userData.health / target.userData.maxHealth;
        
          // Update the visual bar
          if (target.userData.healthBar) {
              target.userData.healthBar.updateHealth(healthPercent);
          }

      }


}

//................

class GlobalState extends YUKA.State {
    execute(vehicle) {
        // Ensure we don't try to "die" if we are already removed from the manager
        if (vehicle.manager !== null && vehicle.userData.health <= 0) {
            this.die(vehicle);
        }
    }

    die(vehicle) {
        const mesh = vehicle._renderComponent; //|| vehicle.mesh;
      
        if (mesh) {
             
            if(mesh.geometry){
                mesh.geometry.dispose();
 
            }

            if(mesh.material){
                if(Array.isArray(mesh.material)){
                    mesh.material.forEach(m => m.dispose() );

                }else{

                    mesh.material.dispose();
                }
            }

            if (mesh.parent) {
  
                mesh.parent.remove(mesh);

            }
        }
        
        // Important: Remove from manager makes vehicle.manager null
        if (vehicle.manager) {
            vehicle.manager.remove(vehicle);
        }
    }
}



////////////////////////////////////////////////////////////
///////////////////////  tower classes \\\\\\\\\\\\\\\\\\\\\\\
/////////////////////////////////////////////////////////////

class TowerIdleState extends YUKA.State {
    execute(tower) {
        if (tower.manager === null) return;

        const entities = tower.manager.entities;
        const range = 8; // Attack range

        for (const entity of entities) {
            if(tower == entity)continue;

            if (entity.userData.type === 'enemy') {
                const distSq = tower.position.squaredDistanceTo(entity.position);

                if (distSq < (range * range)) {
                    tower.userData.targetEnemy = entity;
                    tower.stateMachine.changeTo('TOWER_ATTACK');
                    return; // Exit loop once target found
                }
            }
        }
    }
}



class TowerAttackState extends YUKA.State {
    enter(tower) {
        tower.userData.lastAttackTime = 0;
        console.log("Tower locked on target!");
    }

    execute(tower) {
        const target = tower.userData.targetEnemy;
        const delta  = tower.userData.delta;

        // 1. Check if target is still valid/in range
        if (!target || !target.manager || tower.position.distanceTo(target.position) > 10) {
            tower.stateMachine.changeTo('TOWER_IDLE');
            return;
        }

        // 2. Accumulate delta for the attack speed
        tower.userData.lastAttackTime += delta;

        if (tower.userData.lastAttackTime >= 1.0) { // Attack every 1 second
            this.shoot(tower, target);
            tower.userData.lastAttackTime = 0;
        }
    }

    shoot(tower, target) {
        console.log("Tower hits enemy!");
        target.userData.health -= 100; // Deal damage
        const healthPercent = target.userData.health / target.userData.maxHealth;
        
          // Update the visual bar
          if (target.userData.healthBar) {
              target.userData.healthBar.updateHealth(healthPercent);
          }
        // You can trigger your projectile animation here
    }
}




/////////////////////////..........\\\\\\\\\\\\\\\\\\\\\\\
//////////////////////////////////////////////////////////

const loaderYuka = new YUKA.NavMeshLoader();
const loudedNavMesh = await  loaderYuka.load('../GameEntity/navMesh.glb');

async function findFromPathTo(v, to) {
    // 1. Convert Three.js positions to Yuka Vector3s
    const fromYuka = new YUKA.Vector3(v.position.x, v.position.y, v.position.z);
    const toYuka = new YUKA.Vector3(to.x, to.y, to.z);

    // 2. Pass the Yuka vectors to the NavMesh
   // const r = await loudedNavMesh.getRegionForPoint(fromYuka);
   // console.log(r)  for check if null on the navMesh
    const path = await loudedNavMesh.findPath(fromYuka, toYuka);
    
    // console.log(path);

    // 3. Update the behavior (Uncommented and fixed for you)
    const vehicleBehavior = v.steering.behaviors.find(b => b instanceof YUKA.FollowPathBehavior);

    if (path.length > 0) {
        vehicleBehavior.active = true;
        vehicleBehavior.path.clear();

        for (let p of path) {
            // path points returned by NavMesh are already YUKA.Vector3
            vehicleBehavior.path.add(p);
        }
    } else {
        vehicleBehavior.active = false;
    }
}

//...........






export { PatrolState ,AttackState ,GlobalState,    TowerIdleState,TowerAttackState , loudedNavMesh};