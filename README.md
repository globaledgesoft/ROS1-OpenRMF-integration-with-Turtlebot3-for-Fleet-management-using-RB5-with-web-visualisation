## Introduction

This project seamlessly integrates a robot fleet management system using the openRMF middleware framework with the TurtleBot3, presented via a web interface through the ROS bridge server. Highlighting openRMF's capabilities in robotics platforms, especially with the navigation stack, the project emphasizes practical implementation in a TurtleBot3. Notably, users can teleoperate the robots from the web interface, effortlessly directing them to predefined target positions. This showcases the synergy between openRMF, TurtleBot3, and web-based robotics control in a compact and user-friendly manner. 

 

## Prerequisites 

- A Linux host system with Ubuntu 20.04. 
- Install Android Platform tools (ADB, Fastboot)  
- Download and install the SDK Manager for RB5 
- Flash the RB5 firmware image on to the RB5
- Download the latest ROS1 firmware with burger_noetic model and flash it to OpenCR  
  - Refer : https://emanual.robotis.com/docs/en/platform/turtlebot3/opencr_setup/#opencr-setup
- Setup the Network on RB5. 
- Install python3.6 on RB5 
- Install python3.8 on host system 
- Install ros-galectic-desktop-full on host system
  - Refer : https://docs.ros.org/en/galactic/Installation.html 
- Install ros-noetic-desktop-full on host system
  - Refer : https://wiki.ros.org/noetic/Installation
- Install docker on RB5 
- Node.js (v14.x or later)
  - Refer : https://www.rosehosting.com/blog/how-to-install-node-js-and-npm-on-ubuntu-20-04/
- npm (v7.X or later)
  - Refer : https://www.freecodecamp.org/news/how-to-install-node-js-on-ubuntu-and-update-npm-to-the-latest-version/
 

## Installing Dependencies 

### Install non-ROS prerequisite packages on host system 

```sh 
sudo apt update && sudo apt install \ 
  git wget qtbase5-dev qtchooser qt5-qmake qtbase5-dev-tools \ 
  python3-rosdep \ 
  python3-vcstool \ 
  python3-colcon-common-extensions \ 
  # maven default-jdk   # Uncomment to install dependencies for message generation 
```
```
sudo apt install npm
nvm install v14
npm install nvm==v14
```

### Install dependent ROS2-galactic packages on host system 

- Install vcstool 
```sh
$ sudo apt install python3-vcstool 
```
- Install colcon 
```sh
$ sudo apt install python3-colcon-common-extensions 
``` 

### Install dependent ROS2-noetic packages on host system

- Install required packages 
```sh
$ sudo apt install -y ros-noetic-joy ros-noetic-teleop-twist-joy \
  ros-noetic-teleop-twist-keyboard ros-noetic-laser-proc \
  ros-noetic-rgbd-launch ros-noetic-rosserial-arduino \
  ros-noetic-rosserial-python ros-noetic-rosserial-client \
  ros-noetic-rosserial-msgs ros-noetic-amcl ros-noetic-map-server \
  ros-noetic-move-base ros-noetic-urdf ros-noetic-xacro \
  ros-noetic-compressed-image-transport ros-noetic-catkin \
  ros-noetic-gmapping ros-noetic-navigation ros-noetic-interactive-markers
```

- Install TurtleBot3 packages. 
```sh 
$ sudo apt install ros-noetic-dynamixel-sdk 
$ sudo apt install ros-noetic-turtlebot3-msgs 
$ sudo apt install ros-noetic-turtlebot3 
```
- Install ROS Bridge Server 
```sh
$ sudo apt install ros-noetic-rosbridge-server
```


`NOTE: Add below line in the end of ~/.bashrc file, to avoid the environment variables exports for all the time while opening terminal. Make sure that you reopen the shell once the file is edited.` 
 
Add below lines in ~/.bashrc 
```sh
# APPEND AT THE END OF ~/.bashrc
export ROS_MASTER_URI=http://<IP_OF_REMOTE_HOST_PC>:11311
export ROS_HOSTNAME=<IP_OF_REMOTE_HOST_PC> 
export TURTLEBOT3_MODEL=burger
export ROS_DOMAIN_ID=30 
``` 
Or run commands given below to update the ~/.bashrc 
```sh
$ echo export ROS_MASTER_URI=http://<IP_OF_REMOTE_HOST_PC>:11311
$ echo export ROS_HOSTNAME=<IP_OF_REMOTE_HOST_PC> 
$ echo export TURTLEBOT3_MODEL=burger >> ~/.bashrc 
$ echo export ROS_DOMAIN_ID=30 >> ~/.bashrc 
```

## Setup Workspace 

### Setup Server (Host System) 

Start a new ROS 2 workspace, and pull in the necessary repositories, 
```sh
$ mkdir -p ~/ff_ros2_ws/src 
$ cd ~/ff_ros2_ws/src 
$ git clone https://github.com/open-rmf/free_fleet -b main 
$ git clone https://github.com/open-rmf/rmf_internal_msgs -b main 
```
 
