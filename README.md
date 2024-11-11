# Correfoc
This is my first WebGL project using [Three.js](https://threejs.org/). I'm aiming to create a lively crowd of demons celebrating the Correfoc, a fiery Catalan and Valencian tradition where demons wield explosive pitchforks in a pyrotechnic parade. The plan is to animate a few mischievous demons leading the pack, pitchforks ablaze, and—just for fun—occasionally aiming them at people's feet.

The goal is to incorporate autonomous agents that can follow a path using [YUKA](https://mugen87.github.io/yuka/), a JavaScript library for developing Game AI. In addition, the agents have to wander around the entity that follows the path to make it look like a chaotic crowd is following a set path around the town. A navigation mesh is used to ensure the agents do not access restricted areas such as buildings, cars, etc.

# Acknowledgements
The 3D model of the city is based on "Low Poly City" (https://sketchfab.com/3d-models/low-poly-city-41697300a4c643d089784b8688b2ed2c) by Alessandro.Diamanti (https://sketchfab.com/diamanti.alessandro) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/).

A great resource to learn how to [make](https://www.youtube.com/watch?v=eBOcbYHexAM), [rig](https://www.youtube.com/watch?v=XkiWBSSuxLw) and [animate](https://www.youtube.com/watch?v=yjjLD3h3yRc) Blender characters is [Imphenzia](https://www.youtube.com/@Imphenzia). I have also used [mixamo](https://www.mixamo.com/) to give my character some life.

It would have been impossible to give the characters the ability to move and link the animations to the movement without the [Three.js Tutorials for Beginners](https://www.youtube.com/playlist?list=PLRL3Z3lpLmH0aqLDbfh0ZmnDkpXPDnTau) playlist by [simondevyoutube](https://github.com/simondevyoutube).