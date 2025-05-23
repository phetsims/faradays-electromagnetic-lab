# Faraday's Electromagnetic Lab - Implementation Notes

@author Chris Malley (PixelZoom, Inc.)

## Table of Contents

* [Introduction](https://github.com/phetsims/faradays-electromagnetic-lab/blob/main/doc/implementation-notes.md#introduction)
* [General Considerations](https://github.com/phetsims/faradays-electromagnetic-lab/blob/main/doc/implementation-notes.md#general-considerations)
    * [Coordinate Frames](https://github.com/phetsims/faradays-electromagnetic-lab/blob/main/doc/implementation-notes.md#coordinate-frames)
    * [Query Parameters](https://github.com/phetsims/faradays-electromagnetic-lab/blob/main/doc/implementation-notes.md#query-parameters)
    * [Memory Management](https://github.com/phetsims/faradays-electromagnetic-lab/blob/main/doc/implementation-notes.md#memory-management)
    * [Software Design Patterns](https://github.com/phetsims/faradays-electromagnetic-lab/blob/main/doc/implementation-notes.md#software-design-patterns)
* [Model](https://github.com/phetsims/faradays-electromagnetic-lab/blob/main/doc/implementation-notes.md#model)
* [View](https://github.com/phetsims/faradays-electromagnetic-lab/blob/main/doc/implementation-notes.md#view)
* [Sound](https://github.com/phetsims/faradays-electromagnetic-lab/blob/main/doc/implementation-notes.md#sound)
* [Alternative Input](https://github.com/phetsims/faradays-electromagnetic-lab/blob/main/doc/implementation-notes.md#alternative-input)
* [PhET-iO](https://github.com/phetsims/faradays-electromagnetic-lab/blob/main/doc/implementation-notes.md#phet-io)

## Introduction

This document contains notes related to the implementation of **Faraday's Electromagnetic Lab**. This is not an exhaustive description
of the implementation. The intention is to provide a concise high-level overview, and to supplement the internal
documentation (source code comments) and external documentation (design documents).

Before reading this document, please read:

* [model.md](https://github.com/phetsims/faradays-electromagnetic-lab/blob/main/doc/model.md), a high-level description of the
  simulation model

In addition to this document, you are encouraged to read:

* [PhET Development Overview](https://github.com/phetsims/phet-info/blob/main/doc/phet-development-overview.md)
* [PhET Software Design Patterns](https://github.com/phetsims/phet-info/blob/main/doc/phet-software-design-patterns.md)
* [Faraday's Electromagnetic Lab HTML5](https://docs.google.com/document/d/12bQuonZ1hva6zsBQhLQ3pEsiEJmg_rHLyGTY5Ae1J9w/edit?usp=sharing)
* [Faraday's Electromagnetic Lab PhET-iO Design](https://docs.google.com/document/d/1aDNiWlvI4y-TqvBI7zrV8LHQqNCgQL5XAHmQKorhbAQ/edit?usp=sharing)

This is a port from the 2005 Java version. You may find the legacy documents in [doc/java-version/](https://github.com/phetsims/faradays-electromagnetic-lab/tree/main/doc/java-version) to be helpful.

## General Considerations

### Coordinate Frames

This simulation does not use `ModelViewTransform2` for mapping between model and view coordinate frames. 
The model and view coordinate frames are identical; they both use the scenery coordinate frame. For the model, this is a non-standard
approach for modern PhET sims, but was the approach used in the Java version. Since so much code was directly reusable
from the Java version, and since changing the model coordinate frame proved to be difficult, we decided to make this 
compromise. For history, see [faradays-electromagnetic-lab#19](https://github.com/phetsims/faradays-electromagnetic-lab/issues/19).

This has the following implications for the model, and the presentation of model values in PhET-iO 
(noted in [examples.md](https://github.com/phetsims/phet-io-sim-specific/blob/main/repos/faradays-electromagnetic-lab/examples.md)):

* Position and distance values are unitless.
* +x is to the right.
* +y is _down_.
* +angle is _clockwise_. A vector with 0 angle points to the right.

While `ModelViewTransform2` is not used, a manual transform is applied for y and angle values. Where there values are 
visible in the UI, the sign of y and angle values are changes to correspond to the more standard "+y up" and 
"+angle counterclockwise".  For performance reasons, we change the sign by multiplying by -1, rather than using a
`ModelViewTransform2`.  

### Query Parameters

Query parameters are used to enable sim-specific features, and to initialize preferences. Sim-specific query parameters are documented
in `FELQueryParameters.ts`. Running with `?log` will print the complete set of query parameters (common-code, PhET-iO,
and sim-specific) to the browser console.

### Memory Management

**Instantiation:** Most objects in this sim are instantiated at startup, and exist for the lifetime of the simulation. 
The exceptions to this are as follows:

Changing a `Coil` (`numberOfLoopsProperty` or `loopAreaProperty`) results in disposal and creation of the model 
and view elements that make up the coil: `CoilSegment`, `CoilSegmentNode`, `QuadraticBezierSpline`, `ChargedParticle`,
and `ChargedParticleSpriteInstance`. None of these objects need to be stateful for PhET-iO.

Resizing the browser window (changing ScreenView `visibleBoundsProperty`) results in disposal and creation of
`CompassNeedleSpriteInstance`, to make the magnetic field visualization fill the browser 
window. `CompassNeedleSpriteInstance` does not need to be stateful for PhET-iO.

**Listeners**: Unless otherwise noted in the code, uses of `link`, `addListener`, etc. do not require a corresponding
`unlink`, `removeListener`, etc.

**dispose**: All classes have a `dispose` method, possibly inherited from a super class. Sim-specific classes whose 
instances exist for the lifetime of the sim are not intended to be disposed. They are created with `isDisposable: false`,
or have a `dispose` method that looks like this:

```ts
public dispose(): void {
  Disposable.assertNotDisposable();
}
```

### Software Design Patterns

**Class member of type Property**: This pattern is used frequently when we have a class member of type 
Property, whose value is publicly readonly, but privately settable. This is accomplished using
two instance fields, one `public` and one `private`, both of which refer to the same Property instance.
The names are similar, with the private member having an underscore prefix. For example:

```ts
class SomeClass {
  
  // Position, whose value is publicly readonly, privately settable.
  public readonly positionProperty: TReadOnlyProperty<Vector2>;
  private readonly _positionProperty: Property<Vector2>;
  
  public constructor() {
    this._positionProperty = new Vector2Property( Vector2.ZERO );
    this.positionProperty = this._positionProperty;
  }
  
  public reset() {
    this._positionProperty.reset();
  }
}
```

### Stylistic Considerations

**Avoid Constructor Parameter Properties** In this simulation, we have purposefully decided not to use constructor 
parameter properties, since it can lead to a confusing mix of parameter properties and other properties, or properties 
that are undocumented because they are parameter properties.

## Model

This section highlights the more interesting parts of the model.

### Model Parameters

When the sim is run with `?dev`, a _Developer_ accordion box will appear in the upper-left corner of each screen.
It provides controls for tuning various model parameters, and enabling other development features 
(pickup coil sample points, pickup coil debugger, etc.)

### Clock

Model algorithms ported from Java require a constant dt clock, firing at a constant framerate; see `ConstantDtClock`.
Instead of overriding `step`, model subclasses listen to ConstantDtClock.

All stepping in this sim is handled by the model; there is no stepping in the view.

### Bar Magnet 

It is not feasible to implement a numerical model of a bar magnet's B-field directly, as it relies on double integrals. 
So `BarMagnet` is a "Hollywood" model of a bar magnet, based on a static set of field vectors that were 
generated using MathCAD. See [model.md](https://github.com/phetsims/faradays-electromagnetic-lab/blob/main/doc/model.md#bar-magnet)
for a more complete discussion. See also `BarMagnetFieldGrid` and `BarMagnetFieldData`. 

### Electromagnet 

The electromagnet is also a "Hollywood" model, based on a coil magnet. See details in `Electromagnet` and `CoilMagnet`.

### Coil

The same coil implementation (`Coil`) is used for both the pickup coil and the electromagnet coil. The concept of "normalized current"
is fundamental to understanding the sim model.  It is described in [model.md](https://github.com/phetsims/faradays-electromagnetic-lab/blob/main/doc/model.md#bar-magnet) and in `Coil`.

The most complicated part of the sim may be `Coil.createCoilSegments`. It creates an ordered `CoilSegment[]` that describes the 
shape of the coil, and the path that charged particles follow as they flow through the coil. So that objects (bar magnet, compass,...) may
pass through the coil, CoilSegments are designated as belonging to either the foreground layer or background layer of the coil.

### Pickup Coil

`PickupCoil` is also a "Hollywood" model, and implements Faraday's Law. It includes a number of parameters for calibrating
the behavior of the coil. See especially `calibrateEMF`.

### Class hierarchy

This diagram shows the most important part of the model class hierarchy.

```
FELMovable
  FieldMeasurementTool
    Compass
      ImmediateCompass
      IncrementalCompass
      KinematicCompass
    FieldMeter
  Magnet
    BarMagnet
    CoilMagnet
      Electromagnet
  PickupCoil

CurrentIndicator
  LightBulb
  Voltmeter
  
CurrentSource
  ACPowerSupply
  DCPowerSupply
```

### Composition at the TModel level

This diagram shows the _composition_ (not class hierarchy) for each Screen's TModel.

```
BarMagnetScreenModel
  BarMagnet
  KinematicCompass
  FieldMeter

PickupCoilScreenModel
  BarMagnet
  PickupCoil
    Coil
      ChargedParticle[]
    LightBulb
    Voltmeter
  KinematicCompass
  FieldMeter

ElectromagnetScreenModel
  Electromagnet
    Coil
      ChargedParticle[]
    ACPowerSupply
    DCPowerSupply
  IncrementalCompass
  FieldMeter

TransformerScreenModel
  Transformer
    Electromagnet
      Coil
        ChargedParticle[]
      ACPowerSupply
      DCPowerSupply
    PickupCoil
      Coil
        ChargedParticle[]
      LightBulb
      Voltmeter
  IncrementalCompass
  FieldMeter

GeneratorScreenModel
  Generator
    Turbine
      BarMagnet
      WaterFaucet
    PickupCoil
      Coil
        ChargedParticle[]
      LightBulb
      Voltmeter
  ImmediateCompass
  FieldMeter
```

## View

This section highlights the more interesting parts of the view.

`FieldNode` renders a visualization of the magnetic field efficiently using scenery `Sprites`.  The field is 
represented as a grid of evenly-spaced compass needles.  The red part of each needle points in the direction
of the field vector at the needle's location. The opacity of a needle varies based on the field vector's 
magnitude.  Because the field magnitude decreases as a function of the distance cubed from the magnet, 
the magnitude (and therefore the needle opacity) is scaled to provide a better "look" for the visualization. 
See `FieldNode.normalizeMagnitude`.

`CoilNode` is the visualization of a coil, used for both the electromagnet coil and pickup coil.
To simulate objects passing "through" the coil,` CoilNode` consists of two layers, referred to as the
foreground and background, which are added to the scene graph separately.

`CurrentNode` renders a representation of current efficiently using scenery `Sprites`. 
Current is represented as either electrons or imaginary positive charges, depending on the 
current convention that is selected in Preferences. Two instances
of `CurrentNode` are required, for foreground and background layers of a coil.  As current
flow in a coil, charges move between the foreground and background layers of the coil.

Note that when dragging objects, they intentionally do not move to the front, as they do in many other
PhET sims. There is pedagogical significance to the rendering order in this sim, and that rendering order 
is intended to be static. See https://github.com/phetsims/faradays-electromagnetic-lab/issues/10#issuecomment-1911160748
for rendering order decisions.

The Java version implemented collision detection, so that some (but not all) objects collided with a coil. 
The HTML5 version takes a more consistent approach, has no collision detection, and allows all objects to magically pass through the coils.

## Sound

As of the 1.0 release, UI Sounds are supported, while sonification is not supported.

`WaterFaucetNode` has a temporary implementation for UI Sounds, intended to be removed when sound design is
completed for `FaucetNode`; see [scenery-phet#840](https://github.com/phetsims/scenery-phet/issues/840). 

`FELSonifier` and its subclasses may be ignored. They are experimental sonification code that is not included in 
the 1.0 release. We will revisit this code in a future release.

## Alternative Input

To identify code related to focus order, search for `pdomOrder`.

To identify sim-specific support for keyboard input, search for `tagName`. These classes have custom input listeners
(typically `KeyboardDragListener`) that handle keyboard events.

This sim currently does not make use of hotkeys (aka, shortcuts). But if it does in the future... 
To identify hotkeys, search for `new KeyboardListener`.

When a draggable object has focus, it is immediately draggable. This sim does not use `GrabDragInteraction`, which
requires a Node that has focus to be "grabbed" before it can be dragged. PhET typically does not use `GrabDragInteraction`
until Description is supported.

## PhET-iO

The PhET-iO instrumentation of this sim is relatively straightforward. As described
in [Memory Management](https://github.com/phetsims/faradays-electromagnetic-lab/blob/main/doc/implementation-notes.md#memory-management),
everything that needs to be stateful is created at startup, and exists for the lifetime of the sim. 
So there are no sim-specific uses of `PhetioGroup` or `PhetioCapsule`.
