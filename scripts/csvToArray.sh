#!/bin/bash
#=======================================================================================================================
#
# Converts a CSV file of B-field values to a number[][] that can be pasted into JavaScript code.
# Each line of the CSV file is converted to a number[].
# This script was used to create the arrays in BarMagnetFieldData.ts.
# See faradays-electromagnetic-lab/assets/bfield/README.txt for more details.
#
# Usage: csvToArray.sh ../assets/bfield/BX_internal.csv
#
# NOTE: You will need to remove the final ',' at the end of the output.
#
# @author Chris Malley (PixelZoom, Inc.)
#
#=======================================================================================================================

filename="$1"
echo "["
cat "$filename" | tr -d '\r' | while read -r line; do
  echo "[ $line ],"
done
echo "]"