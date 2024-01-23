These files were copied from the Java version, which was hosted at this URL (password required):
https://phet.unfuddle.com/a#/projects/9404/repositories/23262/browse?path=%2Ftrunk%2Fsimulations-java%2Fsimulations%2Ffaraday%2Fdoc

The files of greatest significance are bFieldOfHorizCylinderNumerical.*.  It was not feasible to implement a numerical
model for a magnet's B-field, as it relies on double integrals. So the model was implemented in MathCAD as a horizontal
cylinder. MathCAD was used to create 3 grids of B-field vectors; see BarMagnetFieldGrid.ts for details.
bFieldOfHorizCylinderNumerical.xmcd is the MathCAD file, and bFieldOfHorizCylinderNumerical.pdf is the PDF version.