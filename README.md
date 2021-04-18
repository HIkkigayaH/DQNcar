# DQNcar
Obstacle avoiding car using a Reinforcement learning agent. The algorithm used is Q-learning.

![demo](https://user-images.githubusercontent.com/46436051/115146193-18a3c000-a073-11eb-8842-5af7f547463e.gif)

The one above is gif so the frame rate is much lower, the actual video is available in the files(demo.mp4)...you may download it from there.

The above clip shows the environment the agent was trained in. The green blob is the car and the lines infront of it represents the distance sensors. The environment was built using p5.js and actuall the whole thing runs in p5.js except communicating with the arduino sittting in the actual robot. For the communication I have built a simple node server that just acts like an bridge between the brain off the robot that resides in the web page and the body of the robot which is the robot itself. I will upload another clip of the robot running around in my room.
