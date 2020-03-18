// Generated by LiveScript 1.3.1
var ChooseFont;
ChooseFont = function(opt){
  var this$ = this;
  opt == null && (opt = {});
  if (!(typeof xfl != 'undefined' && xfl !== null)) {
    console.warn("xfl not found - choosefont.js needs xfl for certain action to work.");
  }
  this.root = opt.root;
  this.metaUrl = opt.metaUrl;
  this.type = opt.type;
  this.wrapper = opt.wrapper;
  this.itemClass = opt.itemClass;
  this.cols = opt.cols;
  this.base = opt.base;
  this.disableFilter = opt.disableFilter;
  this.defaultFilter = opt.defaultFilter;
  this.opt = opt;
  if (!this.disableFilter) {
    this.disableFilter = function(){
      return false;
    };
  }
  this.root = typeof this.root === 'string'
    ? document.querySelector(this.root)
    : this.root;
  this.root.classList.add('choosefont');
  this.node = this.root.querySelector('.choosefont-content');
  this.input = this.root.querySelector('input');
  this.upload = this.root.querySelector('[data-action=upload]');
  if (!this.cols) {
    this.cols = 4;
  }
  if (!this.node) {
    this.node = document.createElement("div");
    this.node.classList.add('choosefont-content');
    this.root.appendChild(this.node);
  }
  if (this.upload && (typeof ldFile != 'undefined' && ldFile !== null)) {
    this.ldf = new ldFile({
      root: this.upload.querySelector('input', 0),
      type: 'bloburl'
    });
    this.ldf.on('load', function(it){
      var filename, ret, ref$, name, variant;
      filename = this$.ldf.root.files[0].name.replace(/\..*$/, '');
      ret = filename.split('-');
      ref$ = in$(ret[ret.length - 1], ChooseFont.variants)
        ? [ret.slice(0, ret.length - 1).join('-'), ret[ret.length - 1]]
        : [ret.join('-'), null], name = ref$[0], variant = ref$[1];
      return this$.load({
        name: name + "-" + (variant || 'Regular'),
        variant: variant,
        limited: !!this$.opt.limitUpload,
        path: it[0].result,
        ext: (/\.([0-9a-zA-Z]*)$/.exec(this$.ldf.root.files[0].name) || [])[1] || 'ttf'
      });
    });
  }
  this.root.querySelector('.btn-group');
  this.filter.value = {
    name: '',
    category: ''
  };
  return this;
};
ChooseFont.variants = ['Italic', 'Regular', 'Bold', 'ExtraBold', 'Medium', 'SemiBold', 'ExtraLight', 'Light', 'Thin', 'Black', 'BlackItalic', 'BoldItalic', 'ExtraBoldItalic', 'MediumItalic', 'LightItalic', 'ThinItalic', 'SemiBoldItalic', 'ExtraLightItalic', 'DemiBold', 'Heavy', 'UltraLight'];
ChooseFont.prototype = import$(Object.create(Object.prototype), {
  setConfig: function(opt){
    var that;
    if (that = opt.disableFilter) {
      this.disableFilter = that;
    }
    if (that = opt.defaultFilter) {
      this.defaultFilter = that;
    }
    import$(this.opt, opt);
    this.upload.classList.toggle('d-none', !(this.opt.enableUpload && (typeof ldFile != 'undefined' && ldFile !== null)));
    this.upload.classList.toggle('limited', this.opt.limitUpload);
    if (this.opt.enableUpload && !(typeof ldFile != 'undefined' && ldFile !== null)) {
      return console.warn("ldFile not found - upload function need ldFile to work.");
    }
  },
  applyFilters: function(o){
    var i$, to$, idx, f, disabled, this$ = this;
    if (o != null) {
      ['disableFilter', 'defaultFilter'].map(function(it){
        if (o[it]) {
          return this$[it] = o[it];
        }
      });
    }
    if (this.disableFilter && this.meta) {
      for (i$ = 0, to$ = this.meta.fonts.length; i$ < to$; ++i$) {
        idx = i$;
        f = this.meta.fonts[idx];
        disabled = this.disableFilter(f, idx);
        f[this.opt.limitHard ? 'disabled' : 'limited'] = disabled;
        if (f.limited) {
          f.html = f.html.replace(/disabled|enabled/, 'limited');
        } else if (!f.disabled) {
          f.html = f.html.replace(/disabled|limited/, 'enabled');
        }
      }
      return this.render();
    }
  },
  wrap: function(font, idx){
    var c;
    if (this.wrapper) {
      return this.wrapper(font, idx);
    }
    if (!this.type || this.type === 'grid' || this.type === 'list') {
      c = this.itemClass || '';
      return font.html = "<div class=\"item " + c + " disabled\" data-idx=\"" + idx + "\"><div class=\"inner\">\n  <div class=\"img\" style=\"background-position:" + font.x + "px " + font.y + "px\"></div>\n  <span>" + font.name + "</span>\n</div></div>";
    }
  },
  filter: function(f){
    var ref$, name, category, list;
    ref$ = f || this.filter.value || {}, name = ref$.name, category = ref$.category;
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
        rows_in_block: 50,
        no_data_text: 'found nothing ...'
      });
    }
    return this.cluster.update(html);
  },
  find: function(names){
    var this$ = this;
    names == null && (names = []);
    return names.map(function(it){
      var ret, ref$, name, variant;
      ret = it.split('-');
      ref$ = in$(ret[ret.length - 1], ChooseFont.variants)
        ? [ret.slice(0, ret.length - 1).join('-'), ret[ret.length - 1]]
        : [ret.join('-'), null], name = ref$[0], variant = ref$[1];
      return [name, variant];
    }).map(function(it){
      return [this$.fonts.hash[it[0]], it[1]];
    }).filter(function(it){
      return it[0];
    }).map(function(it){
      return [it[0][it[1]] || it[0].Regular || it[0], it[1]];
    });
  },
  load: function(font){
    var this$ = this;
    return new Promise(function(res, rej){
      var opt, path, name, ref$, variant;
      opt = {};
      if (font.path) {
        opt.ext = font.ext;
        opt.name = font.name;
        opt.variant = font.variant;
        path = font.path;
        name = ~font.name.indexOf('-')
          ? font.name.split('-')[0]
          : font.name;
        ((ref$ = this$.fonts.hash)[name] || (ref$[name] = {}))[opt.variant || 'Regular'] = font;
      } else {
        variant = !font.family.length
          ? ""
          : "-" + (~font.family.indexOf('Regular')
            ? 'Regular'
            : font.family[0]);
        path = this$.base + "/" + font.name + variant + (font.isSet ? '/' : '.ttf');
      }
      if (typeof xfl != 'undefined' && xfl !== null) {
        this$.fire('loading.font', font);
        return setTimeout(function(){
          return xfl.load(path, opt, function(it){
            if (font.limited) {
              it.limited = true;
            }
            this$.fire('choose', it, {
              limited: font.limited
            });
            return res(it);
          });
        }, 10);
      } else {
        this$.fire('choose.map', font, {
          limited: font.limited
        });
        return res(font);
      }
    });
  },
  prepare: function(){
    var i$, to$, idx, font, this$ = this;
    this.root.addEventListener('click', function(e){
      var tgt, idx, font, category, f, c;
      tgt = e.target;
      idx = tgt.getAttribute('data-idx');
      font = this$.meta.fonts[idx];
      if (font) {
        return font.disabled
          ? null
          : this$.load(font);
      }
      category = tgt.getAttribute('data-category');
      if (!(category != null)) {
        return;
      }
      f = this$.filter.value || {};
      Array.from(this$.root.querySelectorAll('*[data-category]')).map(function(it){
        return it.classList.remove('active');
      });
      c = (category || '').replace(' ', '_').toUpperCase();
      if (f.category === c || c === 'ALL') {
        f.category = null;
      } else {
        tgt.classList.add('active');
        f.category = c;
      }
      this$.root.querySelector('*[data-category-holder]').innerText = category || 'Family...';
      return this$.filter(f);
    });
    if (this.input) {
      this.input.addEventListener('keyup', function(e){
        this$.filter.value.name = e.target.value;
        this$.filter();
        return this$;
      });
    }
    this.fonts = {
      list: this.meta.fonts,
      hash: {}
    };
    if (this.disableFilter) {
      this.meta.fonts.map(function(d, i){
        return d[this$.opt.limitHard ? 'disabled' : 'limited'] = this$.disableFilter(d, i);
      });
    }
    if (this.defaultFilter) {
      this.fonts.list = this.fonts.list.filter(this.defaultFilter);
    }
    for (i$ = 0, to$ = this.meta.fonts.length; i$ < to$; ++i$) {
      idx = i$;
      font = this.meta.fonts[idx];
      this.fonts.hash[font.name] = import$(font, {
        x: -(idx % this.meta.dim.col) * this.meta.dim.width,
        y: -Math.floor(idx / this.meta.dim.col) * this.meta.dim.height
      });
      this.wrap(font, idx);
    }
    this.applyFilters();
    return this.render();
  },
  render: function(list){
    var ref$, html, line, i$, to$, idx;
    if (!this.node || !this.fonts) {
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
function in$(x, xs){
  var i = -1, l = xs.length >>> 0;
  while (++i < l) if (x === xs[i]) return true;
  return false;
}
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}
