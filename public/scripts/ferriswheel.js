var css = {
  border: "1"
}

function getName(scheduledItem) {
  return (scheduledItem.typeOf == "Buffer") ? scheduledItem.firstTask.name + " / " + scheduledItem.secondTask.name : scheduledItem.task.name;
}

function getTime(dateTime) {
  return renderHours(dateTime.hours) + ":" + renderMinutes(dateTime.minutes);
}

function getDuration(block) {
  return getTime(block.start) + " - " + getTime(block.finish);
}

function renderHours(hours) {
  if (hours.toString().length == 1) {
    return "0" + hours;
  }
  else {
    return hours;
  }
}

function renderMinutes(minutes) {
  if (minutes.toString().length == 1) {
    return "0" + minutes;
  }
  else {
    return minutes;
  }
}


var Timetable = React.createClass({
  getInitialState: function() {
    return {scheduledItems: []};
  },
  getTaskId: function() {
    return "Your face!";
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
      var name = getName(scheduledItem);
      var duration = getDuration(scheduledItem);

      return (
        <tr>
          <td>{name}</td>
          <td>{duration}</td>
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
