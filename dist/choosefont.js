// Generated by LiveScript 1.3.1
var ChooseFont;
ChooseFont = function(arg$){
  var node, metaUrl, type, wrapper, itemClass, cols, base;
  node = arg$.node, metaUrl = arg$.metaUrl, type = arg$.type, wrapper = arg$.wrapper, itemClass = arg$.itemClass, cols = arg$.cols, base = arg$.base;
  if (node != null) {
    node = typeof node === 'string' ? document.querySelector(node) : node;
    node.classList.add('choosefont');
  }
  this.node = node;
  this.metaUrl = metaUrl;
  this.type = type;
  this.wrapper = wrapper;
  this.itemClass = itemClass;
  this.cols = cols;
  this.base = base;
  if (!this.cols) {
    this.cols = 4;
  }
  return this;
};
ChooseFont.prototype = import$(Object.create(Object.prototype), {
  wrap: function(font, idx){
    if (this.wrapper) {
      return this.wrapper(font, idx);
    }
    if (!this.type || this.type === 'grid' || this.type === 'list') {
      return font.html = "<div class=\"item " + (this.itemClass || '') + "\" data-idx=\"" + idx + "\"><div class=\"inner\">\n  <div class=\"img\" style=\"background-position:" + font.x + "px " + font.y + "px\"></div>\n  <span>" + font.name + "</span>\n</div></div>";
    }
  },
  filter: function(arg$){
    var name, category, list;
    name = arg$.name, category = arg$.category;
    name = (name || '').toLowerCase();
    list = this.fonts.list.filter(function(it){
      return (!name || ~it.name.toLowerCase().indexOf(name)) && (!category || (it.category || []).filter(function(it){
        return ~(it || '').indexOf(category);
      }).length);
    });
    return this.render(list);
  },
  clusterize: function(html){
    if (!(typeof Clusterize != 'undefined' && Clusterize !== null)) {
      this.node.innerHTML = html.join('');
      return;
    }
    if (!this.cluster) {
      this.node.classList.add('clusterize-scroll');
      this.node.innerHTML = '<div class="clusterize-content"></div>';
      this.cluster = new Clusterize({
        html: [],
        scrollElem: this.node,
        contentElem: this.node.querySelector('.clusterize-content'),
        rows_in_block: 50
      });
    }
    return this.cluster.update(html);
  },
  find: function(names){
    var this$ = this;
    names == null && (names = []);
    return names.map(function(it){
      return it.split('-').filter(function(it){
        return it;
      });
    }).map(function(it){
      return [this$.fonts.hash[it[0]], it[1]];
    }).filter(function(it){
      return it[0];
    });
  },
  load: function(font){
    var this$ = this;
    return new Promise(function(res, rej){
      var family, path;
      family = !font.family.length
        ? ""
        : "-" + (font.family.indexOf('Regular')
          ? 'Regular'
          : font.family[0]);
      path = this$.base + "/" + font.name + family + (font.isSet ? '/' : '.ttf');
      if (typeof xfl != 'undefined' && xfl !== null) {
        return xfl.load(path, function(it){
          this$.fire('choose', it);
          return res(it);
        });
      } else {
        this$.fire('choose.map', font);
        return res(font);
      }
    });
  },
  prepare: function(){
    var i$, to$, idx, font, this$ = this;
    if (this.node) {
      this.node.addEventListener('click', function(e){
        var idx, font;
        idx = e.target.getAttribute('data-idx');
        font = this$.fonts.list[idx];
        if (!font) {
          return;
        }
        return this$.load(font);
      });
    }
    this.fonts = {
      list: this.meta.fonts,
      hash: {}
    };
    for (i$ = 0, to$ = this.meta.fonts.length; i$ < to$; ++i$) {
      idx = i$;
      font = this.meta.fonts[idx];
      this.fonts.hash[font.name] = import$(font, {
        x: -(idx % this.meta.dim.col) * this.meta.dim.width,
        y: -Math.floor(idx / this.meta.dim.col) * this.meta.dim.height
      });
      this.wrap(font, idx);
    }
    return this.render();
  },
  render: function(list){
    var ref$, html, line, i$, to$, idx;
    if (!this.node) {
      return;
    }
    if (!list) {
      list = this.fonts.list;
    }
    if (this.type === 'grid' || !this.type) {
      ref$ = [[], []], html = ref$[0], line = ref$[1];
      for (i$ = 0, to$ = list.length; i$ < to$; ++i$) {
        idx = i$;
        line.push(list[idx].html);
        if (line.length >= this.cols) {
          html.push(line);
          line = [];
        }
      }
      if (line.length) {
        html.push(line);
      }
      return this.clusterize(html.map(function(it){
        return "<div class=\"line\"><div class=\"inner\">" + it.join('') + "</div></div>";
      }));
    } else if (this.type === 'list') {
      return this.clusterize(list.map(function(it){
        return it.html;
      }));
    }
  },
  on: function(name, cb){
    var ref$;
    return ((ref$ = this.handler || (this.handler = {}))[name] || (ref$[name] = [])).push(cb);
  },
  fire: function(name, payload){
    var ref$;
    return ((ref$ = this.handler || (this.handler = {}))[name] || (ref$[name] = [])).map(function(it){
      return it(payload);
    });
  },
  init: function(cb){
    var this$ = this;
    return new Promise(function(res, rej){
      var cb, xhr;
      if (!cb) {
        cb = function(){};
      }
      if (!this$.metaUrl) {
        return cb(null);
      }
      xhr = new XMLHttpRequest();
      xhr.addEventListener('readystatechange', function(){
        var e;
        if (xhr.readyState !== 4) {
          return;
        }
        if (xhr.status !== 200) {
          return rej(xhr.responseText);
        }
        try {
          this$.meta = JSON.parse(xhr.responseText);
        } catch (e$) {
          e = e$;
          return rej(e);
        }
        this$.prepare();
        if (cb) {
          cb();
        }
        return res();
      });
      xhr.open('GET', this$.metaUrl);
      xhr.onerror = function(it){
        return rej(it);
      };
      return xhr.send();
    });
  }
});
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}
