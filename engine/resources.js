var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Resource = (function () {
    function Resource(handle) {
        this.loaded = false;
        this.handle = handle;
    }
    return Resource;
})();
var FileResource = (function (_super) {
    __extends(FileResource, _super);
    function FileResource(handle, filename) {
        this.filename = filename;
        this.content = "";
        _super.call(this, handle);
    }
    return FileResource;
})(Resource);
var TextureResource = (function (_super) {
    __extends(TextureResource, _super);
    function TextureResource(handle, filename, engine, options) {
        var _this = this;
        if (options === void 0) { options = null; }
        this.filename = filename;
        this.options = options;
        this.engine = engine;
        this.image = new Image();
        this.image.onload = function () {
            _this.texture = new ImageTexture(_this.engine, _this.image, false, _this.options);
            _this.loaded = true;
            Loader.CheckLoaded();
        };
        this.image.src = filename;
        _super.call(this, handle);
    }
    return TextureResource;
})(Resource);
var ShaderResource = (function (_super) {
    __extends(ShaderResource, _super);
    function ShaderResource(handle, engine, vert, frag, uniforms) {
        var _this = this;
        this.vert = vert;
        this.frag = frag;
        this.uniforms = uniforms;
        this.engine = engine;
        this.interval = setInterval(function () {
            var vertOk = _this.vert == null || _this.vert.loaded;
            var fragOk = _this.frag == null || _this.frag.loaded;
            if (vertOk && fragOk) {
                clearInterval(_this.interval);
                _this.shader = new Shader(_this.engine, _this.vert == null ? null : _this.vert.content, _this.frag == null ? null : _this.frag.content);
                _this.shader.customUniforms = _this.uniforms;
                _this.loaded = true;
                Loader.CheckLoaded();
            }
        }, 100);
        _super.call(this, handle);
    }
    return ShaderResource;
})(Resource);
var MusicResource = (function (_super) {
    __extends(MusicResource, _super);
    function MusicResource(handle, filename, options) {
        var _this = this;
        if (options === void 0) { options = null; }
        this.filename = filename;
        this.options = options;
        this.audio = new Audio();
        this.audio.src = this.filename;
        this.audio.load();
        this.audio.onloadeddata = function () {
            _this.music = new Music(_this.audio, (options != null ? options["loop"] : false));
            _this.loaded = true;
            Loader.CheckLoaded();
        };
        _super.call(this, handle);
    }
    return MusicResource;
})(Resource);
var SoundResource = (function (_super) {
    __extends(SoundResource, _super);
    function SoundResource(handle, filename, count, options) {
        var _this = this;
        if (options === void 0) { options = null; }
        this.filename = filename;
        this.options = options;
        this.audios = [];
        this.loadCount = count;
        for (var i = 0; i < count; i++) {
            this.audios[i] = new Audio();
            this.audios[i].src = this.filename;
            this.audios[i].load();
            this.audios[i].onloadeddata = function () {
                _this.loadCount--;
                if (_this.loadCount == 0) {
                    _this.sound = new Sound(_this.audios);
                    _this.loaded = true;
                    Loader.CheckLoaded();
                }
            };
        }
        _super.call(this, handle);
    }
    return SoundResource;
})(Resource);
var Loader = (function () {
    function Loader() {
    }
    Loader.CheckLoaded = function () {
        for (var id in Loader.Resources) {
            var res = Loader.Resources[id];
            if (!res.loaded) {
                Loader.Loaded = false;
                return;
            }
        }
        Loader.Loaded = true;
    };
    Loader.ReadShaderResource = function (engine, base_path, uniforms) {
        if (uniforms === void 0) { uniforms = null; }
        var vertResource = Loader.ReadFileResource(base_path + ".v");
        var fragResource = Loader.ReadFileResource(base_path + ".f");
        var handle = Loader.Resources.length;
        var resource = new ShaderResource(handle, engine, vertResource, fragResource, uniforms);
        Loader.Resources.push(resource);
        Loader.CheckLoaded();
        return resource;
    };
    Loader.ReadFileResource = function (filename) {
        var handle = Loader.Resources.length;
        var resource = new FileResource(handle, filename);
        Loader.Resources.push(resource);
        Loader.CheckLoaded();
        var request = new XMLHttpRequest();
        request.onreadystatechange = function (event) {
            if (request.readyState != 4 || request.status != 200)
                return;
            resource.content = request.responseText;
            resource.loaded = true;
            Loader.CheckLoaded();
        };
        request.open("get", filename, true);
        request.send();
        return resource;
    };
    Loader.ReadTextureResource = function (engine, filename, options) {
        if (options === void 0) { options = null; }
        var handle = Loader.Resources.length;
        var resource = new TextureResource(handle, filename, engine, options);
        Loader.Resources.push(resource);
        Loader.CheckLoaded();
        return resource;
    };
    Loader.ReadSoundResource = function (filename, count) {
        var handle = Loader.Resources.length;
        console.log(handle);
        var resource = new SoundResource(handle, filename, count);
        Loader.Resources.push(resource);
        Loader.CheckLoaded();
        return resource;
    };
    Loader.ReadMusicResource = function (filename, options) {
        if (options === void 0) { options = null; }
        var handle = Loader.Resources.length;
        console.log(handle);
        var resource = new MusicResource(handle, filename, options);
        Loader.Resources.push(resource);
        Loader.CheckLoaded();
        return resource;
    };
    Loader.Loaded = false;
    Loader.Resources = [];
    return Loader;
})();
//# sourceMappingURL=resources.js.map