TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/71

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