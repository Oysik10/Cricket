# Project 6: Creative Scene

Build an interesting scene or figure using polyhedra, spheres,
cylinders, disks, and so forth. Even better, use curves and surfaces,
or lathe/tube geometries. Place several objects or parts in your
scene, using the object transformations that we learned in
class. Also, use lighting and a variety of materials. Use texture
mapping. In short, show your command of the things we have learned so
far in the course.

Define an appropriate bounding box for your scene or figure.

I'm not specifying any minimum number of objects or complexity, but I
encourage you to have fun with it and make something you are proud of.

It can be

- indoor or outdoor
- large or small
- a single, complicated object or a multi-part scene
- it can be something you want to develop into your final project, or
  it can be a throw-away item.

## Getting Started

I have provided some working code as a starting point in the folder `creative`.  This demo from earlier in the course loads the GUI and also a module of code that defines a "figure."  

Of course, you can substitute any other demo to use as a starting point or just scrap it and start from scratch. 

## Library Contribution

As part of your scene, build a module that other people can use. That is, the
code is in a separate file, which the user can `import`. The module should, as
much as is reasonably possible, be flexible and usable in different kinds of
programs. For example, it creates a teddy bear, but doesn't do lighting,
camera, etc.

Your module's functions can have several arguments, one or none, as you
think best. For example:

```js
export function teddyBear(bodyMaterial, eyeMaterial, noseMaterial) {
        ...
}
```

Or maybe

```js
export function teddyBear(params) {
    const bodyMaterial = params.bodyMaterial;
    const eyeMaterial = params.eyeMaterial;
    const noseMaterial = params.noseMaterial;

    ...
}
```

Your module can define several objects, of course. The more the
merrier. Try to keep the `main.js` primarily as a demo of these
objects you've created.

Your module should be documented so that others can use it. See below.

Note that your library may have "helper" functions (a good idea, when
warranted). You can export these or not, as you choose.

The goal with your library contribution is to make something that is
*usable by someone else*. That's a pretty high standard. Think about
the stuff that was easiest to use in Three.js:

- There was a working demo, so you could see how to use it and what it looked like.
- Either the demo or the documentation or both should describe
  - the size or dimensions
  - the arrangement of the axes (for example,
    [PlaneGeometry](https://threejs.org/docs/index.html#api/geometries/PlaneGeometry)
    is in the z=0 plane)
  - the origin (for example, the origin is in the center of the plane)
- If it uses texture mapping, you will need to supply a texture in
  your demo. If possible, make the texture URL an argument, so that
  the user can substitute their own texture.

## Documentation

Your JavaScript file should document each of your functions, along
with giving the declaration. You should precede the function with a
block comment giving all the pertinent information about it.

Some things you should be sure to document are:

- The *frame* for the figure or object. That is, it should be clear
  where the origin is and where the axes are when I want to use a
  function.
- The natural *size* of the figure or object. If I don't scale the
  coordinate system, how big is it in each of the major dimensions? If
  the origin is not at one corner of the figure, you may need to
  document both its negative and positive extent. For example, the
  origin is at the center of `THREE.BoxGeometry()`, so we have to not
  only say that its size is determined by its `size` argument, but
  that the cube goes from *-size/2* to *+size/2*.
- The *color(s)* of the figure or object. If it has none, like the
  Three.js geometry objects, that maximizes the flexibility for the
  user, because they can easily define that before calling your
  function. If you can, specify the material indexes that various
  faces have, etc. If it has one or more colors, say what they are or
  allow the caller to specify them via arguments.

## How You Will Be Graded

I will look for the skills that we have learned, including modeling,
material and lighting, texture mapping and curves and surfaces. Your
main demo file might have special keyboard callbacks with camera
setups.

This will probably be a major component of your project, so think
ahead to that.
