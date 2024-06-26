import sdShop from '../client/sdShop.js';

import sdWorld from '../sdWorld.js';
import sdSound from '../sdSound.js';
import sdEntity from './sdEntity.js';
import sdEffect from './sdEffect.js';
import sdCharacter from './sdCharacter.js';
import sdBG from './sdBG.js';
import sdWeather from './sdWeather.js';


/*
	Not a mob spawner, just an entity which draws a random (probably flying) mob in the background around players.
	Made to give the background a little more life.
*/

class sdWanderer extends sdEntity
{
	static init_class()
	{
		sdWanderer.wanderers = []; // For sdRenderer
		sdWorld.entity_classes[ this.name ] = this; // Register for object spawn
		
		sdWanderer.MODEL_SD_HOVER = 0; // SD hover sprite
		sdWanderer.MODEL_SD_FIGHTER_HOVER = 1; // SD fighter hover sprite
		sdWanderer.MODEL_SD_TANK_HOVER = 2; // SD tank hover sprite
		sdWanderer.MODEL_CUBE = 3; // The good old cyan cube
		sdWanderer.MODEL_YELLOW_CUBE = 4; // Yellow cube, will need filtering so I'll leave that for later - Booraz149
		sdWanderer.MODEL_WHITE_CUBE = 5; // White cube, will need filtering so I'll leave that for later - Booraz149
		sdWanderer.MODEL_ASP = 6; // Asp, will need hue filter but can be done later - Booraz149
	}
	get hitbox_x1() { return 0; }
	get hitbox_x2() { return 0; }
	get hitbox_y1() { return 0; }
	get hitbox_y2() { return 0; }

	get hard_collision()
	{ return false; }
	
	IsBGEntity()
	{ return 5; }
	
	IsGlobalEntity()
	{ return true; }
	
	get is_static() // Static world objects like walls, creation and destruction events are handled manually. Do this._update_version++ to update these
	{ return false; }
	
	Damage( dmg, initiator=null ) // Not that much useful since it cannot be damaged by anything but matter it contains.
	{
		if ( !sdWorld.is_server )
		return;
	}
	constructor( params )
	{
		super( params );
		
		this.model = params.model || Math.round( Math.random() * 3 );
		
		//this.x = 0;
		//this.y = 0;
		
		//this.time_left = 30 * 60 * 60; // Time to move across the screen, in GSPEED units ( 30 GSPEED = 1 second )
		
		this.layer = Math.round( Math.random() * 7 ); // Behind which skybox / darklands layer will this entity move?
		
		this.side = params.side || 1;
		
		this._move_x = ( this.x < ( ( sdWorld.world_bounds.x1 + sdWorld.world_bounds.x2 ) / 2 ) ) ? 0.01 : -0.01; // Move from one border to another
		this._move_y = 0 * ( 1 + this.layer );
		
		this._move_x *= Math.random() * 12 * ( 1 + this.layer );
		
		//this._set_spawn = false; // Set it's coords to world borders when spawned
		
		//if ( this.model !== sdWanderer.MODEL_CUBE )
		//this.side = ( Math.random() < 0.5 ) ? -1 : 1;
		
		this.layer = params.layer || Math.round( Math.random() * 7 ); // Behind which skybox / darklands layer will this entity move?
		
		sdWanderer.wanderers.push( this );
	}
	MeasureMatterCost()
	{
		return 0; // Hack
	}
	onThink( GSPEED ) // Class-specific, if needed
	{
		if ( sdWorld.is_server )
		{
			//this.time_left -= GSPEED;
			
			/*if ( !this._set_spawn )
			{
				if ( this._move_x < 0 )
				this.x = sdWorld.world_bounds.x2 + 64; // From right to left
				else
				this.x = sdWorld.world_bounds.x1 - 64; // From left to right
			
				this._set_spawn = true;
			}*/
			
			this.x += this._move_x;
			this.y += this._move_y;
			
			if ( this.model !== sdWanderer.MODEL_CUBE )
			{
				if ( this._move_x > 0 )
				this.side = -1;
				else
				this.side = 1;
			}
			
			//if ( this.time_left <= 0 )
			if ( this._move_x > 0 && this.x > sdWorld.world_bounds.x2 + ( 1600 * this.layer ) )
			this.remove();
		
			if ( this._move_x <= 0 && this.x < sdWorld.world_bounds.x1 - ( 1600 * this.layer ) )
			this.remove();
		}
	}
	
	GetImageFromModel() // Find image for specific wanderer "models"
	{

		if ( this.model === sdWanderer.MODEL_SD_HOVER )
		return 'hover_sprite';

		if ( this.model === sdWanderer.MODEL_SD_FIGHTER_HOVER )
		return 'f_hover_sprite';
	
		if ( this.model === sdWanderer.MODEL_SD_TANK_HOVER )
		return 'tank_sprite';
	
		if ( this.model === sdWanderer.MODEL_CUBE )
		return 'sdCube';
		
	}
	GetXOffsetFromModel() // X offset for the image to match a flying animation, for example
	{

		if ( this.model === sdWanderer.MODEL_SD_HOVER )
		return 64;

		if ( this.model === sdWanderer.MODEL_SD_FIGHTER_HOVER )
		return 64;
	
		if ( this.model === sdWanderer.MODEL_SD_TANK_HOVER )
		return 64;
	
		if ( this.model === sdWanderer.MODEL_CUBE )
		return 0;
		
	}
	
	GetYOffsetFromModel() // Y offset for the image to match a flying animation, for example
	{

		if ( this.model === sdWanderer.MODEL_SD_HOVER )
		return 0;

		if ( this.model === sdWanderer.MODEL_SD_FIGHTER_HOVER )
		return 0;
	
		if ( this.model === sdWanderer.MODEL_SD_TANK_HOVER )
		return 0;
	
		if ( this.model === sdWanderer.MODEL_CUBE )
		return 0;
		
	}
	
	GetWidthFromModel() // Image width value for specific model
	{

		if ( this.model === sdWanderer.MODEL_SD_HOVER )
		return 64;

		if ( this.model === sdWanderer.MODEL_SD_FIGHTER_HOVER )
		return 64;
	
		if ( this.model === sdWanderer.MODEL_SD_TANK_HOVER )
		return 64;
	
		if ( this.model === sdWanderer.MODEL_CUBE )
		return 32;
		
	}
	
	GetHeightFromModel() // Image height value for specific model
	{

		if ( this.model === sdWanderer.MODEL_SD_HOVER )
		return 64;

		if ( this.model === sdWanderer.MODEL_SD_FIGHTER_HOVER )
		return 64;
	
		if ( this.model === sdWanderer.MODEL_SD_TANK_HOVER )
		return 64;
	
		if ( this.model === sdWanderer.MODEL_CUBE )
		return 32;
		
	}
	
	get title(){
		return 'Wanderer';
	}

	onRemove() // Class-specific, if needed
	{
		this.onRemoveAsFakeEntity();
	}
	onRemoveAsFakeEntity()
	{
		let i = sdWanderer.wanderers.indexOf( this );
		
		if ( i !== -1 )
		sdWanderer.wanderers.splice( i, 1 );
	}
}
//sdWanderer.init_class();

export default sdWanderer;
