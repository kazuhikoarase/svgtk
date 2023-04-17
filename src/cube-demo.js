//
// cube demo
//
// Copyright (c) 2023 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//  http://www.opensource.org/licenses/mit-license.php
//

'use strict'

window.addEventListener('load', function() {

  var $ = svgtk.domWrapper;

  // plain
  /*
  var colors = [
    '#0f0', // green
    '#00f', // blue
    '#fff', // white
    '#ff0', // yellow
    '#f00', // red
    '#f90', // orange
  ];
*/
  // classic colors.
  var colors = [
    '#009900', // green
    '#3366cc', // blue
    '#ffffff', // white
    '#ffff00', // yellow
    '#cc0033', // red
    '#ff9933', // orange
  ];

  var cb = cube.create({
    defaultAngles : { t : -25, p : 60, z : 0 },
    width : 260, height : 260,
    cubeScale : 50,
    getColor : function(rect) {
      return rect != null? colors[rect.r] : '#666';
    }
  });

  document.getElementById('cube').appendChild(cb.$el);

  ['t', 'p', 'z'].forEach(function(id) {
    $(document.getElementById(id) ).attrs({
      min: -180, max: 180, step: 'any', value : '' + cb.model.angles[id]
    }).on('input', function(event) {
      var angles = cb.model.angles;
      angles[id] = +event.target.value;
      cb.update();
    });
  });

  !function() {

    var parseCommand = function(event) {
      if (event.code == 'Digit0' ) {
        return '0';
      } else if (
          event.code == 'KeyU' ||
          event.code == 'KeyD' ||
          event.code == 'KeyL' ||
          event.code == 'KeyR' ||
          event.code == 'KeyF' ||
          event.code == 'KeyB' ||
          event.code == 'KeyS' ||
          event.code == 'KeyM' ||
          event.code == 'KeyE'
       ) {
        // UDLRFBSME
        var cmd = event.code.substring(3);
        if (event.shiftKey) {
          cmd += "'";
        }
        return cmd;
      }
      return '';
    };

    var keypress = false;

    $(document).on('keydown', function(event) {

      var keyupHandler = function(event) {
        event.preventDefault();
        keypress = false;
        $(document).off('keyup', keyupHandler);
        // rotate
        cb.execRotation(cmd);
        // reset motion with rotation.
        cb.execCommand('');
      };

      if (keypress) {
        return;
      }

      var cmd = parseCommand(event);
      if (cmd) {
        event.preventDefault();
        keypress = true;
        $(document).on('keyup', keyupHandler);
        // set motion.
        cb.execCommand(cmd);
      }
    });
  }();

  // color sample
  !function(colors) {
    var $sample = $(document.createElement('div') ).style({
      border : '1px #ccc solid', display : 'inline-block', height : '16px'
    });
    colors.forEach(function(color) {
      $sample.append($(document.createElement('span') ).style({
        display : 'inline-block', width : '16px', height : '16px',
        verticalAlign : 'top', backgroundColor : color
      }) );
    });
    document.body.appendChild($sample.$el);
  }(colors);

  !function() {
    var $keys = $(document.getElementById('keys') );
    [
      { key : '0', label : 'Reset' },
      { key : 'F', label : 'Front' },
      { key : 'B', label : 'Back' },
      { key : 'U', label : 'Up' },
      { key : 'D', label : 'Down' },
      { key : 'L', label : 'Left' },
      { key : 'R', label : 'Right' },
    ].forEach(function(param, i) {
      if (i > 0) {
        $keys.append($(document.createElement('span') ).props({
          textContent : ' '
        }) );
      }
      $keys.append($(document.createElement('span') ).props({
        textContent : param.label + '('
      }) );
      $keys.append($(document.createElement('span') ).
          style({ textDecoration : 'underline' }).props({
        textContent : param.key
      }) );
      $keys.append($(document.createElement('span') ).props({
        textContent : ')'
      }) );
    });
  }();

});
