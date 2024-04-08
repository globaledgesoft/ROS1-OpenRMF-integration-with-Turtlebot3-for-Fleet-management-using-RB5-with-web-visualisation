##############################################
# Created from template ros1.dockerfile.jinja
##############################################

###########################################
# Base image 
###########################################
FROM ubuntu:20.04 AS base

ENV DEBIAN_FRONTEND=noninteractive

# Install language
RUN apt-get update && apt-get install -y \
  locales \
  && locale-gen en_US.UTF-8 \
  && update-locale LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8 \
  && rm -rf /var/lib/apt/lists/*
ENV LANG en_US.UTF-8

# Install timezone
RUN ln -fs /usr/share/zoneinfo/UTC /etc/localtime \
  && export DEBIAN_FRONTEND=noninteractive \
  && apt-get update \
  && apt-get install -y tzdata \
  && dpkg-reconfigure --frontend noninteractive tzdata \
  && rm -rf /var/lib/apt/lists/*

# Install ROS1
RUN apt-get update && apt-get install -y \
    curl \
    gnupg2 \
    lsb-release \
    sudo \
  && sudo sh -c 'echo "deb http://packages.ros.org/ros/ubuntu $(lsb_release -sc) main" > /etc/apt/sources.list.d/ros-latest.list' \
  && curl -s https://raw.githubusercontent.com/ros/rosdistro/master/ros.asc | sudo apt-key add - \
  && apt-get update && apt-get install -y \
    ros-noetic-desktop \
    python3-argcomplete \
  && rm -rf /var/lib/apt/lists/*

ENV ROS_DISTRO=noetic
ENV AMENT_PREFIX_PATH=/opt/ros/noetic
ENV COLCON_PREFIX_PATH=/opt/ros/noetic
ENV LD_LIBRARY_PATH=/opt/ros/noetic/lib
ENV PATH=/opt/ros/noetic/bin:$PATH
ENV PYTHONPATH=/opt/ros/noetic/lib/python3/dist-packages
ENV ROS_PYTHON_VERSION=3
ENV ROS_VERSION=2
ENV DEBIAN_FRONTEND=

###########################################
#  Develop image 
###########################################
FROM base AS dev

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y \
  bash-completion \
  build-essential \
  cmake \
  gdb \
  git \
  pylint3 \
  python3-argcomplete \
  python3-colcon-common-extensions \
  python3-pip \
  python3-rosdep \
  python3-vcstool \
  vim \
  wget \
  # Install ros distro testing packages
  python3-autopep8 \
  && rm -rf /var/lib/apt/lists/* \
  && rosdep init || echo "rosdep already initialized" \
  # Update pydocstyle
  && pip install --upgrade pydocstyle

ARG USERNAME=ros
ARG USER_UID=1000
ARG USER_GID=$USER_UID


# Create a non-root user
RUN groupadd --gid $USER_GID $USERNAME \
  && useradd -s /bin/bash --uid $USER_UID --gid $USER_GID -m $USERNAME \
  # [Optional] Add sudo support for the non-root user
  && apt-get update \
  && apt-get install -y sudo \
  && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME\
  && chmod 0440 /etc/sudoers.d/$USERNAME \
  # Cleanup
  && rm -rf /var/lib/apt/lists/* \
  && echo "source /usr/share/bash-completion/completions/git" >> /home/$USERNAME/.bashrc \
  && echo "if [ -f /opt/ros/${ROS_DISTRO}/setup.bash ]; then source /opt/ros/${ROS_DISTRO}/setup.bash; fi" >> /home/$USERNAME/.bashrc

ENV DEBIAN_FRONTEND=
ENV AMENT_CPPCHECK_ALLOW_SLOW_VERSIONS=1

###########################################
#  Full image 
###########################################
FROM dev AS full

ENV DEBIAN_FRONTEND=noninteractive
# Install the full release
RUN apt-get update && apt-get install -y \
  ros-noetic-desktop \
  && rm -rf /var/lib/apt/lists/*
ENV DEBIAN_FRONTEND=

###########################################
#  Full+Gazebo image 
###########################################
FROM full AS gazebo

ENV DEBIAN_FRONTEND=noninteractive
# Install gazebo
RUN apt-get update && apt-get install -q -y \
  lsb-release \
  wget \
  gnupg \
  sudo \
  && wget https://packages.osrfoundation.org/gazebo.gpg -O /usr/share/keyrings/pkgs-osrf-archive-keyring.gpg \
  && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/pkgs-osrf-archive-keyring.gpg] http://packages.osrfoundation.org/gazebo/ubuntu-stable $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/gazebo-stable.list > /dev/null \
  && apt-get update && apt-get install -q -y \
    ros-noetic-gazebo* \
  && rm -rf /var/lib/apt/lists/*
ENV DEBIAN_FRONTEND=

###########################################
#  Full+Gazebo+Nvidia image 
###########################################

FROM gazebo AS gazebo-nvidia

################
# Expose the nvidia driver to allow opengl 
# Dependencies for glvnd and X11.
################
RUN apt-get update \
 && apt-get install -y -qq --no-install-recommends \
  libglvnd0 \
  libgl1 \
  libglx0 \
  libegl1 \
  libxext6 \
  libx11-6

# Env vars for the nvidia-container-runtime.
ENV NVIDIA_VISIBLE_DEVICES all
ENV NVIDIA_DRIVER_CAPABILITIES graphics,utility,compute
ENV QT_X11_NO_MITSHM 1

#Turtlebot3 packages installation
RUN apt-get -y  install ros-noetic-gazebo-* 
 
RUN apt install -y ros-noetic-dynamixel-sdk 
RUN apt install -y ros-noetic-turtlebot3-msgs 
RUN apt install -y ros-noetic-turtlebot3

RUN apt install -y ros-noetic-joy ros-noetic-teleop-twist-joy \
  ros-noetic-teleop-twist-keyboard ros-noetic-laser-proc \
  ros-noetic-rgbd-launch ros-noetic-rosserial-arduino \
  ros-noetic-rosserial-python ros-noetic-rosserial-client \
  ros-noetic-rosserial-msgs ros-noetic-amcl ros-noetic-map-server \
  ros-noetic-move-base ros-noetic-urdf ros-noetic-xacro \
  ros-noetic-compressed-image-transport ros-noetic-catkin \
  ros-noetic-gmapping ros-noetic-navigation ros-noetic-interactive-markers

RUN sudo apt-get update && apt-get install -y  python3-rosdep \
         python3-rosinstall \
         python3-rosinstall-generator \
         python3-wstool build-essential
	
RUN sudo apt-get install -y python3-catkin-pkg

RUN sudo apt-get install -y ros-noetic-catkin

RUN bash -c "source /opt/ros/noetic/setup.bash"

RUN apt update && sudo apt install \
  git wget qtbase5-dev qtchooser qt5-qmake qtbase5-dev-tools 
  # maven default-jdk   # Uncomment to install dependencies for message generation

RUN echo export ROS_MASTER_URI=http://<IP_OF_REMOTE_HOST_PC>:11311
RUN echo export ROS_HOSTNAME=<IP_ADDRESS_RB5>
RUN echo export ROS_DOMAIN_ID=42 >> ~/.bashrc
RUN echo export TURTLEBOT3_MODEL=burger >> ~/.bashrc
RUN echo source /opt/ros/noetic/setup.bash >> ~/.bashrc


