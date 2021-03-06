var React = require('react');
var Classable = require('../mixins/classable');
var Dom = require('../utils/dom.js');
var RippleCircle = require('./circle.jsx');

var TouchRipple = React.createClass({

  mixins: [Classable],

  propTypes: {
    className: React.PropTypes.string
  },

  getInitialState: function() {
    return {
      ripples: [{
        key: 0,
        started: false,
        ending: false
      }] 
    };
  },

  render: function() {
    var classes = this.getClasses('mui-touch-ripple');

    return (
      <div className={classes}>
        {this._getRippleElements()}
      </div>
    );
  },

  start: function(e) {
    var ripples = this.state.ripples;
    var nextKey = ripples[ripples.length-1].key + 1;
    var style = e ? this._getRippleStyle(e) : {};

    //Start the next unstarted ripple
    for (var i = 0; i < ripples.length; i++) {
      if (!ripples[i].started) {
        ripples[i].started = true;
        ripples[i].style = style;
        break;
      }
    };

    //Add an unstarted ripple at the end
    ripples.push({
      key: nextKey,
      started: false,
      ending: false
    });

    //Re-render
    this.setState({
      ripples: ripples
    });
  },

  end: function() {
    var ripples = this.state.ripples;

    //End the the next un-ended ripple
    for (var i = 0; i < ripples.length; i++) {
      if (!ripples[i].ending) {
        ripples[i].ending = true;
        break;
      }
    };

    //Re-render
    this.setState({
      ripples: ripples
    });

    //Wait 2 seconds and remove the ripple from DOM
    setTimeout(function() {
      ripples.shift();
      this.setState({
        ripples: ripples
      });
    }.bind(this), 2000);
  },

  _getRippleStyle: function(e) {
    var style = {};
    var el = this.getDOMNode();
    var elHeight = el.offsetHeight;
    var elWidth = el.offsetWidth;
    var offset = Dom.offset(el);
    var pageX = e.pageX == undefined ? e.nativeEvent.pageX : e.pageX;
    var pageY = e.pageY == undefined ? e.nativeEvent.pageY : e.pageY;
    var pointerX = pageX - offset.left;
    var pointerY = pageY - offset.top;
    var topLeftDiag = this._calcDiag(pointerX, pointerY);
    var topRightDiag = this._calcDiag(elWidth - pointerX, pointerY);
    var botRightDiag = this._calcDiag(elWidth - pointerX, elHeight - pointerY);
    var botLeftDiag = this._calcDiag(pointerX, elHeight - pointerY);
    var rippleRadius = Math.max(
      topLeftDiag, topRightDiag, botRightDiag, botLeftDiag
    );
    var rippleSize = rippleRadius * 2;
    var left = pointerX - (rippleRadius);
    var top = pointerY - (rippleRadius);
    
    style.height = rippleSize + 'px';
    style.width = rippleSize + 'px';
    style.top = top + 'px';
    style.left = left + 'px';

    return style;
  },

  _calcDiag: function(a, b) {
    return Math.sqrt((a * a) + (b * b));
  },

  _getRippleElements: function() {
    return this.state.ripples.map(function(ripple) {
      return (
        <RippleCircle
          key={ripple.key}
          started={ripple.started}
          ending={ripple.ending}
          style={ripple.style} />
      );
    }.bind(this));
  }

});

module.exports = TouchRipple;