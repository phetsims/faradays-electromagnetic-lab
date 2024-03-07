# Faraday's Electromagnetic Lab - Implementation Notes

@author Chris Malley (PixelZoom, Inc.)

## Introduction

This document contains notes related to the implementation of _Faraday's Electromagnetic Lab_. This is not an exhaustive description
of the implementation. The intention is to provide a concise high-level overview, and to supplement the internal
documentation
(source code comments) and external documentation (design documents).

Before reading this document, please read:

* [model.md](https://github.com/phetsims/faradays-electromagnetic-lab/blob/main/doc/model.md), a high-level description of the
  simulation model

In addition to this document, you are encouraged to read:

* [PhET Development Overview](https://github.com/phetsims/phet-info/blob/main/doc/phet-development-overview.md)
* [PhET Software Design Patterns](https://github.com/phetsims/phet-info/blob/main/doc/phet-software-design-patterns.md)
* [Faraday's Electromagnetic Lab HTML5](https://docs.google.com/document/d/12bQuonZ1hva6zsBQhLQ3pEsiEJmg_rHLyGTY5Ae1J9w/edit?usp=sharing)
* [Faraday's Electromagnetic Lab PhET-iO Design](https://docs.google.com/document/d/1aDNiWlvI4y-TqvBI7zrV8LHQqNCgQL5XAHmQKorhbAQ/edit?usp=sharing)

This is a port from the 2005 Java version. In addition to these implementation notes,
you may find the legacy documents in doc/java-version/ to be helpful.

Reuse description from doc/java-version/Physics_Implementation.pdf.

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

Coil (model) and CoilNode (view) are generalized, and are used by the pickup coil
and electromagnet.

Pickup coil model is Hollywood. See PickupCoil.ts.

Electrons are lightweight, with no Properties, and no need to be PhET-iO stateful. 
They are create by Coil in `createElectrons` when the shape of the coil is changed
(by changing the number of loops, or the loop area).

ElectronsNode renders all Electrons efficiently using scenery Sprites. Two instances
of ElectronsNode are required, for foreground and background layers. 

Ignore FELSonifier and its subclasses. This is experimental sonification code
that is not included in the 1.0 release.

This pattern may be unfamiliar and is used frequently in the model for Properties.
The public API is readonly, while the private API is mutable.
Both fields refer to the same Property instance.
The field names are similar, with the private field name having an underscore prefix.

```ts
// Position of this model element
public readonly positionProperty: TReadOnlyProperty<Vector2>;
private readonly _positionProperty: Property<Vector2>;

public constructor( ... ) {
  ...
  this._positionProperty = new Vector2Property( ... );
  this.positionProperty = this._positionProperty;
}
```

## At A Glance

Most important part of the model class hierarchy:

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

_Composition_ (not class hierarchy) for each Screen's TModel:

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