Install all the dependencies through rosdep, 
```sh
$ cd ~/ff_ros2_ws 
$ rosdep install --from-paths src --ignore-src --rosdistro galactic -yr 
```
Source ROS 2 and build, 
```sh
$ cd ~/ff_ros2_ws 
# Run below command, if sourcing of galactic has not taken care in ~/.bashrc 
$ source /opt/ros/galactic/setup.bash 
$ colcon build 
$ source ~/ff_ros2_ws/install/setup.bash 
```

### Setting Up Noetic & Free Fleet Client on RB5 (Qualcomm RB5) 

To enter RB5 shell open new terminal on host system and run below command, 

Access the RB5 Using SSH 
```sh
$ ssh root@<IP_ADDRESS_RB5> 
```
or Using ADB through host 

```sh
$ adb shell 
```

Clone the project by using below command  
```sh
$ git clone https://github.com/globaledgesoft/ROS1-OpenRMF-integration-with-Turtlebot3-for-Fleet-management-using-RB5-with-web-visualisation.git 
```
Change directory where project is cloned and and make sure the Dockerfile is available in the root of the project: 
```sh
$ cd <PROJECT_ROOT_DIR> 

Please update the Dockerfile as follows:

On line 185, replace <IP_OF_REMOTE_HOST_PC> with the actual IP address of the host machine. 

  export ROS_MASTER_URI=http://<ip4-addr>:11311

This change ensures that the ROS_MASTER_URI points to the correct IP address of the remote host PC.

On line 186, replace <IP_ADDRESS_RB5> with the actual IP address of the RB5

  export ROS_HOSTNAME=<ip4-addr>

The ROS_HOSTNAME is used to specify the IP address or hostname of the machine where ROS nodes will run. By setting it to the correct IP address of the rb5 Robot, ROS nodes running within the Docker container will be able to communicate with the rb5 properly.  
```
Assuming the docker installation has been already fulfilled as its mentioned in the prerequisites, Build the docker file by using the command below, 
```sh
$ docker build –t <DOCKER_IMAGE_NAME>:<VERSION_NO> .   
```

Please verify that the devices /dev/ttyACM0 and /dev/ttyUSB0 are connected to the RB5. You can confirm this by using the command ls /dev/tty and ensuring that both /dev/ttyACM0 and /dev/ttyUSB0 are listed among the connected devices. This step ensures that the RB5 is properly connected and recognized by the system.

Run docker image 
```sh
$ docker run –it --network=host --device=/dev/ttyACM0 --device=/dev/ttyUSB0 <DOCKER_IMAGE_NAME/DOCKER_IMAGE_ID> bash 
```
 
```
--device=/dev/ttyACM0 : Sharing the OpenCR controller device to the container. 

--device=/dev/ttyUSB0 : Sharing the 2D lidar sensor with the container. 
```
 

`NOTE: Assuming the ROS1  environment has been initialized at both end using ~/.bashrc, as instructed to add the initialization commands in ~/.bashrc of both Host & RB5 device.` 

### Visualize the client bot on real environment (Host System)

Start a new ROS 1 workspace, and pull in the necessary repositories, 
```sh
$ mkdir -p ~/ff_ros1_ws/src 
$ cd ~/ff_ros1_ws/src 
$ git clone https://github.com/open-rmf/free_fleet -b main 
$ git clone https://github.com/eclipse-cyclonedds/cyclonedds -b releases/0.7.x
```

Modify the ff_examples_ros1 package located in the ff_ros1_ws/src/free_fleet/
with package provided in the assets folder

```sh
$ cd ~/ff_ros1_ws/src/free_fleet/
$ sudo rm -r ff_examples_ros1
$ cp -r ROS1-OpenRMF-integration-with-Turtlebot3-for-Fleet-management-using-RB5-with-web-visualisation/assets/ff_examples_ros1 .
```

Install all the dependencies through rosdep, 
```sh
$ cd ~/ff_ros1_ws 
$ rosdep install --from-paths src --ignore-src --rosdistro noetic -yr 
```
Source ROS 1 and build, 
```sh
$ cd ~/ff_ros1_ws 
# Run below command, if sourcing of galactic has not taken care in ~/.bashrc 
$ source /opt/ros/noetic/setup.bash 
$ colcon build 
$ source ~/ff_ros1_ws/install/setup.bash 
```


## Map Generation  
`(Optional if you do not have generated map (.pgm & .yaml))` 

Follow below steps, if you want to generate your own map 

Run roscore from Remote PC.
```sh
roscore
```

To enter RB5 shell open new terminal on host system and run below command or access using ‘adb shell’ if device is connected with USB. 
```sh
$ ssh root@<IP_ADDRESS_RB5> 
```
Make sure the device & host system is in the same network. 
 
After entering in RB5 shell run bring up command, Source the workspace and launch bring up command 
```sh
sh4.4$ roslaunch turtlebot3_bringup turtlebot3_robot.launch  
```

Open a new terminal from host system source environment and launch the SLAM node. The gmapping is used as a default SLAM method.  
```sh
$ roslaunch turtlebot3_slam turtlebot3_slam.launch
```
 

