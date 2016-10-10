var css = {
  border: "1"
}

var Timetable = React.createClass({
  getInitialState: function() {
    return {scheduledItems: []};
  },
  loadTimetable: function() {
    $.ajax({
      url: this.props.url + "?callback=parseResponse",
      type: 'GET',
      dataType: 'JSONP',
      jsonpCallback: 'callback',
      cache: false,
      success: function(timetable) {
        this.setState({scheduledItems: timetable.scheduledItems});
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
    var tasks = this.state.scheduledItems.map(function(scheduledItem) {
      var taskId = (scheduledItem.typeOf == "Buffer") ? scheduledItem.firstTask.taskId.id : scheduledItem.task.taskId.id;
      var taskName = (scheduledItem.typeOf == "Buffer") ? scheduledItem.firstTask.name + " / " + scheduledItem.secondTask.name : scheduledItem.task.name;

      return (
        <tr>
          <td>{taskId}</td>
          <td>{taskName}</td>
        </tr>
      );
    });

    return (
      <table>
        {tasks}
      </table>
    );
  }
});

//var ScheduledTask = React.createClass({
//
//});

ReactDOM.render(<Timetable url="http://localhost:9000/timetable/today" pollInterval={2000}/>, document.getElementById('timetable'))
