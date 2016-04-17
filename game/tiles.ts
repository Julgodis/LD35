var _tiles = {};
class TileData {
    static DIM01_GROUND_GRASS = 0;
    static DIM01_GROUND = 1;
    static DIM02_GROUND_GRASS = 2;
    static DIM02_GROUND = 3;
    static SLOPE_0r1 = 4;
    static SLOPE_0r2 = 4001;
    static SLOPE_0r3 = 4002;
    static SLOPE_0r4 = 4003;
    static CHEST_01 = 5;
    static STONE_01 = 6;
    static SLOPE_1r1 = 7;
    static SLOPE_1r2 = 7001;
    static SLOPE_1r3 = 7002;
    static SLOPE_1r4 = 7003;
    static WALL_01 = 8;
    static WATER_01 = 9;
    static WATER_02 = 10;
    static WATER_11 = 11;
    static WATER_12 = 12;

    static get(index: number): Tile {
        return <Tile>(_tiles[index]);
    }

    static generate() {
        var p = TILE_SIZE / 16.0;

        _tiles[TileData.DIM01_GROUND_GRASS]     = new TileCube(TileData.DIM01_GROUND_GRASS, new vec3([0, 0, 0]), new vec3([TILE_SIZE, TILE_SIZE, TILE_SIZE]));
        _tiles[TileData.DIM01_GROUND]           = new TileCube(TileData.DIM01_GROUND,       new vec3([0, 0, 0]), new vec3([TILE_SIZE, TILE_SIZE, TILE_SIZE]));
        _tiles[TileData.DIM02_GROUND_GRASS]     = new TileCube(TileData.DIM02_GROUND_GRASS, new vec3([0, 0, 0]), new vec3([TILE_SIZE, TILE_SIZE, TILE_SIZE]));
        _tiles[TileData.DIM02_GROUND]           = new TileCube(TileData.DIM02_GROUND, new vec3([0, 0, 0]), new vec3([TILE_SIZE, TILE_SIZE, TILE_SIZE]));
        _tiles[TileData.SLOPE_0r1]              = new TileSlope(TileData.SLOPE_0r1, new vec3([0, 0.0 * p, 0]), new vec3([TILE_SIZE, TILE_SIZE, TILE_SIZE]), 0 /* dir */);
        _tiles[TileData.SLOPE_0r2]              = new TileSlope(TileData.SLOPE_0r1, new vec3([0, 0.0 * p, 0]), new vec3([TILE_SIZE, TILE_SIZE, TILE_SIZE]), 1 /* dir */);
        _tiles[TileData.SLOPE_0r3]              = new TileSlope(TileData.SLOPE_0r1, new vec3([0, 0.0 * p, 0]), new vec3([TILE_SIZE, TILE_SIZE, TILE_SIZE]), 2 /* dir */);
        _tiles[TileData.SLOPE_0r4]              = new TileSlope(TileData.SLOPE_0r1, new vec3([0, 0.0 * p, 0]), new vec3([TILE_SIZE, TILE_SIZE, TILE_SIZE]), 3 /* dir */);
        _tiles[TileData.CHEST_01]               = new TileChest(TileData.CHEST_01, new vec3([0 * p, 2.5 * p, 0 * p]), new vec3([12 * p, 11 * p, 12 * p]));
        _tiles[TileData.STONE_01]               = new TileCube(TileData.STONE_01, new vec3([0, 0, 0]), new vec3([TILE_SIZE, TILE_SIZE, TILE_SIZE]));
        _tiles[TileData.SLOPE_1r1]              = new TileSlope(TileData.SLOPE_1r1, new vec3([0, 0.0 * p, 0]), new vec3([TILE_SIZE, TILE_SIZE, TILE_SIZE]), 0 /* dir */);
        _tiles[TileData.SLOPE_1r2]              = new TileSlope(TileData.SLOPE_1r1, new vec3([0, 0.0 * p, 0]), new vec3([TILE_SIZE, TILE_SIZE, TILE_SIZE]), 1 /* dir */);
        _tiles[TileData.SLOPE_1r3]              = new TileSlope(TileData.SLOPE_1r1, new vec3([0, 0.0 * p, 0]), new vec3([TILE_SIZE, TILE_SIZE, TILE_SIZE]), 2 /* dir */);
        _tiles[TileData.SLOPE_1r4]              = new TileSlope(TileData.SLOPE_1r1, new vec3([0, 0.0 * p, 0]), new vec3([TILE_SIZE, TILE_SIZE, TILE_SIZE]), 3 /* dir */);
        _tiles[TileData.WALL_01]                = new TileCube(TileData.WALL_01, new vec3([0, 0, 0]), new vec3([TILE_SIZE, TILE_SIZE, TILE_SIZE]));

        _tiles[TileData.WATER_01] = new TileWater(TileData.WATER_01, new vec3([0, 3.0 * p, 0]), new vec3([TILE_SIZE, 10 * p, TILE_SIZE]));
        _tiles[TileData.WATER_02] = new TileCube(TileData.WATER_02, new vec3([0, 0, 0]), new vec3([TILE_SIZE, TILE_SIZE, TILE_SIZE]));
        _tiles[TileData.WATER_11] = new TileWater(TileData.WATER_11, new vec3([0, 3.0 * p, 0]), new vec3([TILE_SIZE, 10 * p, TILE_SIZE]));
        _tiles[TileData.WATER_12] = new TileCube(TileData.WATER_12, new vec3([0, 0, 0]), new vec3([TILE_SIZE, TILE_SIZE, TILE_SIZE]));

        _tiles[TileData.WATER_01].has_collision = false;
        _tiles[TileData.WATER_02].has_collision = false;
        _tiles[TileData.WATER_11].has_collision = false;
        _tiles[TileData.WATER_12].has_collision = false;



    }
}

