choosefont = ({node, meta-url, type, wrapper, itemClass, cols, base}) ->
  node = if typeof(node) == \string => document.querySelector(node) else node
  node.classList.add \choosefont
  @ <<< {node, meta-url, type, wrapper, itemClass, cols, base}
  if !@cols => @cols = 4
  return @

choosefont.prototype = do
  wrap: (font, idx) ->
    if @wrapper => return @wrapper font, idx
    if !@type or @type == \grid or @type == \list =>
      font.html = """
        <div class="item #{@itemClass or ''}" data-idx="#idx"><div class="inner">
          <div class="img" style="background-position:#{font.x}px #{font.y}px"></div>
          <span>#{font.name}</span>
        </div></div>
      """
  filter: ({name, category}) ->
    name = (name or '').toLowerCase!
    list = @fonts.list.filter ->
      (!name or ~it.name.toLowerCase!indexOf(name)) and
      (!category or (it.category or []).filter(->~(it or '').indexOf(category)).length)
    @render list

  clusterize: (html) ->
    if !(Clusterize?) =>
      @node.innerHTML = html.join('')
      return
    if !@cluster =>
      @node.classList.add \clusterize-scroll
      @node.innerHTML = '<div class="clusterize-content"></div>'
      @cluster = new Clusterize do
        html: []
        scrollElem: @node
        contentElem: @node.querySelector('.clusterize-content')
        rows_in_block: 50
    @cluster.update html
  prepare: ->
    @node.addEventListener \click, (e) ~>
      idx = e.target.getAttribute \data-idx
      font = @fonts.list[idx]
      if !font => return
      family = if !font.family.length => ""
      else "-" + (if font.family.indexOf(\Regular) => \Regular else font.family.0)
      path = "#{@base}/#{font.name}#family#{if font.isSet => '/' else '.ttf'}"
      if xfl? => xfl.load path, ~> @fire \choose, it
      else @fire \choose.map, font

    @fonts = list: @meta.fonts, hash: {}
    for idx from 0 til @meta.fonts.length =>
      font = @meta.fonts[idx]
      @fonts.hash[font.name] = font <<< do
        x: -(idx % @meta.dim.col) * @meta.dim.width
        y: -Math.floor(idx / @meta.dim.col) * @meta.dim.height
      @wrap font, idx
    @render!

  render: (list) ->
    if !list => list = @fonts.list
    if @type == \grid or !@type =>
      [html, line] = [[], []]
      for idx from 0 til list.length =>
        line.push list[idx].html
        if line.length >= @cols =>
          html.push line
          line = []
      if line.length => html.push line
      @clusterize html.map(-> """<div class="line"><div class="inner">#{it.join('')}</div></div>""")

    else if @type == \list => 
      @clusterize list.map(-> it.html)

  on: (name, cb) -> @{}handler[][name].push cb
  fire: (name, payload) -> @{}handler[][name].map -> it payload

  init: (cb) ->
    if !cb => cb = (->)
    if !(@node and @meta-url) => return cb null
    xhr = new XMLHttpRequest!
    xhr.addEventListener \readystatechange, ~>
      if xhr.readyState != 4 => return
      @meta = JSON.parse(xhr.responseText)
      @prepare!
    #TODO cache this
    xhr.open \GET, @meta-url
    xhr.send!

