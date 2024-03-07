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

This document contains notes related to the implementation of _Faraday's Electromagnetic Lab_. This is not an exhaustive description
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

This is a port from the 2005 Java version. In addition to these implementation notes,
you may find the legacy documents in [doc/java-version/](https://github.com/phetsims/faradays-electromagnetic-lab/tree/main/doc/java-version) to be helpful.

## General Considerations

### Coordinate Frames

This simulation does not use `ModelViewTransform2` for mapping between model and view coordinate frames. 
The model and view coordinate frames are identical; they both use the scenery coordinate frame. This is a non-standard
approach for modern PhET sims, but was the approach used in the Java version. Since so much code was directly reusable
from the Java version, and since changing the model coordinate frame proved to be difficult, we decided to make this 
compromise. For history, see [faradays-electromagnetic-lab#19](https://github.com/phetsims/faradays-electromagnetic-lab/issues/19).

This has the following implications for the model, and the presentation of model values in PhET-iO:

* Position and distance values are unitless.
* +x is to the right.
* +y is _down_.
* +angle is _clockwise_. A vector with 0 angle points to the right.

While `ModelViewTransform2` is not used, a manual transform is applied for y and angle values. When there values are 
presented in the UI, the sign of y and angle values are changes to correspond to the more standard "+y up" and 
"+angle counterclockwise".  For performance reasons, we change the sign by multiplying by -1, rather than using a
`ModelViewTransform2`.  

### Query Parameters

Query parameters are used to enable sim-specific features. Sim-specific query parameters are documented
in `FELQueryParameters.ts`. Running with `?log` will print the complete set of query parameters (common-code, PhET-iO,
and sim-specific) to the browser console.

### Memory Management

**Dynamic allocation:** Most objects in this sim are allocated at startup, and exist for the lifetime of the simulation. 
The exceptions to this are as follows:

Changing a `Coil` (`numberOfLoopsProperty` or `loopAreaProperty`) results in disposal and creation of the model 
and view elements that make up the coil: `CoilSegment`, `CoilSegmentNode`, `QuadraticBezierSpline`, `Electron`,
and `ElectronSpriteInstance`. None of these need to be stateful for PhET-iO.

Resizing the browser window (changing ScreenView `visibleBoundsProperty`) results in disposal and creation of
`CompassNeedleSpriteInstance`, to make the magnetic field visualization fill the browser 
window. `CompassNeedleSpriteInstance` does not need to be stateful for PhET-iO.

**Listeners**: Unless otherwise noted in the code, uses of `link`, `addListener`, etc. do _not_ need a corresponding
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

**Class fields of type Property** This pattern may be unfamiliar and is used frequently for model Properties.
We desired a public API that is readonly, while the private API is mutable.  This is accomplished using
two class fields, both of which refer to the same Property instance. The field names are similar, with the private
field name having an underscore prefix. Here's an example:

```ts
class SomeClass {
  
  // Position of this model element
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

## Model

MathCAD data and the B-field. See BarMagnetFieldData.ts.

Model algorithms ported from Java require a constant dt clock, firing at a constant framerate.
FELScreenModel creates an instance of ConstantDtClock to implement this.  Instead of overriding
step, subclasses of FELScreenModel should add a listener to the ConstantDtClock.
See ConstantDtClock.ts and FELScreenModel.ts.

All stepping is handled by the model.

The most complicated part of the sim may be `Coil.createCoilSegments`. It creates
an ordered `CoilSegment[]` that describes the shape of the coil, and the path that
electrons follow as they flow through the coil.  So that objects (bar magnet, compass,...) may
pass through the coil, CoilSegments are designated as belonging to either the
foreground layer or background layer of the coil.

PickupCoil is a "Hollywood" model. See PickupCoil.ts.

The most important part of the model class hierarchy is:

```
CurrentIndicator
  LightBulb
  Voltmeter
  
CurrentSource
  ACPowerSupply
  DCPowerSupply

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
```

This diagram shows the _composition_ (not class hierarchy) for each Screen's TModel:

```
BarMagnetScreenModel
  BarMagnet
  KinematicCompass
  FieldMeter

PickupCoilScreenModel
  BarMagnet
  PickupCoil
    Coil
      Electron[]
    LightBulb
    Voltmeter
  KinematicCompass
  FieldMeter

ElectromagnetScreenModel
  Electromagnet
    Coil
      Electron[]
    ACPowerSupply
    DCPowerSupply
  IncrementalCompass
  FieldMeter

TransformerScreenModel
  Transformer
    Electromagnet
      Coil
        Electron[]
      ACPowerSupply
      DCPowerSupply
    PickupCoil
      Coil
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
        Electron[]
      LightBulb
      Voltmeter
  ImmediateCompass
  FieldMeter
```

## View

`ElectronsNode` renders all Electrons efficiently using scenery `Sprites`. Two instances
of `ElectronsNode` are required, for foreground and background layers of a coil.

## Sound

As of the 1.0 release, UI Sounds are supported, while sonification is not supported.

`WaterFaucetNode` has a temporary implementation for UI Sound, intended to be removed when sound design is
completed for `FaucetNode`; see [scenery-phet#840](https://github.com/phetsims/scenery-phet/issues/840). 

`FELSonifier` and its subclasses may be ignored. They are experimental sonification code that is not included in 
the 1.0 release. We will revisit this code in a future release.

## Alternative Input

To identify code related to focus order, search for `pdomOrder`.

To identify sim-specific support for keyboard input, search for `tagName`. These classes have custom input listeners
(typically `KeyboardDragListener`) that handle keyboard events.

This sim currently does not make use of hotkeys (aka, shortcuts). But if it does in the future... 
To identify hotkeys, search for `addHotkey`.

When a draggable object has focus, it is immediately draggable. This sim does not use `GrabDragInteraction`, which
requires a Node that has focus to be "grabbed" before it can be dragged. PhET typically does not use `GrabDragInteraction`
until Description is supported.

## PhET-iO

The PhET-iO instrumentation of this sim is relatively straightforward. As described
in [Memory Management](https://github.com/phetsims/faradays-electromagnetic-lab/blob/main/doc/implementation-notes.md#memory-management),
everything that needs to be stateful is created at startup, and exists for the lifetime of the sim. 
So there is no sim-specific use of `PhetioGroup` or `PhetioCapsule`.