class Tile {
    index: number;
    offset: vec3;
    size: vec3;  
    collision: vec3;  
      
    has_collision: boolean;

    constructor(index: number, offset: vec3, size: vec3) {
        this.index = index;
        this.offset = offset;
        this.size = size;
        this.collision = size.copy();
        this.has_collision = true;
    }

    add_model(batch: ModelBatch, position: vec3, has_array: boolean []) {
        new Error("Not Implemented")
    }
}

// NOTE: TILES

class TileSlope extends Tile {
    direction: number;

    constructor(index: number, offset: vec3, size: vec3, direction: number) {
        super(index, offset, size);
        this.direction = direction;
    }

    add_model(batch: ModelBatch, position: vec3, has_array: boolean[]) {
        var absolute_position = position.copy().add(this.offset);
        batch.append_slope(absolute_position, this.size, this.index, this.direction, has_array);
    }
}

class TileChest extends Tile {
    constructor(index: number, offset: vec3, size: vec3) {
        super(index, offset, size);

        var p = TILE_SIZE / 16.0;
        this.collision = new vec3([12 * p, 11 * p, 16 * p]);
    }

    add_model(batch: ModelBatch, position: vec3, has_array: boolean[]) {
        var absolute_position = position.copy().add(this.offset);
        batch.append_cube_texture_size(absolute_position, this.size, this.index, new vec3([12, 11, 12]), has_array);
    }
}

class TileWater extends Tile {
    constructor(index: number, offset: vec3, size: vec3) {
        super(index, offset, size);

        var p = TILE_SIZE / 16.0;
        this.collision = new vec3([16 * p, 10 * p, 16 * p]);
    }

    add_model(batch: ModelBatch, position: vec3, has_array: boolean[]) {
        var absolute_position = position.copy().add(this.offset);
        batch.append_cube_texture_size(absolute_position, this.size, this.index, new vec3([16, 10, 16]), has_array);
    }
}

// NOTE: HELPER
class TileCube extends Tile {
    constructor(index: number, offset: vec3, size: vec3) {
        super(index, offset, size);
    }

    add_model(batch: ModelBatch, position: vec3, has_array: boolean[]) {
        var absolute_position = position.copy().add(this.offset);
        batch.append_cube(absolute_position, this.size, this.index, has_array);
    }
}

// NOTE: GENEREATE

TileData.generate();