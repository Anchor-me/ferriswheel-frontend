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

function renderStatus(scheduledItem) {
  if(scheduledItem.typeOf == "Buffer") {
    return "";
  }
  else {
    var status = scheduledItem.task.statusType;
    var symbol;

    switch(status) {
      case "Unknown":
        symbol = "btn btn-primary btn-sm glyphicon glyphicon-question-sign";
        break;
      case "NotReached":
        symbol = "";
        break;
      case "NotStarted":
        symbol = "btn btn-danger btn-sm glyphicon glyphicon-remove";
        break;
      case "Incomplete":
        symbol = "btn btn-warning btn-sm glyphicon glyphicon-warning-sign";
        break;
      case "Complete":
        symbol = "btn btn-success btn-sm glyphicon glyphicon-ok";
    }

    return symbol;
  }
}


var Timetable = React.createClass({
  getInitialState: function() {
    return {
      scheduledItems: []
    };
  },
  isActive: function(){},
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
      var status = renderStatus(scheduledItem);

      return (
        <tr>
          <td>{name}</td>
          <td>{duration}</td>
          <td className="status"><span className={status}></span>
          </td>
        </tr>
      );
    });

    return (
      <table className="table table-bordered table-hover table-inverse">
        <tbody>
          {tasks}
        </tbody>
      </table>
    );
  }
});

//var ScheduledTask = React.createClass({
//
//});

ReactDOM.render(<Timetable url="http://localhost:9000/timetable/today" pollInterval={2000}/>, document.getElementById('timetable'));
