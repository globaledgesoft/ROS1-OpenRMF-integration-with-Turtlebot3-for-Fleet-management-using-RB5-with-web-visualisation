import React, { Component } from "react";
import { Row, Col} from "react-bootstrap";
import { Joystick } from "react-joystick-component";
import Config from "../scripts/config";

class Teleoperation extends Component {
  state = { ros: null };

  constructor() {
    super();
    this.init_connection();

    this.handleMove_tb3_0 = this.handleMove_tb3_0.bind(this);
    this.handleStop_tb3_0 = this.handleStop_tb3_0.bind(this);


    this.handleMove_tb3_1 = this.handleMove_tb3_1.bind(this);
    this.handleStop_tb3_1 = this.handleStop_tb3_1.bind(this);
    

    this.handleMove_tb3_2 = this.handleMove_tb3_2.bind(this);
    this.handleStop_tb3_2 = this.handleStop_tb3_2.bind(this);


  }
  init_connection() {
    this.state.ros = new window.ROSLIB.Ros();
    console.log(this.state.ros);

    this.state.ros.on("connection", () => {
      console.log("connection established in Teleoperation Component!");
      console.log(this.state.ros);
      this.setState({ connected: true });
    });

    this.state.ros.on("close", () => {
      console.log("connection is closed!");
      this.setState({ connected: false });
      //try to reconnect every 3 seconds
      setTimeout(() => {
        try {
          this.state.ros.connect(
            "ws://" +
              Config.ROSBRIDGE_SERVER_IP +
              ":" +
              Config.ROSBRIDGE_SERVER_PORT +
              ""
          );
        } catch (error) {
          console.log("connection problem ");
        }
      }, Config.RECONNECTION_TIMER);
    });

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
      console.log("connection problem ");
    }
  }

  handleMove_tb3_0(event) {
    console.log("handle move");
    //we need to create a ROS publisher on the topic cmd_vel
    var cmd_vel = new window.ROSLIB.Topic({
      ros: this.state.ros,
      name: Config.CMD_VEL_TOPIC,
      messageType: "geometry_msgs/Twist",
    });
    //we need to create a twist message to be to published to rosbridge
    var twist = new window.ROSLIB.Message({
      linear: {
        x: event.y / 50,
        y: 0,
        z: 0,
      },
      angular: {
        x: 0,
        y: 0,
        z: -event.x / 50,
      },
    });
    //we need to publish the message on the cmd_vel topic
    cmd_vel.publish(twist);
  }
  handleStop_tb3_0(event) {
    console.log("handle stop");
    //we need to create a ROS publisher on the topic cmd_vel
    var cmd_vel = new window.ROSLIB.Topic({
      ros: this.state.ros,
      name: Config.CMD_VEL_TOPIC,
      messageType: "geometry_msgs/Twist",
    });
    //we need to create a twist message to be to published to rosbridge
    var twist = new window.ROSLIB.Message({
      linear: {
        x: 0,
        y: 0,
        z: 0,
      },
      angular: {
        x: 0,
        y: 0,
        z: 0,
      },
    });
    //we need to publish the message on the cmd_vel topic
    cmd_vel.publish(twist);
  }


  handleMove_tb3_1(event) {
    console.log("handle move");
    //we need to create a ROS publisher on the topic cmd_vel
    var cmd_vel = new window.ROSLIB.Topic({
      ros: this.state.ros,
      name: "tb3_1/cmd_vel",
      messageType: "geometry_msgs/Twist",
    });
    //we need to create a twist message to be to published to rosbridge
    var twist = new window.ROSLIB.Message({
      linear: {
        x: event.y / 50,
        y: 0,
        z: 0,
      },
      angular: {
        x: 0,
        y: 0,
        z: -event.x / 50,
      },
    });
    //we need to publish the message on the cmd_vel topic
    cmd_vel.publish(twist);
  }
  handleStop_tb3_1(event) {
    console.log("handle stop");
    //we need to create a ROS publisher on the topic cmd_vel
    var cmd_vel = new window.ROSLIB.Topic({
      ros: this.state.ros,
      name: "tb3_1/cmd_vel",
      messageType: "geometry_msgs/Twist",
    });
    //we need to create a twist message to be to published to rosbridge
    var twist = new window.ROSLIB.Message({
      linear: {
        x: 0,
        y: 0,
        z: 0,
      },
      angular: {
        x: 0,
        y: 0,
        z: 0,
      },
    });
    //we need to publish the message on the cmd_vel topic
    cmd_vel.publish(twist);
  }

  handleMove_tb3_2(event) {
    console.log("handle move");
    //we need to create a ROS publisher on the topic cmd_vel
    var cmd_vel = new window.ROSLIB.Topic({
      ros: this.state.ros,
      name: "tb3_2/cmd_vel",
      messageType: "geometry_msgs/Twist",
    });
    //we need to create a twist message to be to published to rosbridge
    var twist = new window.ROSLIB.Message({
      linear: {
        x: event.y / 50,
        y: 0,
        z: 0,
      },
      angular: {
        x: 0,
        y: 0,
        z: -event.x / 50,
      },
    });
    //we need to publish the message on the cmd_vel topic
    cmd_vel.publish(twist);
  }
  handleStop_tb3_2(event) {
    console.log("handle stop");
    //we need to create a ROS publisher on the topic cmd_vel
    var cmd_vel = new window.ROSLIB.Topic({
      ros: this.state.ros,
      name: "tb3_2/cmd_vel",
      messageType: "geometry_msgs/Twist",
    });
    //we need to create a twist message to be to published to rosbridge
    var twist = new window.ROSLIB.Message({
      linear: {
        x: 0,
        y: 0,
        z: 0,
      },
      angular: {
        x: 0,
        y: 0,
        z: 0,
      },
    });
    //we need to publish the message on the cmd_vel topic
    cmd_vel.publish(twist);
  }



  render() {
    return (
      <div>
      <Row>
        <Col>
        <h4>Teleop for tb3_0</h4>
        <Joystick
          size={100}
          baseColor="#EEEEEE"
          stickColor="#BBBBBB"
          move={this.handleMove_tb3_0}
          stop={this.handleStop_tb3_0}
        ></Joystick>
        </Col>
        <Col>
      <h4>Teleop for tb3_1</h4>
      <Joystick
        size={100}
        baseColor="#EEEEEE"
        stickColor="#BBBBBB"
        move={this.handleMove_tb3_1}
        stop={this.handleStop_tb3_1}
      ></Joystick>
      </Col>
        <Col>
      <h4>Teleop for tb3_2</h4>
      <Joystick
        size={100}
        baseColor="#EEEEEE"
        stickColor="#BBBBBB"
        move={this.handleMove_tb3_2}
        stop={this.handleStop_tb3_2}
      ></Joystick>
       </Col>
      </Row>
    </div>


    );
  }
}

export default Teleoperation;
