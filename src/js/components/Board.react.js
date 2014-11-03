/** @jsx React.DOM */
var _ = require('lodash');
var React = require('react/addons');
var Cell = require('./Cell.react');
var Timer = require('./Timer.react');
var CellActionCreators = require('../actions/CellActionCreators');
var BoardActionCreators = require('../actions/BoardActionCreators');
var MinesweeperStore = require('../stores/MinesweeperStore');

var Board = React.createClass({
  getInitialState: function() {
    return {
      rows: this.props.rows
    };
  },
  componentDidMount: function() {
    MinesweeperStore.addChangeListener(this._onChange, this);
  },
  render: function() {
    var classes = React.addons.classSet({
      'game-lost': this.isLost(),
      'game-won': this.isWon()
    });
    return (
      <div>
        <h3 onClick={this.reset} className={classes}>Minesweeper</h3>
        <table>
          <tbody>
            {this.getRows()}
          </tbody>
        </table>
      </div>
    );
  },
  gameOver: function() {
    return _.all(this.state.rows, function(row) {
      return _.all(row, function(cell) {
        return cell.isClicked || cell.isBomb
      });
    });
  },
  isWon: function() {
    return _.all(this.state.rows, function(row) {
      return _.all(row, function(cell) {
        return (cell.isBomb && !cell.isClicked) || (!cell.isBomb && cell.isClicked)
      });
    });
  },
  isLost: function() {
    return _.any(this.state.rows, function(row) {
      return _.any(row, function(cell) {
        return cell.isClicked && cell.isBomb
      });
    });
  },
  getRows: function() {
    var me = this;
    return _.map(this.state.rows, function(row) {
      return (
        <tr>
          {me.getCells(row)}
        </tr>
      );
    })
  },
  getCells: function(row) {
    var me = this;
    return _.map(row, function(cellInfo) {
      return me.getCellComponent(cellInfo);
    });
  },
  getCellComponent: function(info) {
    return <Cell isBomb={info.isBomb}
                 isClicked={info.isClicked}
                 isFlagged={info.isFlagged}
                 bombCount={info.bombCount}
                 location={info.location}
                 onRightClick={this.cellRightClicked}
                 onOpen={this.cellClicked} />;
  },
  _onChange: function() {
    this.setState({
      rows: MinesweeperStore.getState().rows
    });
  },
  cellClicked: function(location) {
    CellActionCreators.receiveClick(location);
  },
  cellRightClicked: function(location) {
    CellActionCreators.receiveRightClick(location);
  },
  reset: function() {
    console.log('reset...');
    BoardActionCreators.receiveReset(this.state.rows.length);
  }
});

module.exports = Board;
