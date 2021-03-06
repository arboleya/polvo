;(function(){
  var host = window.location.protocol + '//' + window.location.hostname;
  var reloader = io.connect( host, {port: 53211} );
  reloader.on("refresh", function(data)
  {
    var i, suspects, suspect, newlink, href, nocache;

    // javascript = reload
    if(data.type == 'js')
      return location.reload();

    // css = add new + remove old
    if(data.type == 'css') {
      newlink = document.createElement('link');
      newlink.setAttribute('rel', 'stylesheet');
      newlink.setAttribute('type', 'text/css');

      suspects = document.getElementsByTagName('link');
      for( i=suspects.length; i>= 0; --i)
      {
        suspect = suspects[i]
        if( suspect == null) continue;

        href = suspect.getAttribute('href');
        name = href != null ? href.split('/').pop() : null;

        if (name && ~name.indexOf(data.css_output))
        {
          nocache = '?nocache=' + new Date().getTime()
          newlink.setAttribute('href', data.css_output + nocache);
          suspect.parentNode.appendChild(newlink);
          setTimeout(function(){
            suspect.parentNode.removeChild(suspect);
          }, 100);
          break;
        }
      }
    }
  });
})();