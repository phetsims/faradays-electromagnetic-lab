TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/71

Reuse description from doc/java-version/Physics_Implementation.pdf.

MathCAD data and the B-field. See BarMagnetFieldData.ts.

Model algorithms ported from Java require a constant dt clock, firing at a constant framerate. 
FELScreenModel creates an instance of ConstantDtClock to implement this.  Instead of overriding
step, subclasses of FELScreenModel should add a listener to the ConstantDtClock.
See ConstantDtClock.ts and FELScreenModel.ts.

All stepping is handled by the model.

Pickup coil model is Hollywood. See PickupCoil.ts.

CoilNode handles both the model and view parts of electrons. This is because the 
path that electrons follow is dependent on how the coil is displayed.
See `updateElectrons` in CoilNode.ts, Electron.ts, and ElectronNode.ts.

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