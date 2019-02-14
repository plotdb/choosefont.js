// Generated by LiveScript 1.3.1
$(document).ready(function(){
  var fontbase, fontinfo, textarea, modalChooser, dropdownChooser, listChooser, filter;
  fontbase = "https://plotdb.github.io/xl-fontset/alpha";
  fontinfo = "assets/fontinfo";
  textarea = document.querySelector('#demo-textarea');
  modalChooser = new ChooseFont({
    node: '#demo-modal .choosefont',
    metaUrl: fontinfo + "/meta.json",
    base: fontbase
  });
  modalChooser.init();
  modalChooser.on('choose', function(){
    return $('#demo-modal').modal('hide');
  });
  dropdownChooser = new ChooseFont({
    node: '#demo-dropdown',
    metaUrl: fontinfo + "/meta.json",
    itemClass: 'dropdown-item',
    type: 'list',
    base: fontbase
  });
  dropdownChooser.init();
  dropdownChooser.on('choose', function(font){});
  listChooser = new ChooseFont({
    node: '#demo-list-group',
    metaUrl: fontinfo + "/meta.json",
    itemClass: 'list-group-item',
    type: 'list',
    base: fontbase
  });
  listChooser.init();
  [modalChooser, listChooser, dropdownChooser].map(function(it){
    return it.on('choose', function(font){
      return font.sync(textarea.value, function(){
        return textarea.style.fontFamily = font.name;
      });
    });
  });
  filter = {
    name: '',
    category: ''
  };
  document.querySelector('#demo-modal .btn-group').addEventListener('click', function(e){
    var category;
    Array.from(e.target.parentNode.childNodes).map(function(it){
      return it.classList.remove('active');
    });
    category = (e.target.innerText || '').replace(' ', '_').toUpperCase();
    if (filter.category === category) {
      filter.category = null;
    } else {
      e.target.classList.add('active');
      filter.category = category;
    }
    return modalChooser.filter(filter);
  });
  document.querySelector('#demo-modal input').addEventListener('keyup', function(e){
    filter.name = e.target.value;
    return modalChooser.filter(filter);
  });
  xfl.load(fontbase + "/CroissantOne-Regular.ttf");
  return xfl.load(fontbase + "/Gafata-Regular.ttf");
});