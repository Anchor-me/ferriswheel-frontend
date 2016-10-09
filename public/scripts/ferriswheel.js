var Timetable = React.createClass({
  getInitialState: function() {
    return {tasks: []};
  },
  loadTimetable: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(timetable) {
        this.setState({tasks: timetable.scheduledItems});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loadTimetable();
    setInterval(this.loadTimetable, this.props.pollInterval);
  },
  render: function() {
    var tasks = this.state.tasks.map(function(task) {
      return (
        <row>
          <name>{task.}</name>
        </row>
      );
    });

    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var ScheduledTask = React.createClass({

});

ReactDOM.render(<Timetable url="localhost:9000/timetable/today" pollInterval={2000}/>, document.getElementById('timetable'))