Once the SLAM node is successfully up and running, TurtleBot3 will be exploring an unknown area and gives the visualization of the same on the RViz window.  

 

To explore your area completely open RB5 shell and source workspace and launch teleop node. 
```sh
sh4.4 roslaunch turtlebot3_teleop turtlebot3_teleop_key.launch
```

- Keyboard shortcuts w, a, x, s, d is used to move the bot and to every corner of the map.
  - w and x: for linear velocity 

  - a and d: Angular velocity 

  - s: stop  


After analyzing complete map on host system save the map using below command 
```sh
$ rosrun map_server map_saver -f ~/map  
```

Image stored in asset/maps/ is the sample map generated. Black portion is a walls or obstacles, white portion is free space. 

### Navigation (Optional) 

The below steps are just to validate & verify the navigation on map passed is working properly or not. 

On RB5 shell, Source the workspace and launch bring up command 
```sh
sh4.4 roslaunch turtlebot3_bringup turtlebot3_robot.launch  
```
On host system source the workspace and launch navigation command  
```sh
$ roslaunch turtlebot3_navigation turtlebot3_navigation.launch map_file:=$HOME/map.yaml 
```
Running this command will open visualization with map provided on the RViz. 

Prior to initiating navigation, it is essential to perform initial pose estimation, which initializes critical AMCL parameters required for navigation. This process involves accurately positioning the TurtleBot3 on the map, ensuring that the data from the LDS sensor aligns neatly with the displayed map.

To perform initial pose estimation:

In RViz, click on the "2D Pose Estimate" button in the menu.
Click on the map where the actual robot is located and drag the large green arrow in the direction the robot is facing.
Repeat steps 1 and 2 until the LDS sensor data overlays correctly on the saved map.
Launch the keyboard teleoperation node to precisely position the robot on the map using:

```sh
$ roslaunch turtlebot3_teleop turtlebot3_teleop_key.launch
```
To set the navigation goal:

Click on the "2D Nav Goal" button in the RViz menu.
Click on the map to set the destination of the robot and drag the green arrow to indicate the direction the robot will face.
The green arrow serves as a marker specifying the destination, with the root of the arrow representing the x, y coordinate of the destination, and the angle θ determined by the orientation of the arrow.
Once the destination coordinates and orientation are set, TurtleBot3 will begin moving towards the destination immediately.


## Execution instruction
- On PC shell (Host),Source the noetic and run roscore
```sh
$ roscore
```
- On RB5 shell, Source the workspace and launch bring up command 
```sh
sh4.4 ROS_NAMESPACE=tb3_0 roslaunch turtlebot3_bringup turtlebot3_robot.launch multi_robot_name:="tb3_0" set_lidar_frame_id:="tb3_0/base_scan"   
```
- On host system run the free fleet server  
```sh 
$ ros2 launch ff_examples_ros2 turtlebot3_world_ff_server.launch.xml 
```
- On PC shell (host), Source workspace and launch the localization for tb3_0 

```sh
$ roslaunch ff_examples_ros1 tb3_localization.launch
```

`Note : If you wish to test this in your own environment, please replace the map file specified in the tb3_localization.launch file with your own map file.`


- On host system run rosbridge for web visualization 
```sh
$  roslaunch rosbridge_server rosbridge_websocket.launch 
```
- On host system run React application we developed a web application using React for teleoperating and monitoring a robot through the Robot Operating System (ROS). Through the web interface, users can take control of the robot, observe the navigation map, and track its position, orientation, and velocity. Additionally, we've incorporated the capability to visualize and monitor a fleet of robots on the web using ros2djs. The application is built with ReactJS, a widely-used JavaScript framework for front-end development.
```sh
$   cd ROS1-OpenRMF-integration-with-Turtlebot3-for-Fleet-management-using-RB5-with-web-visualisation/assets/rosbridge_web_dashboard
$   npm install
$   npm start
```
- On host system send navigation goal to navigate bot 
```sh
$ ros2 run ff_examples_ros2 send_destination_request.py -f turtlebot3 -r tb3_0 -x 1.722 -y -0.39 --yaw 0.0 -i UNIQUE_TASK_ID 
```

`NOTE: The tb3_localization launch file is designed for Multi-bot Localization, supporting the localization of multiple robots (tb3_0, tb3_1, tb3_2).However, we have only tested this on one Turtlebot3 RB5.If you wish to test Free Fleet on multiple robots, you can bring up the robots using the following commands:`

Do this for all bots:
```sh
$ ssh root@<IP_ADDRESS_RB5> 

$ ROS_NAMESPACE=tb3_0 roslaunch turtlebot3_bringup turtlebot3_robot.launch multi_robot_name:="tb3_0" set_lidar_frame_id:="tb3_0/base_scan"

$ ROS_NAMESPACE=tb3_1 roslaunch turtlebot3_bringup turtlebot3_robot.launch multi_robot_name:="tb3_1" set_lidar_frame_id:="tb3_1/base_scan"

$ ROS_NAMESPACE=tb3_2 roslaunch turtlebot3_bringup turtlebot3_robot.launch multi_robot_name:="tb3_2" set_lidar_frame_id:="tb3_2/base_scan"
```

