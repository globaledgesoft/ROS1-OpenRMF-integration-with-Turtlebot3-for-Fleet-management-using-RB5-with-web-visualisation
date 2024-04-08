import React, { Component } from "react";
import Config from "../scripts/config";

class Map extends Component {
  state = {
    ros: null,
  };

  constructor() {
    super();
    //this.init_connection = this.view_map.bind(this);
    this.view_map_0 = this.view_map_0.bind(this);
    //this.view_map_1= this.view_map_1.bind(this);
    //this.view_map_2= this.view_map_2.bind(this);
  }

  init_connection() {
    //this.setState({ ros: new ROSLIB.Ros() });
    this.state.ros = new window.ROSLIB.Ros();
    console.log("Map:" + this.state.ros);
    try {
      this.state.ros.connect(
        "ws://" +
          Config.ROSBRIDGE_SERVER_IP +
          ":" +
          Config.ROSBRIDGE_SERVER_PORT +
          ""
      );
    } catch (error) {
      console.log(
        "ws://" +
          Config.ROSBRIDGE_SERVER_IP +
          ":" +
          Config.ROSBRIDGE_SERVER_PORT +
          ""
      );
      console.log("cannot connect to the WS robot. Try again after 1 second");
    }
  }

  componentDidMount() {
    this.init_connection();
    console.log("Map: componentDidMount" + this.state.ros);
    this.view_map_0();
    //this.view_map_1();
    //this.view_map_2();
  }
/*
  handleRobotButtonClick(robotName) {
    // Change the behavior based on the clicked robot button
    // For simplicity, let's assume you have a service to send a goal to the robot
    const goalTopic = new window.ROSLIB.Topic({
      ros: this.state.ros,
      name: `/${robotName}/move_base_simple/goal`,
      messageType: 'geometry_msgs/PoseStamped',
    });
    const goal = {
      header: { frame_id: 'map' },
      pose: {
        position: { x: 6.6922299, y: 0.575584, z: 0.0 },
        orientation: { x: 0.0, y: 0.0, z: 0.744092, w: 0.668078 },
      },
    };
    const goalMsg = new window.ROSLIB.Message(goal);
    goalTopic.publish(goalMsg);
  }
*/







handleRobotButtonClick(robotName, goal) {
  // Change the behavior based on the clicked robot button
  // For simplicity, let's assume you have a topic to send a goal to the robot
  const goalTopic = new window.ROSLIB.Topic({
    ros: this.state.ros,
    name: `/${robotName}/move_base_simple/goal`,
    messageType: 'geometry_msgs/PoseStamped',
  });

  const goalMsg = new window.ROSLIB.Message(goal);
  goalTopic.publish(goalMsg);

  console.log(`${robotName} robot moved to the specified goal!`);
}




view_map_0(){
   
  var viewer = new window.ROS2D.Viewer({
  divID: 'map',
  width: 640,
  height: 480
  });
   
  let gridClient = new window.ROS2D.OccupancyGridClient({
  ros: this.state.ros,
  rootObject: viewer.scene,
  });

  var navClient_tb3_0 = new window.NAV2D.OccupancyGridClientNav({
    ros: this.state.ros,
    rootObject: viewer.scene,
    viewer: viewer,
    serverName: "/tb3_0/move_base",
    withOrientation: true,
    continuous: true,
  });


 var navClient_tb3_1 = new window.NAV2D.OccupancyGridClientNav({
    ros: this.state.ros,
    rootObject: viewer.scene,
    viewer: viewer,
    serverName: "/tb3_1/move_base",
    withOrientation: true,
  });


  

  var navClient_tb3_2 = new window.NAV2D.OccupancyGridClientNav({
    ros: this.state.ros,
    rootObject: viewer.scene,
    viewer: viewer,
    serverName: "/tb3_2/move_base",
    withOrientation: true,
  });

  var pathView_0 = new window.ROS2D.PathShape({
    ros: this.state.ros,
    strokeSize: 0.05,
    strokeColor: "red",
  });

  var pathView_1 = new window.ROS2D.PathShape({
    ros: this.state.ros,
    strokeSize: 0.05,
    strokeColor: "green",
  });

  var pathView_2 = new window.ROS2D.PathShape({
    ros: this.state.ros,
    strokeSize: 0.05,
    strokeColor: "blue",
  });
  
  // Check if navClient.rootObject is defined before adding pathView
  if (1) {
    viewer.scene.addChild(pathView_0);
    viewer.scene.addChild(pathView_1);
    viewer.scene.addChild(pathView_2);
  
    var pathTopic_0 = new window.ROSLIB.Topic({
        ros: this.state.ros,
        name: '/tb3_0/move_base/NavfnROS/plan',
        messageType: 'nav_msgs/Path',
    });
    var pathTopic_1 = new window.ROSLIB.Topic({
      ros: this.state.ros,
      name: '/tb3_1/move_base/NavfnROS/plan',
      messageType: 'nav_msgs/Path',
    });
  var pathTopic_2 = new window.ROSLIB.Topic({
    ros: this.state.ros,
    name: '/tb3_2/move_base/NavfnROS/plan',
    messageType: 'nav_msgs/Path',
    });
  
    pathTopic_0.subscribe(function (message) {
      pathView_0.setPath(message);
    });
    pathTopic_1.subscribe(function (message) {
      pathView_1.setPath(message);
    });    
    pathTopic_2.subscribe(function (message) {
     pathView_2.setPath(message);
    });
  } else {
    console.error("navClient.rootObject is undefined. Check your initialization.");
  }




  // Scale the canvas to fit the map
  
  gridClient.on('change', function () {
    viewer.scaleToDimensions(gridClient.currentGrid.width, gridClient.currentGrid.height);
    viewer.shift(gridClient.currentGrid.pose.position.x, gridClient.currentGrid.pose.position.y);
  
  });
   
  var robotNames = ['tb3_0', 'tb3_1', 'tb3_2'];
  var robotMarkers = [];
  var topics = [];
   
  var createFunc = function (handlerToCall, discriminator, robotMarker) {
  
    return discriminator.subscribe(function (pose) {
      robotMarker.x = pose.pose.pose.position.x;
      robotMarker.y = -pose.pose.pose.position.y;
   
      // Fixing the rotation
  
      var quaternion = new window.THREE.Quaternion(
  
        pose.pose.pose.orientation.x,
  
        pose.pose.pose.orientation.y,
  
        pose.pose.pose.orientation.z,
  
        pose.pose.pose.orientation.w
  
      );
   
      robotMarker.rotation = new window.THREE.Euler().setFromQuaternion(quaternion).z * -180 / Math.PI;
  
    });
  
  };
   
  for (let i = 0; i < robotNames.length; i++) {
  
    // Setup the map client.
  
    var robotMarker = new window.ROS2D.NavigationArrow({
  
      size: 0.25,
  
      strokeSize: 0.05,
  
      pulse: true,
  
      //fillColor: createjs.Graphics.getRGB(randomr(), randomg(), randomb(), 0.65)
  
    });
  
    robotMarkers.push(robotMarker);
   
    var poseTopic = new window.ROSLIB.Topic({
  
      ros: this.state.ros,
  
      name: '/' + robotNames[i] + '/amcl_pose',
  
      messageType: 'geometry_msgs/PoseWithCovarianceStamped'
  
    });
  
    topics.push(poseTopic);
  
    createFunc('subscribe', poseTopic, robotMarker);
  
  }
   
  for (let i = 0; i < robotMarkers.length; i++) {
  
    gridClient.rootObject.addChild(robotMarkers[i]);
  
  }
  




}



 
  render() {
    const buttonStyle = {
      margin: '5px',
      padding: '10px',
      fontSize: '16px',
      backgroundColor: '#4CAF50', /* Green background */
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    };
   
 
    return (
     

      <div>

        <div id="map" >Viewer</div>
        <button
        type="button"
        style={buttonStyle}
        onClick={() =>
          this.handleRobotButtonClick('tb3_0', {
            header: { frame_id: 'map' },
            pose: { position: {    x: -2.969065, y: 4.050793, z: 0.000000}, orientation: {     x: 0.0, y: 0.0, z: -0.000000, w: 1.000000} },
          })
        }
      >
        tb3_0
      </button>
      <button
        type="button"
        style={buttonStyle}
        onClick={() =>
          this.handleRobotButtonClick('tb3_1', {
            header: { frame_id: 'map' },
            pose: { position: {x: 2.856473, y: 1.744179, z: 0.000000 }, orientation: {     x: 0.000000, y: 0.000000, z: -0.014999, w: 0.999888 } },
          })
        }
      >
        tb3_1
      </button>
        <button
        type="button"
        style={buttonStyle}
        onClick={() =>
          this.handleRobotButtonClick('tb3_2', {
            header: { frame_id: 'map' },
            pose: { position: {     x: -0.904558, y: 0.993230, z: 0.000000 }, orientation: { x: 0.000000, y: 0.000000, z: 0.999764, w: 0.021724 } },
            
          })
        }
      >
        tb3_2
      </button>
      </div>
    );
  }
}

export default Map;
