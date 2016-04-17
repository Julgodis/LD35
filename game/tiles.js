var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _tiles = {};
var TileData = (function () {
    function TileData() {
    }
    TileData.get = function (index) {
        return (_tiles[index]);
    };
    TileData.generate = function () {
        var p = TILE_SIZE / 16.0;
        _tiles[TileData.DIM01_GROUND_GRASS] = new TileCube(TileData.DIM01_GROUND_GRASS, new vec3([0, 0, 0]), new vec3([TILE_SIZE, TILE_SIZE, TILE_SIZE]));
        _tiles[TileData.DIM01_GROUND] = new TileCube(TileData.DIM01_GROUND, new vec3([0, 0, 0]), new vec3([TILE_SIZE, TILE_SIZE, TILE_SIZE]));
        _tiles[TileData.DIM02_GROUND_GRASS] = new TileCube(TileData.DIM02_GROUND_GRASS, new vec3([0, 0, 0]), new vec3([TILE_SIZE, TILE_SIZE, TILE_SIZE]));
        _tiles[TileData.DIM02_GROUND] = new TileCube(TileData.DIM02_GROUND, new vec3([0, 0, 0]), new vec3([TILE_SIZE, TILE_SIZE, TILE_SIZE]));
        _tiles[TileData.SLOPE_0r1] = new TileSlope(TileData.SLOPE_0r1, new vec3([0, 0.0 * p, 0]), new vec3([TILE_SIZE, TILE_SIZE, TILE_SIZE]), 0 /* dir */);
        _tiles[TileData.SLOPE_0r2] = new TileSlope(TileData.SLOPE_0r1, new vec3([0, 0.0 * p, 0]), new vec3([TILE_SIZE, TILE_SIZE, TILE_SIZE]), 1 /* dir */);
        _tiles[TileData.SLOPE_0r3] = new TileSlope(TileData.SLOPE_0r1, new vec3([0, 0.0 * p, 0]), new vec3([TILE_SIZE, TILE_SIZE, TILE_SIZE]), 2 /* dir */);
        _tiles[TileData.SLOPE_0r4] = new TileSlope(TileData.SLOPE_0r1, new vec3([0, 0.0 * p, 0]), new vec3([TILE_SIZE, TILE_SIZE, TILE_SIZE]), 3 /* dir */);
        _tiles[TileData.CHEST_01] = new TileChest(TileData.CHEST_01, new vec3([0 * p, 2.5 * p, 0 * p]), new vec3([12 * p, 11 * p, 12 * p]));
        _tiles[TileData.STONE_01] = new TileCube(TileData.STONE_01, new vec3([0, 0, 0]), new vec3([TILE_SIZE, TILE_SIZE, TILE_SIZE]));
        _tiles[TileData.SLOPE_1r1] = new TileSlope(TileData.SLOPE_1r1, new vec3([0, 0.0 * p, 0]), new vec3([TILE_SIZE, TILE_SIZE, TILE_SIZE]), 0 /* dir */);
        _tiles[TileData.SLOPE_1r2] = new TileSlope(TileData.SLOPE_1r1, new vec3([0, 0.0 * p, 0]), new vec3([TILE_SIZE, TILE_SIZE, TILE_SIZE]), 1 /* dir */);
        _tiles[TileData.SLOPE_1r3] = new TileSlope(TileData.SLOPE_1r1, new vec3([0, 0.0 * p, 0]), new vec3([TILE_SIZE, TILE_SIZE, TILE_SIZE]), 2 /* dir */);
        _tiles[TileData.SLOPE_1r4] = new TileSlope(TileData.SLOPE_1r1, new vec3([0, 0.0 * p, 0]), new vec3([TILE_SIZE, TILE_SIZE, TILE_SIZE]), 3 /* dir */);
        _tiles[TileData.WALL_01] = new TileCube(TileData.WALL_01, new vec3([0, 0, 0]), new vec3([TILE_SIZE, TILE_SIZE, TILE_SIZE]));
        _tiles[TileData.WATER_01] = new TileWater(TileData.WATER_01, new vec3([0, 3.0 * p, 0]), new vec3([TILE_SIZE, 10 * p, TILE_SIZE]));
        _tiles[TileData.WATER_02] = new TileCube(TileData.WATER_02, new vec3([0, 0, 0]), new vec3([TILE_SIZE, TILE_SIZE, TILE_SIZE]));
        _tiles[TileData.WATER_11] = new TileWater(TileData.WATER_11, new vec3([0, 3.0 * p, 0]), new vec3([TILE_SIZE, 10 * p, TILE_SIZE]));
        _tiles[TileData.WATER_12] = new TileCube(TileData.WATER_12, new vec3([0, 0, 0]), new vec3([TILE_SIZE, TILE_SIZE, TILE_SIZE]));
        _tiles[TileData.WATER_01].has_collision = false;
        _tiles[TileData.WATER_02].has_collision = false;
        _tiles[TileData.WATER_11].has_collision = false;
        _tiles[TileData.WATER_12].has_collision = false;
    };
    TileData.DIM01_GROUND_GRASS = 0;
    TileData.DIM01_GROUND = 1;
    TileData.DIM02_GROUND_GRASS = 2;
    TileData.DIM02_GROUND = 3;
    TileData.SLOPE_0r1 = 4;
    TileData.SLOPE_0r2 = 4001;
    TileData.SLOPE_0r3 = 4002;
    TileData.SLOPE_0r4 = 4003;
    TileData.CHEST_01 = 5;
    TileData.STONE_01 = 6;
    TileData.SLOPE_1r1 = 7;
    TileData.SLOPE_1r2 = 7001;
    TileData.SLOPE_1r3 = 7002;
    TileData.SLOPE_1r4 = 7003;
    TileData.WALL_01 = 8;
    TileData.WATER_01 = 9;
    TileData.WATER_02 = 10;
    TileData.WATER_11 = 11;
    TileData.WATER_12 = 12;
    return TileData;
})();
var Tile = (function () {
    function Tile(index, offset, size) {
        this.index = index;
        this.offset = offset;
        this.size = size;
        this.collision = size.copy();
        this.has_collision = true;
    }
    Tile.prototype.add_model = function (batch, position, has_array) {
        new Error("Not Implemented");
    };
    return Tile;
})();
// NOTE: TILES
var TileSlope = (function (_super) {
    __extends(TileSlope, _super);
    function TileSlope(index, offset, size, direction) {
        _super.call(this, index, offset, size);
        this.direction = direction;
    }
    TileSlope.prototype.add_model = function (batch, position, has_array) {
        var absolute_position = position.copy().add(this.offset);
        batch.append_slope(absolute_position, this.size, this.index, this.direction, has_array);
    };
    return TileSlope;
})(Tile);
var TileChest = (function (_super) {
    __extends(TileChest, _super);
    function TileChest(index, offset, size) {
        _super.call(this, index, offset, size);
        var p = TILE_SIZE / 16.0;
        this.collision = new vec3([12 * p, 11 * p, 16 * p]);
    }
    TileChest.prototype.add_model = function (batch, position, has_array) {
        var absolute_position = position.copy().add(this.offset);
        batch.append_cube_texture_size(absolute_position, this.size, this.index, new vec3([12, 11, 12]), has_array);
    };
    return TileChest;
})(Tile);
var TileWater = (function (_super) {
    __extends(TileWater, _super);
    function TileWater(index, offset, size) {
        _super.call(this, index, offset, size);
        var p = TILE_SIZE / 16.0;
        this.collision = new vec3([16 * p, 10 * p, 16 * p]);
    }
    TileWater.prototype.add_model = function (batch, position, has_array) {
        var absolute_position = position.copy().add(this.offset);
        batch.append_cube_texture_size(absolute_position, this.size, this.index, new vec3([16, 10, 16]), has_array);
    };
    return TileWater;
})(Tile);
// NOTE: HELPER
var TileCube = (function (_super) {
    __extends(TileCube, _super);
    function TileCube(index, offset, size) {
        _super.call(this, index, offset, size);
    }
    TileCube.prototype.add_model = function (batch, position, has_array) {
        var absolute_position = position.copy().add(this.offset);
        batch.append_cube(absolute_position, this.size, this.index, has_array);
    };
    return TileCube;
})(Tile);
// NOTE: GENEREATE
TileData.generate();
//# sourceMappingURL=tiles.js.map