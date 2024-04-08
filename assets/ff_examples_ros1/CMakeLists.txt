cmake_minimum_required(VERSION 3.5.0)

project(ff_examples_ros1)

#===============================================================================

find_package(catkin QUIET)

find_package(catkin REQUIRED COMPONENTS
  tf
  urdf
)

if (catkin_FOUND)

  catkin_package()

  install(
    DIRECTORY rviz
    DESTINATION share/${PROJECT_NAME}
  )

  install(
    DIRECTORY launch
    DESTINATION share/${PROJECT_NAME}
  )

  install(
    DIRECTORY maps
    DESTINATION share/${PROJECT_NAME}
  )

  install(
    DIRECTORY param
    DESTINATION share/${PROJECT_NAME}
  )

  install(
    DIRECTORY map
    DESTINATION share/${PROJECT_NAME}
  )


  install(
    DIRECTORY urdf
    DESTINATION share/${PROJECT_NAME}
  )

  install(
    DIRECTORY lua
    DESTINATION share/${PROJECT_NAME}
  )

  install(
    DIRECTORY scripts
    DESTINATION share/${PROJECT_NAME}
  )

  install(
    PROGRAMS 
      scripts/get_global_path.py
      scripts/get_global_position.py
    DESTINATION lib/${PROJECT_NAME}
  )

  include_directories(
    ${catkin_INCLUDE_DIRS}
  )


else()
  message("catkin not found so skipping this ROS1 package")
endif()
